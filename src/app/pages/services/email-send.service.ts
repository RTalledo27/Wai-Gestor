import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailSendService {

  http: HttpClient;

  constructor( http: HttpClient) {
    this.http = http;
   }

  apiUrlEmailSend = "http://127.0.0.1:8000/api/detalles";


  sendEmail(idProyecto:number){
    return this.http.post<any>(`${this.apiUrlEmailSend}/${idProyecto}`, {withCredentials:false});
  }


}
