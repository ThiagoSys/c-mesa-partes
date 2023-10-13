import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
  // public baseUrl:string ='http://localhost:5050';
  public baseUrl:string ='https://apps.municieneguilla.gob.pe:5050';

  constructor(private http: HttpClient) { }

  documentoSoap(hashCode: string) {
    const url = `${this.baseUrl}/api/xmlsoap`;
    return this.http.get<any>(url)
  }

  getOficinasXml(): Observable<any> {
    const url = `${this.baseUrl}/api/xmloficinas`;
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
  
  getDatosDocumentosXml({ asunto, claveWeb, documentoAdjunto, fecCreacion, fecDocumento, flgAnexo, flgTupa, folios, idAno, idDestino, idDocumento, idDocumentoPadre, idNroDocumento, idRemitenteE, idTipoDocumento, idTupa, nombreRemitente, nroDocumentoDoc, numDocumentoPadre, observaciones, plazo, remitente, reservado, tipo, usuCreacion }:InterfaceDocumento) {

    const url = `${this.baseUrl}/api/xmldatosdocumentos`;
    const body  = { asunto, claveWeb, documentoAdjunto, fecCreacion, fecDocumento, flgAnexo, flgTupa, folios, idAno, idDestino, idDocumento, idDocumentoPadre, idNroDocumento, idRemitenteE, idTipoDocumento, idTupa, nombreRemitente, nroDocumentoDoc, numDocumentoPadre, observaciones, plazo, remitente, reservado, tipo, usuCreacion }

    return this.http.post<any>(url,body).pipe(
      map((resp)=> resp ),
      // catchError( err => err)
    )
  }


  // TODO AGREGAR PERSONA O EMPRESA
  getDatosPersonaXml({ paterno, materno, nombres, telefono, tipoDocumentoP, tipoPersona, nroDoc, ruc, correo,direccion }:{ paterno:string, materno:string, nombres:string, telefono:string, tipoDocumentoP:string, tipoPersona:string, nroDoc:string, ruc:string, correo:string,direccion:string }) {
    const url = `${this.baseUrl}/api/xmldatospersona`;
    const body = { paterno, materno, nombres, telefono }
    return this.http.post<any>(url, body)
  }

  // TODO BUSCAR CON DNI
  getDatosPersonaReniecXml({ documento }:{ documento:string }): Observable<any> {
    const url = `${this.baseUrl}/api/xmldatospersonareniec`;
    const body = { documento }
    return this.http.post<any>(url, body).pipe( catchError((error: HttpErrorResponse)=>{
      if (error.status === 0) { return throwError(() => new Error('El servidor no está disponible.')); }
      return throwError(() => new Error('Error en la solicitud. Por favor, inténtelo de nuevo más tarde.'));
    }))
  }
  // TODO BUSCAR CON RUC 
  getDatosEmpresaSunatXml({ documento }:{ documento:string }){
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
    return this.http.post(url, body)
  }
}
