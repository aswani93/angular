import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class CheckVrrpServiceService implements CanActivate {

  constructor(private router: Router) { }

  canActivate() {
    const vrrp_configured = sessionStorage.getItem('vrrp_configured') === 'true' ? true : false;
    if (vrrp_configured === true) {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }

}
