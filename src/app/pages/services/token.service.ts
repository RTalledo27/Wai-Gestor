import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  handle(token: any) {
   this.setToken(token);
   console.log(this.isValid());
  }

  setToken(token: any) {
    return localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  isValid(){
    const token = this.getToken();
    if (token) {
      const payload = this.payload(token);
      console.log(payload);
      if (payload) {
        return payload.iss === 'http://127.0.0.1:8000/api/auth/login' ? true : false;
      }
    }
    return false;
  }


  payload(token: any) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload: any){
    try {
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error decoding payload:', e);
      return null;
    }
  }

  loggedIn(){
    return this.isValid();
  }

}

