import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/User';
import { NgxSpinnerService } from "ngx-spinner";
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment'


interface Jwt {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Output() onUserSignedIn = new EventEmitter<User>()
  @Output() onUserSignedUp = new EventEmitter<User>()
  @Output() onUserLogout = new EventEmitter()

  private authURL = environment.AUTHURL;//'http://laraapi.test/api/auth/'
  private isUserLogged!: boolean;

  constructor(private http: HttpClient, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  isUserLoggedIn(): boolean{
    this.isUserLogged = !!localStorage.getItem('token');
    return this.isUserLogged;
  }

  signIn(email: string, password: string) {
    let user = new User();
    this.spinner.show();
    return this.http.post<Jwt>(this.authURL + 'login', { email: email, password: password })
      .pipe(
        tap((payload: Jwt) => {
          localStorage.setItem('token', payload.access_token);
          localStorage.setItem('user', JSON.stringify(payload));
          user.name = payload.user_name;
          this.onUserSignedIn.emit(user)
          this.spinner.hide();
        },
        (httpResp: HttpErrorResponse) => {
          this.spinner.hide();
        })
      )
  }

  signUp(username: string, email: string, password: string) {
    let user = new User();
    this.spinner.show();
    return this.http.post<Jwt>(this.authURL + 'signup', { email: email, password: password, name: username })
      .pipe(
        tap((payload: Jwt) => {
          localStorage.setItem('token', payload.access_token);
          localStorage.setItem('user', JSON.stringify(payload));
          user.name = payload.user_name;
          this.onUserSignedUp.emit(user)
          this.spinner.hide();
        },
        (httpResp: HttpErrorResponse) => {
          this.spinner.hide();
        })
      )
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.onUserLogout.emit()
    this.isUserLogged = false;
  }

  getUser(): User {
    let user = new User();
    const data = JSON.parse(String(localStorage.getItem('user')));
    if (data) {
      user.name = data['user_name'];
      user.email = data['email']
    }
    return user;
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
