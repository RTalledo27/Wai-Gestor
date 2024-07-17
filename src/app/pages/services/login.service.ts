import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Empleados } from '../models/empleados';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urlApiLogin = "https://api-wai-production-9813.up.railway.app/api/auth/login";
  urlApiMe = "http://127.0.0.1:8000/api/auth/me/";

  constructor(private http: HttpClient) { 
    
  }


  login(correo_empleado: EmailValidator, password: Text) {
    return this.http.post<any>(this.urlApiLogin, {  correo_empleado: correo_empleado, password: password },{withCredentials:false})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Manejar el error de autenticación
          const errorMessage = error.error.error;
          return throwError(()=>new Error(errorMessage));
        }else{
          console.log(error.message);
          return throwError(()=>new Error(error.message));
        }
      })
    );
  }

  dataLogin(): Observable<Empleados[]> {
    return this.http.get<any>(this.urlApiMe,{withCredentials:false})
    .pipe(map(response => response as Empleados[]));
  }
}
