import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class CanActiveService {

  constructor(private authService: AuthenticationService, private router:Router) {}
  
    canActivate() {
      if(this.authService.isLogined()){
      return true; 
      }
      this.router.navigate(['/']);
      return false
    }

}
