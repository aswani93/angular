import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes,ActivatedRoute } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UsersService } from './serverdet/users.service';
import { UsersComponent } from './users/users.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { AuthenticationService } from './serverdet/authentication.service';
import { CanActiveService } from './serverdet/canactive.service';

const appRoutes : Routes = [
  {path: '', redirectTo:'/login',pathMatch:'full'},
  { path:'login' , component:LoginComponent},
  { path: "users" ,component:UsersComponent, canActivate :[CanActiveService] },
  
  
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UsersComponent,
    SidebarComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),

  ],
  exports: [RouterModule],
  providers: [UsersService,AuthenticationService,CanActiveService],
  bootstrap: [AppComponent]
})
export class AppModule { }
