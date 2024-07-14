import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators'; // Importa el operador map
import { Proyectos } from '../models/proyectos';
import { Empleados } from '../models/empleados';
import { Elementos } from '../models/elementos';
import { Clientes } from '../models/clientes';
import { Roles } from '../models/roles';
@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  constructor(private http: HttpClient) {}

  getUserDash() {
    return this.http.get('http://127.0.0.1:8000/api/v1/empleados/1' );/////Modificar
  }

  getInfoDash() {
    return this.http.get('http://127.0.0.1:8000/api/v1/dashboard')
    ;
  }

 /* getDesarrollador() {
    return this.http.get<Empleados>('http://127.0.0.1:8000/api/empleados/1');
    
  }*/

  private apiUrlProyectos = 'http://127.0.0.1:8000/api/v1/proyectos'; 
private apiUrlEmpleados= "http://127.0.0.1:8000/api/v1/empleados";
private apiUrlElementos= "http://127.0.0.1:8000/api/v1/elementos";
private apiUrlClientes = "http://127.0.0.1:8000/api/v1/clientes"
private apiUrlRoles = "http://127.0.0.1:8000/api/v1/roles"

  getProyectos(): Observable<Proyectos[]> {
    return this.http.get<any>(this.apiUrlProyectos || 'http://192.168.100.4:8000/api/v1/proyectos') // Obtiene la respuesta completa
      .pipe(
        map(response => response.data as Proyectos[]) // Extrae el array 'data' y lo convierte a Proyecto[]
      );
  }


  getProyecto(idProyecto: number): Observable<Proyectos> {
    return this.http.get<any>(`${this.apiUrlProyectos}/${idProyecto}`) // Obtiene la respuesta completa
      .pipe(
        map(response => response.data as Proyectos) // Extrae el objeto 'data' y lo convierte a Proyecto
      );
  }

  registrarProyecto(proyecto: Proyectos): Observable<Proyectos> {
    return this.http.post<Proyectos>(this.apiUrlProyectos, proyecto)
      .pipe(
        map(response => response as Proyectos)
      );
  }


  updateProyecto(idProyecto: number, proyecto: Proyectos): Observable<Proyectos> {
    return this.http.put<Proyectos>(`${this.apiUrlProyectos}/${idProyecto}`, proyecto)
      .pipe(
        map(response => response as Proyectos)
      );
  }


  getEmpleados(): Observable<Empleados[]>{
    return this.http.get<any>(this.apiUrlEmpleados || 'http://192.168.100.4:8000/api/v1/empleados')
    .pipe(
      map(response => response.data as Empleados[])
    );
    }

    getEmpleadoById(idEmpleado: number): Observable<Empleados> {
      return this.http.get<any>(`${this.apiUrlEmpleados}/${idEmpleado}`).pipe(
        map(response => response.data as Empleados)
      );
    }


    registrarEmpleado(empleado: Empleados): Observable<Empleados> {
      return this.http.post<Empleados>(this.apiUrlEmpleados, empleado)
      .pipe(
        map(response => response as Empleados));
    }

    updateEmpleado(idEmpleado: number, empleado: Empleados): Observable<Empleados> {
      return this.http.put<Empleados>(`${this.apiUrlEmpleados}/${idEmpleado}`, empleado)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 422) {  // Manejar errores de validación (HTTP 422)
            const errorMessage = error.error.error; // Acceder al mensaje de error de validación
            console.error('Error de validación:', errorMessage);
            return throwError(() => new Error(errorMessage)); // Usar throwError con una función que cree el error
          } else {
            console.error('Error al actualizar el empleado:', error.message);
            return throwError(() => new Error('Error desconocido al actualizar el empleado.')); // Manejar otros errores si es necesario
          }
        })
      );
    }
    

    //eliminar/desactivar empleado
    deleteEmpleadoById(idEmpleado: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrlEmpleados}/${idEmpleado}`);
    }

    //elementos:

    getElementos(): Observable<Elementos[]> {
      return this.http.get<any>(this.apiUrlElementos).pipe(
        map(response => response.data as Elementos[])
      );
    }

    getElementoById(idElemento:number): Observable<Elementos> {
      return this.http.get<any>(`${this.apiUrlElementos}/${idElemento}`).pipe(
        map(response => response.data as Elementos)
      );
    }

    updateElemento(idElemento: number, elemento: Elementos): Observable<Elementos> {
      return this.http.put<Elementos>(`${this.apiUrlElementos}/${idElemento}`, elemento)
      .pipe(
        map(response => response as Elementos));
    }

    //eliminar elemento
    deleteElementoByID(idElemento: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrlElementos}/${idElemento}`);
    }




    ///Clientes

    registrarCliente(cliente: Clientes): Observable<Clientes> {

      return this.http.post<Clientes>(this.apiUrlClientes, cliente);
    }

    //ROLES:

    getRoles(): Observable<Roles[]> {
      return this.http.get<any>(this.apiUrlRoles).pipe(
        map(response => response.data as Roles[])
      );
    }


  }
