import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { CanActivate , Router } from '@angular/router';

@Injectable()
export class CanactiveService {

  constructor(private auth : AuthenticationService, private router : Router) { }
  CanActivate(){
    if(this.auth.isLoggined()){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false
    }
  }
}
