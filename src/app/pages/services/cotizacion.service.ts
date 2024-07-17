import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importa el operador map
import { Elementos } from '../models/elementos';
import { Cotizaciones } from '../models/cotizaciones';
import { ElementosCotizacion } from '../models/elementos_cotizacion';

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  apiUrl = "http://127.0.0.1:8000/api/v1/cotizaciones";
  http: HttpClient; // Add the http property
  apiUrlElementosCotizacion = "http://127.0.0.1:8000/api/v1/elementos-cotizaciones";


  apiUrlElementos="http://127.0.0.1:8000/api/v1/elementos";
  constructor(http: HttpClient) {
    this.http = http; // Initialize the http property in the constructor
  }

  getCotizacionByID(idProyecto: number): Observable<Cotizaciones> {
    return this.http.get<any>(`${this.apiUrl}/${idProyecto}`)
        .pipe(
            map(response => response.data as Cotizaciones)
        );
}



  registrarCotizacion(cotizacion: Cotizaciones): Observable<Cotizaciones> {
    return this.http.post<Cotizaciones>(this.apiUrl, cotizacion)
    .pipe(
      map(response => response as Cotizaciones)
    );
  }

  //UPDATE COTIZACION
  updateCotizacion(idProyecto: number,cotizacion: Cotizaciones): Observable<Cotizaciones> {
    return this.http.put<Cotizaciones>(`${this.apiUrl}/${idProyecto}`, cotizacion)
    .pipe(
      map(response => response as Cotizaciones)
    );
  }


  //ELEMENTOS - COTIZACION

  registrarElemento_cotizacion(elemento_cotizacion: Elementos): Observable<ElementosCotizacion> {
    return this.http.post<ElementosCotizacion>(this.apiUrlElementosCotizacion, elemento_cotizacion)
    .pipe(
      map(response => response as ElementosCotizacion)
    );
  }

  getCotizaciones(): Observable<Cotizaciones[]> {
    return this.http.get<any>(this.apiUrl)
    .pipe(
      map(response => response.data as Cotizaciones[])
    );
  }


  //ELEMENTOS:
  getElementos(): Observable<Elementos[]> {
    return this.http.get<any>(this.apiUrlElementos)
    .pipe( 
      map(response => response.data as Elementos[])
     );
  }

  registrarElemento(elemento: Elementos): Observable<Elementos> {
    return this.http.post<Elementos>(this.apiUrlElementos, elemento)
    .pipe(
      map(response => response as Elementos)
    );
  }


  //ELIMINAR ELEMENTOS COTIZACION:
  deleteElementos(idElementoCotizacion: number): Observable<ElementosCotizacion> {
    return this.http.delete<ElementosCotizacion>(`${this.apiUrlElementosCotizacion}/${idElementoCotizacion}`)
    .pipe(
      map(response => response as ElementosCotizacion)
    );
  }
 
}
