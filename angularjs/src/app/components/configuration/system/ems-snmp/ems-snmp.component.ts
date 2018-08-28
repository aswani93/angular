import { Component, OnInit, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import * as _ from 'lodash';
import { NotificationService, commonMessages } from '../../../../services/notificationService/NotificationService';
import { TooltipService } from '../../../../services/tooltip/tooltip.service';

@Component({
  selector: 'app-ems-snmp',
  templateUrl: './ems-snmp.component.html',
  styleUrls: ['./ems-snmp.component.css']
})
export class EmsSnmpComponent implements OnInit {
  public emsForm: FormGroup;
  public editArray: any = {};
  public formatedArray: any = {};
  private pattern = /^[-a-zA-Z0-9-()]+([_@./#&+]+[-a-zA-Z0-9-()]+)*$/;
  IPpattern = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;
  public alertPopUp;
  newJson;
  statusCall = true;

  public readComty;
  public readComtyErrFlag;

  public readWriteComty;
  public readWriteComtyErrFlag;

  public ipv4ErrorLog;
  public ipv4Val;

  public trapportnumber = 162;
  public trapPortErrorFlag;
  iperrorStatus = false;

  public port_trap;
  public port_trapErrflag;

  public trapcommVal;
  public trapcommValErrorFlag;

  public data;

  public version;
  public server;

  random_id: string;
  private socket;

  btnDisable = true;

  constructor(private elRef: ElementRef,
              public http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private alertService: AlertService,
              private notifyPopup: NotificationService,
              private tooltipService: TooltipService
  ) {
    //this.socket = io(this.url);
  }

  ngOnInit() {

    this.loadData();

    this.emsForm = new FormGroup({
      'version': new FormControl('', ),
      'read_write_community': new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(this.pattern)]),
      'read_community': new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(this.pattern)]),
      'trap_ipv4': new FormControl('', [Validators.required, Validators.pattern(this.IPpattern)]),
      'trap_community': new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(this.pattern)]),
    });

  }

  ngOnDestroy() {
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
  }

  loadData() {
    this.notifyPopup.showLoader('Please wait..');
    //this.spinnerService.show();
    this._service.getWeb('configurations/snmp-config/', '', '').then(_result => {
      if (_result) {
        this.data = _result['result'];
        //  this.editArray = _result.result;
        this.editArray['version'] = parseInt(this.data.version);
        this.editArray['read_community'] = this.data.read_community;
        this.editArray['read_write_community'] = this.data.read_write_community;
        this.editArray['trap_ipv4'] = this.data.trap_ipv4;
        this.editArray['trap_community'] = this.data.trap_community;
        this.emsForm.get('version').setValue(parseInt(this.data.version));
        this.emsForm.get('read_community').setValue(this.data.read_community);
        this.emsForm.get('read_write_community').setValue(this.data.read_write_community);
        this.emsForm.get('trap_ipv4').setValue(this.data.trap_ipv4);
        this.emsForm.get('trap_community').setValue(this.data.trap_community);


        this.notifyPopup.hideLoader('');
        // this.spinnerService.hide();
        setTimeout(function () {
          if (this.notifyPopup) {
            this.notifyPopup.hideLoader('');

          }
        }, 2000);
      }

    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }
  validateIP() {
    // alert( this.systemRedundancy.get('redundancy_ipv4').value)
    var value = this.emsForm.get('trap_ipv4').value;
    var result = value.split(".");
    if (result[0].length == 0) {
      this.iperrorStatus = true;
      this.btnDisable = true;
    } else if (result[0] == "127" || result[0] == "8" || result[0] == "4" ||(result[1] == "0" && result[2] == "2")) {
      this.iperrorStatus = true;
      this.btnDisable = true;
    } else if (result[0] < 224 && result[0] >= 1 && result[3] < 255) {
      this.iperrorStatus = false;
      this.btnDisable = false;
    }
    else {
      this.iperrorStatus = true;
      this.btnDisable = true;
    }


  }
  checkAnyUpdate() {
    let data = this.emsForm.value;

    // console.log(JSON.stringify(this.editArray) + " test " + JSON.stringify(data))
    // console.log(JSON.stringify(data) +" testtt   "+JSON.stringify(this.data))
    this.newJson = {};
    for (let key in data) {
      if (data[key] != this.editArray[key]) {
        this.newJson[key] = data[key];
      }
    }

    let count = Object.keys(this.newJson).length;

    if (count > 0) {
      this.btnDisable = false;
    } else {
      this.btnDisable = true;
    }
  }
  ngAfterViewInit() {
    window.scrollTo(0, 0);
    this.emsForm.valueChanges.subscribe(() => {
      this.checkAnyUpdate();
    });
    $('.upgrade-tabs .tab-links a').on('click', function (e) {
      var currentAttrValue = jQuery(this).attr('href');

      // Show/Hide Tabs
      $('.upgrade-tabs ' + currentAttrValue).show().siblings().hide();

      // Change/remove current tab to active
      $(this).parent('li').addClass('active').siblings().removeClass('active');

      e.preventDefault();
    });
  }

  saveSNMPDetails() {

    // if (!this.validate()) {

    let saveData = {
      'status': 1,
      'read_community': this.emsForm.get('read_community').value,
      'access_priviledge': 1,
      'trap_ipv4': this.emsForm.get('trap_ipv4').value,
      'encryption_algorithm': 1,
      'encryption_password': '',
      'trap_port': (this.trapportnumber),
      'version': parseInt(this.emsForm.get('version').value),
      'read_write_community': this.emsForm.get('read_write_community').value,
      'auth_password': '',
      'user_name': '',
      'trap_community': this.emsForm.get('trap_community').value,
      'auth_algorithm': 1,
      server: 1
    };
    this.notifyPopup.showLoader(commonMessages.ems_snmp_save_data);
    this._service.putJson('configurations/snmp-config/?version=' + parseInt(this.emsForm.get('version').value), saveData).then(_res => {
    
      if (_res.status == 1) {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.success('Settings Saved successfully');
        this.btnDisable = true;

        // this.spinnerService.hide();
        setTimeout(() => {
          this.loadData();
        }, 2000);

        this.statusCall = false;
        
      

      }else{
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error('Internal Error,try after some time.');
        this.btnDisable = true;
        this.loadData();
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });

    // }
    // }

  }



  reset() {
    this.emsForm.reset();
    this.iperrorStatus = false;
    this.loadData();


  }

  // added for the tooltip text implementation //(by abhishek)
  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }
}
