import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isUserLogged: boolean = true;

  constructor() { }

  isUserLoggedIn(): boolean{
    return this.isUserLogged;  
  }

  signIn(email:string, password: string) {

  }

  signUp(username: string, email:string, password: string) {

  }

  logout() {
    this.isUserLogged = false;
  }
}
