import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment'

interface UsersResonse {
  data: User[];
  message: string;
  success: boolean;
}

interface UserResonse {
  data: User;
  message: string;
  success: boolean;
}

@Injectable()

export class UserService {

  users: User[] = [];
  private apiUrl = environment.APIURL//"http://laraapi.test/api/users"

  constructor(private http: HttpClient, private authService: AuthService ) {}

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({Authorization: 'Bearer ' + this.authService.getToken()})
  }

  getUsers() {
    return this.http.get<UsersResonse>(this.apiUrl, {headers :this.getAuthHeader()});
  }

  getUser(id: number) {
    let url = this.apiUrl + '/' + id
    return this.http.get<UserResonse>(url, {headers: this.getAuthHeader()});
  }     

  deleteUser(user: User){
    return this.http.delete<UserResonse>(this.apiUrl + '/' + user.id, {headers: this.getAuthHeader() })
  }

  updateUser(user: User) {
    return this.http.patch<UserResonse>(this.apiUrl + '/' + user.id, user, {headers: this.getAuthHeader()})
  }

  insertUser(user: User) {
    console.log(user);
    return this.http.post<UserResonse>(this.apiUrl, user, {headers: this.getAuthHeader()})
  }

}
