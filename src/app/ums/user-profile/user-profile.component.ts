import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public user: User = new User();

  constructor(private service: UserService, private route: ActivatedRoute, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.user = new User();
    this.route.params.subscribe(p => this.service.getUser(p.id)
      .subscribe(
        res => {
          this.user = res.data;
        },
        error => {
          console.log(error)
          this.toastr.error(error.message, error.name)
        }
      )
    );
  }
}
