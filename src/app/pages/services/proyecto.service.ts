import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Empleados } from '../models/empleados';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private http = inject(HttpClient);
  constructor() { }


  getInfoDash() {
    return this.http.get('http://127.0.0.1:8000/api/dashboard');
  }

 /* getDesarrollador() {
    return this.http.get<Empleados>('http://127.0.0.1:8000/api/empleados/1');
    
  }*/
}
