import { Component, OnInit } from '@angular/core';
import { AuthService } from '../ums/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../ums/models/User';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public username: string = 'Tiberio Iordache';
  public isUserLoggedIn = false;

  constructor(private authUmsService: AuthService, private router: Router, private toastr: ToastrService) {
    authUmsService.onUserSignedIn.subscribe(
      (user: User) => {
        this.username = user.name
        this.isUserLoggedIn = true;
      }
    )
    authUmsService.onUserSignedUp.subscribe(
      (user: User) => {
        this.username = user.name
        this.isUserLoggedIn = true;
      }
    )
    authUmsService.onUserLogout.subscribe(
      (user: User) => {
        this.username = 'Tiberio Iordache';
        this.isUserLoggedIn = false;
      }
    )
  }

  ngOnInit(): void {
    this.isUserLoggedIn = this.authUmsService.isUserLoggedIn();
    if (this.isUserLoggedIn) {
      const user = this.authUmsService.getUser();
      this.username = user.name;
    }
  }

  logout(e: any) {
    this.authUmsService.logout();
    this.router.navigate(['login/ums'])
  }

  login(e: any) {
    this.isUserLoggedIn = this.authUmsService.isUserLoggedIn();
    this.router.navigate(['login/ums'])
  }

  signUp(e: any) {
    this.router.navigate(['signup/ums'])
  }
}
