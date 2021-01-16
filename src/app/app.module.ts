import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { NgxSpinnerModule } from "ngx-spinner";
import {DataTablesModule} from 'angular-datatables';



//Currency format
registerLocaleData(localeIt);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { ErrorComponent } from './error/error.component';
import { ContactComponent } from './contact/contact.component';
import { MapManagerComponent } from './map/map-manager/map-manager.component';

//Leaflet
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { MapManagerService } from './map/map-manager/map-manager-service';

//UMS
import { UsersComponent } from './ums/users/users.component';
import { UserService } from './ums/services/user.service';
import { UserComponent } from './ums/user/user.component';
import { UserDetailComponent } from './ums/user-detail/user-detail.component';
import { UserProfileComponent } from './ums/user-profile/user-profile.component';
import { LoginComponent } from './ums/login/login.component';

//Google Books
import { GoogleBooksComponent } from './google-books/google-books.component';
import { GoogleBookService } from './google-books/google-book.service';
import { SignupComponent } from './ums/signup/signup.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    DashboardComponent,
    FooterComponent,
    ProfileComponent,
    ErrorComponent,
    ContactComponent,
    MapManagerComponent,
    UsersComponent,
    UserComponent,
    UserDetailComponent,
    UserProfileComponent,
    GoogleBooksComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({ timeOut: 30000}),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    LeafletModule,
    DataTablesModule
  ],
  providers: [UserService, GoogleBookService, MapManagerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
