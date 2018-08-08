import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
//import { Login } from '../../components/login/login.data';
import {commonUrl  } from '../../services/urls/common-url';

@Injectable()
export class AuthService {
    constructor(private _router: Router, private httpClient: HttpClient) { }
    login(email: string, password: any) {
        var data = {
            email: email,
            password: password
        };
        var params = JSON.stringify(data);
       // console.log(params);
        return this.httpClient.post(commonUrl.dynamicapi + 'accounts/login/', params,{observe: 'response',withCredentials: true}) 
}
}