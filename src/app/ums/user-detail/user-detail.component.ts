import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {

  title: string = "Nuovo Utente";

  private userCopy!: User;
  private __user!: User;

  @Input() set userSelected(user: User) {
    this.__user = user;
    this.userCopy = Object.assign({},user);
  }

  get userSelected() {
    return this.__user;
  }

  @Output('onUpdateUser') userUpdated = new EventEmitter();
  @Output('onInsertUser') userInsert = new EventEmitter();

  constructor(private service: UserService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userSelected = new User();
    this.route.paramMap.subscribe(
      (params) => {
        if (params.get('id')) {
          this.service.getUser(Number(params.get('id'))).subscribe(
            res => {
              this.userSelected = res.data;
              this.title = 'Utente ' + this.userSelected.fiscalcode;
            },
            err => {this.toastr.error(err.message, err.name)}
          );
        }
      }
    )
  }

  saveUser() {
    if (this.userSelected.id > 0) this.updateUser();
    else this.createUser();
  }

  updateUser() {
    this.service.updateUser(this.userSelected).subscribe(
      res => {
        if (res.success) {
          this.toastr.success(res.message);
          this.router.navigate(['ums']);
        } else {
          this.toastr.error(res.message);
        }
      },
      error => {this.toastr.error(error.message, error.name);}
    );
  }

  createUser() {
    this.service.insertUser(this.userSelected).subscribe(
      res => {
        if (res.success) {
          this.toastr.success(res.message);
          this.router.navigate(['ums']);
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

  resetForm(form: any) {
    if (this.userSelected.id === 0) this.userSelected = new User();
    else this.userSelected = this.userCopy;
  }

}
