import { country } from './../../../../services/countryList/country';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild, Pipe } from '@angular/core';
import { Http } from '@angular/http';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { counrtyService } from '../../../../services/countryList/country';
import * as io from 'socket.io-client';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { NotificationService, commonMessages } from '../../../../services/notificationService/NotificationService';
import { TooltipService } from '../../../../services/tooltip/tooltip.service';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  public sytemBasicForm: FormGroup;
  public data;
  public countryData;
  public stateData;
  public timeZones;
  public timeOffset;
  public now: Date = new Date();
  public time;
  public clock;
  public timer;
  public date;
  hourErrStatus = false;
  minErrStatus = false;
  hour;
  minutes;
  public newJson = {};
  public btnDisabled = true;
  public wcm_success;
  private pattern = /^[-a-zA-Z0-9-()]+([_@./#&+-]+[-a-zA-Z0-9-()]+)*$/;
  private ntp = /^[-a-zA-Z0-9-()]+([.]+[-a-zA-Z0-9-()]+[-a-zA-Z0-9-()])*$/;
  IPpattern = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;
  public isModalShown: boolean = false;
  public interval;
  public errorMsg: string;
  IpvalidateStatus;
  minDate = new Date(1995, 1, 19);
  numberPattern = /^([0-9])*$/;
  bsConfig = Object.assign({}, {showWeekNumbers:false, containerClass: 'theme-dark-blue' });

  constructor(
    private elRef: ElementRef, private http: Http,
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
    let date = new Date();
    this.countryData = counrtyService.getCountryList();
    this.sytemBasicForm = new FormGroup({
      'wlc_name': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern(this.pattern),

      ]),
      // "wlc_country": new FormControl('', [
      //   Validators.required
      // ]),
      // "wlc_city": new FormControl(),
      // "wlc_version": new FormControl(),
      // "wlc_model": new FormControl(),
      'wlc_date_time_mode': new FormControl(),
      // "wlc_serial_no": new FormControl(),
      'wlc_timezone': new FormControl(),
      'is_syslog_enabled':new FormControl(),
      // 'ip_type':new FormControl('a'),
      'syslog_ipv4_addr':new FormControl('',[Validators.required,Validators.pattern(this.IPpattern)]),
      'syslog_port':new FormControl('',[Validators.required,Validators.pattern(this.numberPattern),this.portValidation]),
      //  "wlc_ipv4": new FormControl(),
      //  "wlc_mac": new FormControl(),

      'ntp_server_1': new FormControl('', [Validators.required, Validators.pattern(this.ntp)]),
      'ntp_server_2': new FormControl('', [Validators.required, Validators.pattern(this.ntp)]),
      'date': new FormControl()

    });

  }

  public portValidation(control: FormControl) {
    let inValidVLAN = control.value < 65535 && control.value > 1;
    let isValid = inValidVLAN;
    return isValid ? null : { 'invalidPortRange': true }
}


//   validateIP(event) {
//     this.btnDisabled = true;
//     this.IpvalidateStatus = false;
//     // var value = this.DHCPForm.get('ipv4_addr').value;
//     var value = event.target.value;
//     var result = value.split(".");
//    if (result[0] == "225" || result[0] == "224" || result[0] == "127" || result[0] == "0" || result[0] == "4"
//   || result[0] == "") {
//         this.btnDisabled = true;
//         this.IpvalidateStatus = true;
//     } else if (result[0] == "192" && result[1] == "168") {
//         this.btnDisabled = false;
//         this.IpvalidateStatus = false;
//     }


// }

