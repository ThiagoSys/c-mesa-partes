import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as xml2js from 'xml2js';
import * as soap from 'soap';



interface  InterfaceDocumento {
  asunto: String,
  claveWeb: String,
  documentoAdjunto: String,
  fecCreacion: String,
  fecDocumento: String,
  flgAnexo: String,
  flgTupa: String,
  folios: String,
  idAno: String,
  idDestino: String,
  idDocumento: String,
  idDocumentoPadre: String,
  idNroDocumento: String,
  idRemitenteE: String,
  idTipoDocumento: String,
  idTupa: String,
  nombreRemitente: String,
  nroDocumentoDoc: String,
  numDocumentoPadre: String,
  observaciones: String,
  plazo: String,
  remitente: String,
  reservado: String,
  tipo: String,
  usuCreacion: String
}

@Injectable({
  providedIn: 'root'
})
export class SoaptramiteService {
  public baseUrl:string ='http://localhost:5050';
  constructor(private http: HttpClient) { }

  documentoSoap(hashCode: string) {
    const url = `${this.baseUrl}/api/xmlsoap`;
    return this.http.get<any>(url)
  }

  getOficinasXml() {
    const url = `${this.baseUrl}/api/xmloficinas`;
    return this.http.get<any>(url)
  }

  getDocumentosXml():Observable<any> {
    // try {
      const url = `${this.baseUrl}/api/xmldocumentos`;
      return this.http.get<any>(url).pipe(
        map((resp)=> resp ),
        catchError((error:any)=>{
          if(error.ok==false && error.status==0){
            throw new Error(`${error.statusText}`)
          }else{
            throw new Error(`Errror de connexion`)
          }
        })
      )
  }

  getDocumentoIngresadoXml({ idDoc }:{ idDoc:String }) {
    const url = `${this.baseUrl}/api/xmldocumentoingresado`;
    const body = { idDoc}
    return this.http.post<any>(url,body).pipe(
      map((resp)=> resp ),
      // catchError( err => err)
    )
  }

  getDatosPersonaXml({ paterno, materno, nombres, telefono, tipoDocumentoP, tipoPersona, nroDoc, ruc, correo,direccion }:{ paterno:string, materno:string, nombres:string, telefono:string, tipoDocumentoP:string, tipoPersona:string, nroDoc:string, ruc:string, correo:string,direccion:string }) {

    const url = `${this.baseUrl}/api/xmldatospersona?paterno=${paterno}&materno=${materno}&nombres=${nombres}&telefono=${telefono}&tipoDocumentoP=${tipoDocumentoP}&tipoPersona=${tipoPersona}&nroDoc=${nroDoc}&ruc=${ruc}&correo=${correo}&direccion=${direccion}`;
    return this.http.get<any>(url)
  }

  getDatosDocumentosXml({ asunto, claveWeb, documentoAdjunto, fecCreacion, fecDocumento, flgAnexo, flgTupa, folios, idAno, idDestino, idDocumento, idDocumentoPadre, idNroDocumento, idRemitenteE, idTipoDocumento, idTupa, nombreRemitente, nroDocumentoDoc, numDocumentoPadre, observaciones, plazo, remitente, reservado, tipo, usuCreacion }:InterfaceDocumento) {

    const url = `${this.baseUrl}/api/xmldatosdocumentos`;
    const body  = { asunto, claveWeb, documentoAdjunto, fecCreacion, fecDocumento, flgAnexo, flgTupa, folios, idAno, idDestino, idDocumento, idDocumentoPadre, idNroDocumento, idRemitenteE, idTipoDocumento, idTupa, nombreRemitente, nroDocumentoDoc, numDocumentoPadre, observaciones, plazo, remitente, reservado, tipo, usuCreacion }

    return this.http.post<any>(url,body).pipe(
      map((resp)=> resp ),
      // catchError( err => err)
    )
  }


  // TODO BUSCAR CON DNI
  getDatosPersonaReniecXml({ documento }:{ documento:string }) {
    const url = `${this.baseUrl}/api/xmldatospersonareniec`;
    const body = { documento }
    return this.http.post<any>(url, body)
  }
  // TODO BUSCAR CON RUC 
  getDatosEmpresaSunatXml({ documento }:{ documento:string }) {
    const url = `${this.baseUrl}/api/xmldatosempresasunat`;
    const body = { documento }
    return this.http.post<any>(url, body)
  }

  // TODO ENVIAR CORREO
  enviarCorreo({email, documento, file }:{ email:String, documento:any, file:any}){
    const url = `${this.baseUrl}/api/enviaremail`;
    const body = { email, documento, file }
    return this.http.post<any>(url, body )
  }
  // TODO GUARDAR LOS DOCUMENTOS Y ANEXOS EN FORMATO PDF
  saveOnePdf(body:FormData):Observable<any>{
    const url = `${this.baseUrl}/api/savepdf`;
    return this.http.post<any>(url, body )
  }
  // TODO CREAR UN PDF DE EXPEDIENTE
  generateOnePdf(body:FormData){
    const url = `${this.baseUrl}/api/generatepdf`;
    // console.log('D', datos)
    // return this.http.post(url, { observe:'response', responseType:'blob'}  )
    return this.http.post(url, body)
  }

  // TODO CONSULTAR EL EXPEDIENTE
  apiConsultarExp({nroexp, anio, claveweb}:{nroexp:string,anio:string, claveweb:string}){
    const url = `${this.baseUrl}/api/xmlconsultaexpediente`;
    const body = { nroexp, anio, claveweb}
    // console.log('D', datos)
    // return this.http.post(url, { observe:'response', responseType:'blob'}  )
    return this.http.post(url, body)
  }
}
