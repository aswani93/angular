import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthguardService{

  constructor(private service : LoginService, private router : Router) { }

  canActivate(){
    var res = this.service.isLoggedin();
    if(res){
      return res;
    }else{
      this.router.navigate(['/']);
      return res;
    }
    
  }
}
