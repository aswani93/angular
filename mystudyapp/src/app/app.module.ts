import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule , Routes } from '@angular/router';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import {UserserviceService } from './userservice.service';
import { ListComponent } from './list/list.component';
import { AuthguardService } from './authguard.service';
import {LoginService } from './login.service';
import { ReadmoreComponent } from './readmore/readmore.component';
import { InnerheaderComponent } from './innerheader/innerheader.component';

const appRoutes : Routes = [
  {path: '' , redirectTo: '/login', pathMatch:'full'},
  {path: 'login', component : LoginComponent },
  {path: 'list', component : ListComponent , canActivate : [AuthguardService]},
  {path: 'list/:id', component : ReadmoreComponent , canActivate : [AuthguardService]},
  {path: 'register', component : RegisterComponent},
  {path: '**', component: PagenotfoundComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PagenotfoundComponent,
    HeaderComponent,
    RegisterComponent,
    ListComponent,
    ReadmoreComponent,
    InnerheaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [UserserviceService,AuthguardService,LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
