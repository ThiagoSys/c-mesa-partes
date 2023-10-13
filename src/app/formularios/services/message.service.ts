import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//const { RecaptchaEnterpriseServiceV1Beta1Client } = require('@google-cloud/recaptcha-enterprise');


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  // public baseUrl:string ='http://localhost:5050';
  public baseUrl:string ='https://apps.municieneguilla.gob.pe:5050/';
  constructor(private http: HttpClient) { }

    // TODO VALIDAR RECAPCHA
    postValidReCapcha(token: string) {
      //return token
      return this.http.post<any>(`${this.baseUrl}/api/verify-recaptcha`, { token });
      

    }



}
