import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorComponent } from './error/error.component';
import { GoogleBooksComponent } from './google-books/google-books.component';
import { MapManagerComponent } from './map/map-manager/map-manager.component';
import { ProfileComponent } from './profile/profile.component';

//UMS
import { UserDetailComponent } from './ums/user-detail/user-detail.component';
import { UserProfileComponent } from './ums/user-profile/user-profile.component';
import { UsersComponent } from './ums/users/users.component';
import { RouteGuardUmsService } from './ums/route-guard-ums.service';
import { LoginComponent } from './ums/login/login.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'map', component: MapManagerComponent },

  //UMS
  { path: 'ums/login', component: LoginComponent},
  { path: 'ums', component: UsersComponent, canActivate: [RouteGuardUmsService] },
  { path: 'users/new', component: UserDetailComponent, canActivate: [RouteGuardUmsService]  },
  { path: 'users/:id', component: UserProfileComponent, canActivate: [RouteGuardUmsService]  },
  { path: 'users/:id/edit', component: UserDetailComponent, canActivate: [RouteGuardUmsService]  },

  //Google Books
  { path: 'gbooks', component: GoogleBooksComponent },

  //Rotta 404
  { path: '**', component: ErrorComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteGuardUmsService]
})
export class AppRoutingModule { }
