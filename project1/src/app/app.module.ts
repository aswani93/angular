import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatCheckboxModule,MatInputModule } from '@angular/material';
import {MatFormFieldModule } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

const myrouter : Routes = [
  {
    path: '',  redirectTo : '/login',pathMatch :'full'
  },
  {
    path: 'login' , component : LoginComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(myrouter)
    
  ],
  exports : [MatButtonModule, MatCheckboxModule ,MatFormFieldModule,MatInputModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
