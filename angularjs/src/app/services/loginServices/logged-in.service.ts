import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class LoggedInService {
  constructor(
    private router: Router) {
  }

  resolve(): void {
    if(sessionStorage.getItem('token')){
      //this.router.navigate(['/configuration/system/basic']); 
      this.router.navigate(['/dashboard']); 
    }
  }
}