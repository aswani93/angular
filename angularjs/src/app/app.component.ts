import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {NotificationService} from './services/notificationService/NotificationService';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  template: string = `<div class="custom-loader"></div>`;

  constructor(private notifyPopup: NotificationService, private router: Router) {
  }


  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

  }

  confirmdelete($event) {
    this.notifyPopup.confirmeddelete($event);

  }

  showdet($event) {
    console.log('sdas');
    this.notifyPopup.showeddetails($event);

  }

  removeDet() {
    this.notifyPopup.removeddetails();
  }
  redirectTologin(){
    this.notifyPopup.logout();
  }

}
