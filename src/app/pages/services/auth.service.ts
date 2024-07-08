import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.tokenService.loggedIn());
  authStatus = this.loggedIn.asObservable();

  constructor(private tokenService: TokenService) { }

  changeAuthStatus(value: boolean): void { // Use void return type
    this.loggedIn.next(value);
  }

  login(token: string): void {
    this.tokenService.handle(token);
    this.changeAuthStatus(true);
  }

  logout(): void {
    this.tokenService.removeToken();
    this.changeAuthStatus(false);
  }
}
