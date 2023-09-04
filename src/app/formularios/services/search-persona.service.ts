import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators'


interface personaReniec {
  dni: string
  nombres: string 
  apellidoPaterno: string
  apellidoMaterno: string
  codVerifica: number
  estado:boolean
}

@Injectable({
  providedIn: 'root'
})
export class SearchPersonaService {

  public baseUrl:string ='http://localhost:8080';
  constructor(private http: HttpClient) { }


  searchDniruc(dni:string){
    // try {
      const url = `${this.baseUrl}/peremp/listarOne?dni=${dni}`;
      return this.http.get<any>(url)

    // } catch (error) {
    //   console.log('ERROR USUARIO', error)
    //   return 'error'
    // }
  }

  searchDnirucApi(dni:string){
    // try {
      const url = `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImZyZWRyb21lby4wMDFAZ21haWwuY29tIn0.OEv1a3EvWTuVNfrPKyenHmo3gpOkgRcvdFP8X5Xl6yc`;
      return this.http.get<any>(url)

    // } catch (error) {
    //   console.log('ERROR USUARIO', error)
    //   return 'error'
    // }
  }

      //** DASHBOARD DATOS A MOSTRAR USUARIOS ALERTAS*/
      agregarPersonaReniec({dni,nombres,apellidoPaterno,apellidoMaterno,codVerifica, estado}:personaReniec){
        try {
          const url = `${this.baseUrl}/peremp/agregar`;
          return this.http.post<any>(url,{dni,nombres,apellidoPaterno,apellidoMaterno,codVerifica, estado}).pipe(
            map((resp)=> resp ),
            // catchError( err => err)
          )
        } catch (error) {
          console.log('ERROR USUARIO', error)
          return
        }
      }


}
