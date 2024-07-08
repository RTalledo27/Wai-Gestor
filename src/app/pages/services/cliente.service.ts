import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Clientes } from '../models/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor( private http: HttpClient) { 
    this.http = http;
  }

  apiUrlCliente = "http://127.0.0.1:8000/api/v1/clientes";

  updateCliente(idCliente:number, cliente: Clientes):Observable<Clientes>{
    return this.http.put<Clientes>(`${this.apiUrlCliente}/${idCliente}`, cliente)
    .pipe(
      map(response => response as Clientes)
      );
  }
}
