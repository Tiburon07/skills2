import { Component, OnInit } from '@angular/core';
import { AuthService } from '../ums/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private authUmsService: AuthService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  logout() {
    this.authUmsService.logout();
    this.toastr.show(
    )

  }

}
