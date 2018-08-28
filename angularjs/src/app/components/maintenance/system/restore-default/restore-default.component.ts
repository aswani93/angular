import {Component, ElementRef, OnInit} from '@angular/core';
import {commonMessages, NotificationService} from '../../../../services/notificationService/NotificationService';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {TooltipService} from '../../../../services/tooltip/tooltip.service';
import {Http} from '@angular/http';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {AlertService} from 'ngx-alerts';

@Component({
  selector: 'app-restore-default',
  templateUrl: './restore-default.component.html',
  styleUrls: ['./restore-default.component.css']
})
export class RestoreDefaultComponent implements OnInit {

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
      if (page === 'restoreDefault') {
        this.onRestoreDefault();
      }
    });
  }


  onSubmit() {
    // console.log('clicked');
    this.notifyPopup.info('Are you sure to restore default?');
  }

  onRestoreDefault() {
    // maintenance/wlc-system-settings-restore/
    this.notifyPopup.showLoader('System restore initiated...');
    this._service.postJson('maintenance/wlc-system-settings-restore/', '').then(_result => {
      if (_result.status === '1') {
        this.notifyPopup.success('System restored successfully.');
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
