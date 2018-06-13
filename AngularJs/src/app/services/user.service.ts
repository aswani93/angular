import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {CommonserviceService } from './commonservice.service';

@Injectable()
export class UserService {

  constructor(private http: HttpClient,public service:CommonserviceService ) { }
  users() {
    return this.service.getWeb('/users/list','','');
             
          }

}
