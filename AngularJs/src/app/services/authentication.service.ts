import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';
import {CommonserviceService } from './commonservice.service';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient,public service:CommonserviceService ) { }
   public getToken(): string {
    return localStorage.getItem('token');
  }

  
      login(username: string, password: string) {
return this.service.postWeb('/auth/login',{ name: username, password: password },'');
         
      }
  
      logout() {
      

          // remove user from local storage to log user out
          localStorage.clear();
         
         
      }
      isLogined(){
        if(localStorage.getItem('token')){
          return true
        }else{
          return false;
        }
      }

}