validateIP(event) {
  this.btnDisabled = true;
  this.IpvalidateStatus = false;
  // var value = this.DHCPForm.get('ipv4_addr').value;
  var value = event.target.value;
  var result = value.split(".");
  // if (result[0].length < 3) {
  //     this.btnDisable = true;
  //     this.IpvalidateStatus = true;
  // } else 
  if (result[0] == "0" || result[0] == "4" || result[0] == "8" ||result[0] == "127" || result[0] == "255" || result[1] == "0") {
      this.btnDisabled = true;
      this.IpvalidateStatus = true;
  } else {
      this.btnDisabled = false;
      this.IpvalidateStatus = false;
      this.checkAnyUpdate();
  }
}


  loadData() {
    this.notifyPopup.showLoader('Please Wait');
    this._service.getWeb('configurations/system-config-info/', '', '').then(_result => {
      if (_result) {
        this.data = _result.result;
        // alert(JSON.stringify(_result.result))
        this.data['date'] = this.now;
        this.sytemBasicForm.setValue(this.data);
        this.stateData = counrtyService.getState(this.data.wlc_country);
        // this.getTimeZone(this.data.wlc_country,'');
        this.generateClock(this.data.wlc_timezone);
        let d = new Date();
        let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
        this.time = new Date(utc + (3600000 * 5.75));
        //this.now = this.time;
        this.hour = this.time.getHours();
        this.minutes = this.time.getMinutes();
        this.checkAnyUpdate();
        this.notifyPopup.hideLoader('');
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  generateClock(target) {
    if (target[target.selectedIndex] != undefined) {
      this.timeOffset = target.value
    } else {
      this.timeOffset = target;
    }

    this.data.offset = this.timeOffset;
    let d = new Date();

    let dateTimefromZone = d.toLocaleString('de-DE', { timeZone: this.timeOffset });
    this.date = dateTimefromZone.split(",")[0];
    this.clock = dateTimefromZone.split(",")[1];
    this.timer = setTimeout(() => {
      this.generateClock(this.data.wlc_timezone);
    }, 1000);
  }

  checkTime(i) {
    if (i < 10) {
      i = '0' + i;
    }
    ;
    return i;
  }


  resetdtVals() {
    this.sytemBasicForm.get('ntp_server_1').setValue(this.data.ntp_server_1);
    this.sytemBasicForm.get('ntp_server_2').setValue(this.data.ntp_server_2);
  }

  checkAnyUpdate() {
    let data = this.sytemBasicForm.value;
    // data.offset=this.data.offset;
    this.newJson = {};
    for (let key in data) {
     
      if (data[key] != this.data[key]) {
        this.newJson[key] = data[key];
        //console.log(data[key])
      }
    }

    let count = Object.keys(this.newJson).length;

    if (count > 0) {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    this.sytemBasicForm.valueChanges.subscribe(() => {
    //  this.checkAnyUpdate();
    });
  }

  formReset() {
    this.sytemBasicForm.reset();
    this.hourErrStatus = false;
    this.minErrStatus = false;
    this.loadData();
    this.IpvalidateStatus=false;
  }

  onSelect() {
    this.formReset();
  }
  Hourvalidate() {
    if (this.elRef.nativeElement.querySelector('#wlc_hr').value == '' || this.elRef.nativeElement.querySelector('#wlc_hr').value == null
      || this.elRef.nativeElement.querySelector('#wlc_hr').value > 23 || this.elRef.nativeElement.querySelector('#wlc_hr').value < 0 
    || !this.elRef.nativeElement.querySelector('#wlc_hr').value.match(this.numberPattern)) {
      this.hourErrStatus = true;
      this.btnDisabled = true;
    } else {
      if (this.minErrStatus) {
        this.hourErrStatus = true;
        this.btnDisabled = true;
      } else {
        this.hourErrStatus = false;
        this.btnDisabled = false;
      }
    }
  }



  Minvalidate() {
    if (this.elRef.nativeElement.querySelector('#wlc_min').value == '' || this.elRef.nativeElement.querySelector('#wlc_min').value == null
      || this.elRef.nativeElement.querySelector('#wlc_min').value > 59 || this.elRef.nativeElement.querySelector('#wlc_min').value < 0  
      || !this.elRef.nativeElement.querySelector('#wlc_min').value.match(this.numberPattern)) {
      this.minErrStatus = true;

      this.btnDisabled = true;
    }
    else {
      if (this.hourErrStatus) {
        this.minErrStatus = true;
        this.btnDisabled = true;
      } else {
        this.minErrStatus = false;
        this.btnDisabled = false;
      }

    }
  }

  onSubmit() {
    let count = Object.keys(this.newJson).length;
    if (this.sytemBasicForm.get('wlc_date_time_mode').value == 1 && count > 0 && this.data.wlc_date_time_mode != 1) {
      let time = this.hour + ':' + this.minutes + ':' + '00';
      let dd = this.sytemBasicForm.get('date').value.getDate();
      let mm = this.sytemBasicForm.get('date').value.getMonth() + 1;
      let yyyy = this.sytemBasicForm.get('date').value.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      let newDate = yyyy + '-' + mm + '-' + dd;
      this.newJson['date'] = newDate;
      this.newJson['time'] = time;
    } else if (this.data['wlc_date_time_mode'] == 1 && count == 0) {
      let time = this.hour + ':' + this.minutes + ':' + '00';
      this.newJson['time'] = time;
    }

    //  if(this.sytemBasicForm.get('wlc_country').value != this.data.wlc_country){
    //    this.newJson['wlc_timezone']=this.elRef.nativeElement.querySelector('#wlc_timezone').value;;
    //    }

    if (this.sytemBasicForm.get('wlc_date_time_mode').value != this.data.wlc_date_time_mode) {
      this.newJson['wlc_date_time_mode'] = parseInt(this.sytemBasicForm.get('wlc_date_time_mode').value);
    }
    this.notifyPopup.showLoader(commonMessages.save_systemConfig);

    this._service.putJson('configurations/system-config-info/', this.newJson).then(_result => {
    
      if (_result.status == 1) {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.success("Settings applied successfully");
        window.scrollTo(0, 0);
        setTimeout(() => {
          this.loadData();
        }, 1500);
       
        this.wcm_success = true;
    
      } else {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.serverError);
        setTimeout(() => {
          this.loadData();
        }, 1500);
       
      }
    }).catch(() => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });

  }
  

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.isModalShown = false;
  }

  // added for the tooltip text implementation //(by abhishek)
  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }


}
