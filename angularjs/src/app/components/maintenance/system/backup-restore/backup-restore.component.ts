import {AfterViewInit, Compiler, Component, DoCheck, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/catch';

import {commonMessages, NotificationService} from '../../../../services/notificationService/NotificationService';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {ScrollHelper} from '../../../../helpers/scroll-helper/scrollHelper';
import {TooltipService} from '../../../../services/tooltip/tooltip.service';
import {commonUrl} from '../../../../services/urls/common-url';
import {Http} from '@angular/http';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {AlertService} from 'ngx-alerts';

@Component({
  selector: 'app-backup-restore',
  templateUrl: './backup-restore.component.html',
  styleUrls: ['./backup-restore.component.css']
})
export class BackupRestoreComponent implements OnInit {
  fileList: FileList;
  fileName = '';
  uploadButtonDisabled = true;
  systemRestoreForm: FormGroup;

  constructor(private elRef: ElementRef,
              private http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private alertService: AlertService,
              private notifyPopup: NotificationService,
              private tooltipService: TooltipService) {
  }

  ngOnInit() {
    this.systemRestoreForm = new FormGroup({
      'uploadStatus': new FormControl(),
    });
  }


  onBackup() {
    // maintenance/wlc-system-settings-backup/
    this.notifyPopup.showLoader('Please wait, backup is in progress...');
    this._service.postJson('maintenance/wlc-system-settings-backup/', '').then(_result => {
      if (_result.status === '1') {
        this.notifyPopup.success('System backup successful.');
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

  restoreFileUpload(event) {
    this.fileList = event.target.files;
    //  this.fileList = files;
    this.fileName = this.fileList[0].name;
   // this.uploadButtonDisabled = false;
    const file: File = this.fileList[0];
    const name = this.fileName.search('HFCL_BACKUP');
    console.log(name + ' ' + file.size);
    if (name != -1 && file.size < 5000000 && file.size > 0) {
      // this.uploadfile();
      this.uploadButtonDisabled = false;
    } else {
      if (file.size > 5000000) {
        this.notifyPopup.error('File size is exceeded');
        // this.spinnerService.hide();
        this.uploadButtonDisabled = true;
      } else if (file.size < 0) {
        this.notifyPopup.error('Empty file');
        this.uploadButtonDisabled = true;
        // this.spinnerService.hide();
      } else {
        this.notifyPopup.error('Invalid File');
        this.uploadButtonDisabled = true;
        // this.spinnerService.hide();
      }
      this.reset();
    }
  }

  onSubmitData() {
    this.notifyPopup.showLoader(commonMessages.maintenance_system_restore);
    const formData: FormData = new FormData();
    formData.append('file', this.fileList[0]);
    this._service.postFiles('maintenance/wlc-system-settings-restore/', formData).then(_data => {
      // let newjson=_data.json().msg;
      this.notifyPopup.hideLoader('');
      if (_data.json().status == 0) {
        this.notifyPopup.error(_data.json().msg);
        this.reset();
        return;

      } else if (_data.json().status == 1) {
    //    this.loadData();
        this.notifyPopup.success('System restored successfully');
        this.reset();
        return;
      }
      // this.interval = setInterval(() => {
      //   if(!this.wcm_success){
      //     this.notifyPopup.hideLoader('');
      //    // this.spinnerService.hide();
      //     // this.errorMsg = 'WCM not responding';
      //     // this.showModal();
      //     this.notifyPopup.error("Network is too slow, Try after some time");
      //     clearInterval(this.interval)
      //   }
      // }, 10000);
    });
  }

  reset() {
    this.fileName = '';
    this.uploadButtonDisabled = true;
    // this.upgradebuttondisabled = true;
    // this.typestatus = false;
    // this.systemupgradeForm.reset();
    // this.loadData();
    //  if (this.systemupgradeForm.valid) {
    //    this.uploadbuttondisabled = true;
    //  }
  }


}

