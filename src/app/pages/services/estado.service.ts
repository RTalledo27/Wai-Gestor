import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Estados } from '../models/estados';


@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  constructor( private http:HttpClient) {

   }

   urlApiEstado = "http://127.0.0.1:8000/api/v1/estados/";

   getEstados(): Observable<Estados[]>{
    return this.http.get<any>(this.urlApiEstado)
    .pipe(
      map(response => response.data as Estados[])
      );
   }
}
