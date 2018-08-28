import {Component, ElementRef, OnInit} from '@angular/core';
import {commonMessages, NotificationService} from '../../../../services/notificationService/NotificationService';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {TooltipService} from '../../../../services/tooltip/tooltip.service';
import {Http} from '@angular/http';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {AlertService} from 'ngx-alerts';

@Component({
  selector: 'app-reboot',
  templateUrl: './reboot.component.html',
  styleUrls: ['./reboot.component.css']
})
export class RebootComponent implements OnInit {

  formData = 'somevalue';

  constructor(private elRef: ElementRef,
              private http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private alertService: AlertService,
              private notifyPopup: NotificationService,
              private tooltipService: TooltipService) {
  }

  ngOnInit() {
    this.notifyPopup.confirmationOk().subscribe((page) => {
      if (page === 'reboot') {
        this.rebootSystem();
      }
    });
  }

  onSubmit() {
    // console.log('clicked');
    this.notifyPopup.info('Are you sure to reboot AP?');
  }

  rebootSystem() {
    // maintenance/wlc-system-reboot/
    this.notifyPopup.showLoader('Please wait system is rebooting...');
    this._service.postJson('maintenance/wlc-system-reboot/', '').then(_result => {
      if (_result.status === '1') {
        this.notifyPopup.success('System rebooted successfully.');
        //   // this.loadData();
        //
        // } else {
        //   this.notifyPopup.error(commonMessages.serverError);
        //   this.notifyPopup.hideLoader('');
      } else {
        this.notifyPopup.success('Something went wrong.');
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }
}

