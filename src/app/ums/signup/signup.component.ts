import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';

interface Jwt {
  access_token: string;
  token_type: string;
  expires_in: number;
  user_name: string;
  email: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  constructor(private toastr: ToastrService, private authSetviceUms: AuthService, private router: Router) {
    authSetviceUms.onUserSignedUp.subscribe(
      (user: User) => {
        this.router.navigate(['/ums']);
      }
    )
  }

  ngOnInit(): void {}

  signUp(form: NgForm) {
    if (!form.valid) this.toastr.error('Credenziali non valide');
    else
      this.authSetviceUms.signUp(form.value.name, form.value.email, form.value.password).subscribe(
        (payload: Jwt) => {
          this.router.navigate(['/ums']);
        },
        ({ message: msg, name: title }) => {
          this.toastr.error(msg, title);
        }
      );
  }
}
