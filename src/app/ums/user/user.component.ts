import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'tr[app-user]',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input('user-data') user!: User;
  @Output('onDeleteUser') userDeleted = new EventEmitter();
  @Output('onSelectUser') userUpdate = new EventEmitter();

  constructor(private route: Router) { }

  ngOnInit(): void {

  }

  deleteUser(user: User): void {
    this.userDeleted.emit(user);
  }

  updateUser(user: User): void {
    this.route.navigate(['users', this.user.id,'edit'])
  }

  infoUser(user: User): void {
    this.route.navigate(['users', this.user.id])
  }
}
