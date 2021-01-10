import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  title = 'Users';
  userSelected: User = new User();
  users: User[] | undefined;
  showForm: boolean = false;

  constructor(private service: UserService, private route: ActivatedRoute, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.service.getUsers().subscribe(
      res => {
        this.users = res.data;
      });
  }

  newUser() {
    this.showForm = true;
    this.userSelected = new User();
  }

  onDeleteUser(user: User) {
    this.service.deleteUser(user).subscribe(
      res => {
        if (res.success) {
          this.toastr.success(res.message);
          this.getUsers();
        } else {
          this.toastr.error(res.message);
        }
      },
      err => {
        console.log(err);
        this.toastr.error(err.error.message);
      }
    );
  }

  onSelectUser(user: User) {
    this.showForm = true;
    const userCopy = Object.assign({}, user);
    this.userSelected = userCopy
  }

  onUpdateUser(user: User) {
    this.service.updateUser(user);
  }

  onInsertUser(user: User) {
    this.service.insertUser(user);
  }

}
