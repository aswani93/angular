import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {commonMessages, NotificationService} from '../../../../services/notificationService/NotificationService';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {TooltipService} from '../../../../services/tooltip/tooltip.service';
import {Http} from '@angular/http';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {AlertService} from 'ngx-alerts';
import {FormControl, FormGroup} from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-remote-maintenance',
  templateUrl: './remote-maintenance.component.html',
  styleUrls: ['./remote-maintenance.component.css']
})
export class RemoteMaintenanceComponent implements OnInit, AfterViewInit {

  remoteMaintenanceForm: FormGroup;
  remote_main_data;
  copyData: any;
  btnDisable;

  constructor(private elRef: ElementRef,
              private http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private alertService: AlertService,
              private notifyPopup: NotificationService,
              private tooltipService: TooltipService) {
  }


  ngOnInit() {
    this.notifyPopup.showLoader('Loading Data..');
    this.loadData();

    this.remoteMaintenanceForm = new FormGroup({
      'ssh': new FormControl(false),
    });
    this.onChanges();
  }

  loadData() {
    this._service.getWeb('maintenance/wlc-system-remote-maintenance/', '', '').then(_data => {
      if (_data) {
        console.log('load_data', _data);
        this.remote_main_data = _data.result;
        this.copyData = _.clone(_data.result, true);

        this.patchDataInForm(this.remote_main_data);
        this.notifyPopup.clear();

      } else {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      }
    });
  }

  onReset() {
    // this.ipConfigForm.reset();
    this.patchDataInForm(this.remote_main_data);
    this.btnDisable = true;
  }


  onSubmit() {
    this.notifyPopup.showLoader('Please wait, updating configuration');
    const formData = this.createFormObject();
    console.log(formData);
    this._service.postJson('configurations/ip-configuration/', formData).then(_result => {
      if (_result.status === '1') {
        /// this.notifyPopup.hideLoader('');
        this.notifyPopup.success('Update successfully');
        //   // this.loadData();
        //
        // } else {
        //   this.notifyPopup.error(commonMessages.serverError);
        //   this.notifyPopup.hideLoader('');
      }
    });
  }

  patchDataInForm(data) {
    console.log('Into patch fn', data);
    if (data.ssh == true) {
      console.log(data.ssh);
      this.remoteMaintenanceForm.controls['ssh'].patchValue(true);
     // this.checkAnyUpdate();
    } else {
      this.remoteMaintenanceForm.controls['ssh'].patchValue(false);
    //  this.checkAnyUpdate();
    }
    }


  ngAfterViewInit() {
    // console.log('After view Init!');
    this.remoteMaintenanceForm.statusChanges.subscribe((val) => {
      this.checkAnyUpdate();
    });
  }

  createFormObject() {
    const ssh_status = this.remoteMaintenanceForm.get('ssh').value;
    const formData = {
      'ssh': ssh_status
    };
    return formData;
  }

  checkAnyUpdate() {
    const formValue = this.createFormObject();
    console.log('copy_data', this.copyData);
    console.log(formValue);
    if (_.isEqual(this.copyData, formValue)) {
      console.log('objects are same');
      this.btnDisable = true;
    } else {
      console.log('objects are not same');
      this.btnDisable = false;
    }
  }

  onChanges(): void {
    this.remoteMaintenanceForm.get('ssh').valueChanges.subscribe(val => {
      console.log('slider value', val);
      this.checkAnyUpdate();
    });
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }

}
