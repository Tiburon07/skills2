import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';

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
  private apiUrl = "http://laraapi.test/api/users"

  constructor(private http: HttpClient) {}


  getUsers() {
    return this.http.get<UsersResonse>(this.apiUrl);
  }

  getUser(id: number) {
    let url = this.apiUrl + '/' + id
    return this.http.get<UserResonse>(url);
  }     

/*  deleteUser(user: User): void {
    let index = this.users.indexOf(user);
    if (index >= 0) this.users.splice(index, 1);
  }*/

  deleteUser(user: User){
    return this.http.delete<UserResonse>(this.apiUrl + '/' + user.id)
  }

  /*updateUser(user: User): void {
    const idx = this.users.findIndex((v) => v.id == user.id);
    if (idx !== -1) this.users[idx] = user;
  }*/

  updateUser(user: User) {
    return this.http.patch<UserResonse>(this.apiUrl + '/' + user.id, user)
  }

  /*insertUser(user: User): void {
    user.id = this.users.length + 1;
    this.users.push(user);
  }*/

  insertUser(user: User) {
    return this.http.post<UserResonse>(this.apiUrl, user)
  }

}
