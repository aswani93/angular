import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class CanActiveService {

  constructor(private authService: AuthenticationService, private router:Router) {}
  
    canActivate() {
      if(this.authService.isLoggined()){
      return true; 
      }
      this.router.navigate(['/']);
      return false
    }

}

