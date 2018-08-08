import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {NotificationService} from '../../services/notificationService/NotificationService';


@Injectable()
export class CanActiveService implements CanActivate {

  constructor(private router: Router, private notifyPopup: NotificationService) {
  }

  canActivate() {
    this.notifyPopup.hideLoader('');
    const vrrp_configured = sessionStorage.getItem('vrrp_configured') === 'true' ? true : false;
    if (sessionStorage.getItem('token')) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
