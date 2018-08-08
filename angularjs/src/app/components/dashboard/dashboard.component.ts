import {Component, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {WebserviceService} from '../../services/commonServices/webservice.service';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {commonMessages, NotificationService} from '../../services/notificationService/NotificationService';
import {TooltipService} from '../../services/tooltip/tooltip.service';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  apTraffic_bool = false;
  groupTraffic_bool = false;
  cpuUtilizationTop_bool = false;
  memoryUtilizationTop_bool = false;
  AccessPointsBottom_bool = false;
  groupsBottom_bool = false;
  clientsGroup_bool = false;
  clientsSsid_bool = false;
  groupsTop_bool = false;

  // for VRRP modal.
  @ViewChild('f') vrrpFormt: NgForm;
  @ViewChild('staticModal') staticModal: ModalDirective;
  vrrpForm: FormGroup;
  vrrp_configured: boolean;
  wlc_ip: string;
  netmask_wlc: string;
  netmask_vrrp: string;
  payLoad = {};
  loading = false;
  apiError = false;
  btnDisable = true;

  ipValdationRegex = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;

  constructor(private _service: WebserviceService,
              private notifyPopup: NotificationService,
              private tooltipService: TooltipService) {

  }

  ngOnInit() {

    this.generateForm();
    this.checkVRRPStatus();
    this.loadDashData();

    let that = this;
    $(window).scroll(function () {
      if (that.isInView($('.apTraffic')) && !that.apTraffic_bool) {
        console.log('enter into apTraffic......');
        that.apTraffic_bool = true;
      }
      if (that.isInView($('.groupTraffic')) && !that.groupTraffic_bool) {
        //console.log("enter into apTraffic......");
        that.groupTraffic_bool = true;
      }
      if (that.isInView($('.cpuUtilizationTop')) && !that.cpuUtilizationTop_bool) {
        console.log('enter into cpuUtilizationTop......');
        that.cpuUtilizationTop_bool = true;
      }

      if (that.isInView($('.AccessPointsBottom')) && !that.AccessPointsBottom_bool) {
        console.log('enter into AccessPointsBottom......');
        that.AccessPointsBottom_bool = true;
      }

      if (that.isInView($('.clientsGroup')) && !that.clientsGroup_bool) {
        console.log('enter into clientsGroup......');
        that.clientsGroup_bool = true;
      }

      if (that.isInView($('.groupsTop')) && !that.groupsTop_bool) {
        console.log('enter into groupsTop......');
        that.groupsTop_bool = true;
      }
    });

  }

  generateForm() {
    this.vrrpForm = new FormGroup({
      'vrrp_ip': new FormControl('', [
        Validators.required,
        Validators.pattern(this.ipValdationRegex),
        this.restrictedIP
      ]),
    });
  }


  public restrictedIP(control: FormControl) {
    // console.log(control.value);
    const value = control.value;
    const result = value.split('.');
    const isValid = (result[0] == '192' && result[1] == '0' && result[2] == '2') || (result[3] == '255' || result[0] == '224' || result[0] == '0' || result[0] == '4' || result[0] == '8' || result[0] == '127' || result[0] == '5' || result[0] == '255' || result[0] == '00' || result[0] == '000');
    // console.log(isValid);
    return isValid ? {'restrictedIP': true} : null;
  }

  public allowedRange(control: FormControl) {
    // const wlc_ip =  this.wlc_ip.split('.');
    const wlc_ip = sessionStorage.getItem('wlc_ip').split('.');
    console.log(wlc_ip);
    const value = control.value;
    const result = value.split('.');
    const isValid = (result[0] == wlc_ip[0] && result[1] == wlc_ip[1] && result[2] >= 0 && result[3] < 255);
    console.log(isValid);
    return isValid ? null : {'notInRange': true};
  }


  private checkVRRPStatus() {
    this.vrrp_configured = sessionStorage.getItem('vrrp_configured') === 'true' ? true : false;
    // this.vrrp_configured = true;
    this.wlc_ip = sessionStorage.getItem('wlc_ip');
    this.netmask_wlc = sessionStorage.getItem('netmask_wlc');
    this.netmask_vrrp = sessionStorage.getItem('netmask_vrrp');
    if (!this.vrrp_configured) {
      setTimeout(() => {
        this.staticModal.show();
      }, 500);
    } else {
      this.staticModal.hide();
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log(changes);
  }

  isInView(elem) {
    var nav = $(elem);
    if (nav.length) {
      return $(elem).offset().top - $(window).scrollTop() - 200 < $(elem).height();
    }
  }

  loadDashData() {

  }


  allowDrop(ev) {
    ev.preventDefault();
    //  console.log('xxxxxxxxxxxxx');
  }

  drag(ev) {
    ev.dataTransfer.setData('src', ev.target.id);
    //  console.log('hihihihhihi');
  }

  drop(ev) {
    ev.preventDefault();
    var src = document.getElementById(ev.dataTransfer.getData('src'));
    var srcParent = src.parentNode;
    var tgt = ev.currentTarget.firstElementChild;

    ev.currentTarget.replaceChild(src, tgt);
    srcParent.appendChild(tgt);
}


  onReset() {
    this.vrrpForm.setValue({vrrp_ip: ''});
  }

  onSubmit() {
    sessionStorage.setItem('vrrp_configured', 'true');
    this.staticModal.hide();
    // this.payLoad = this.createFormData();

    // this._service.postJson('accounts/wlc-vrrp-info/', this.payLoad).then(_result => {
    //   if (_result.status === '1') {
    //     // this.notifyPopup.showLoader(commonMessages.addAAA);
    //     this.notifyPopup.hideLoader('');
    //
    //     sessionStorage.setItem('vrrp_configured', 'true');
    //     setTimeout(() => {
    //       this.loading = false;
    //     }, 2000);
    //     this.staticModal.hide();
    //   } else {
    //     // this.apiErrorMsg = _result.msg[0];
    //
    //     this.notifyPopup.error(_result.msg);
    //     //  this.btnDisable = true;
    //     // this.notifyPopup.error(_result.msg);
    //   }
    // }).catch((error) => {
    //   this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    // });
  }

  private createFormData() {
    const vrrp_ip = this.vrrpForm.value.vrrp_ip;
    const netmask = sessionStorage.getItem('netmask_vrrp');

    const payLoad = {
      vrrp_ip: vrrp_ip,
      netmask: netmask
    };
    return payLoad;
  }

  checkVrrpIP(vrrpIP, event) {
    let i, l;
    for (i = l = 0; i < vrrpIP.length; i++) {
      if (vrrpIP[i] === '.') {
        l++;
      }
      if (l >= 3 && event.keyCode !== 8 && event.keyCode !== 46) {
        const vrrp_ip = vrrpIP;
        const netmask = sessionStorage.getItem('netmask_vrrp');
        const payLoad = {
          vrrp_ip: vrrp_ip,
          netmask: netmask
        };
        this._service.postJson('accounts/wlc-vrrp-info/', payLoad).then(_result => {
          if (_result.status === '1') {
            sessionStorage.setItem('vrrp_configured', 'true');
            this.apiError = false;
            this.btnDisable = false;
          } else {
            console.log('else');
            // this.apiErrorMsg = _result.msg[0];
            this.apiError = true;
            this.btnDisable = true;
            setTimeout(() => {
              this.apiError = false;
            }, 5000);
          }
        });
      }
    }
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }
}
