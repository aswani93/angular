import {AfterViewInit, Compiler, Component, DoCheck, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {AlertService} from 'ngx-alerts';
import {Http} from '@angular/http';
import * as _ from 'lodash';
import 'rxjs/add/operator/catch';

import {commonMessages, NotificationService} from '../../../../services/notificationService/NotificationService';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {TooltipService} from '../../../../services/tooltip/tooltip.service';


@Component({
  selector: 'app-ipconfig',
  templateUrl: './ipconfig.component.html',
  styleUrls: ['./ipconfig.component.css']
})
export class IpconfigComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {

  showRedundancyFlag;
  showTableFlag = false;

  submitButtonCondition;

  showInfoText = '';
  btnDisablex = true;
  btnDisableonIP = false;
  activeArray = [];
  standByArray = [];


  IpvalidateStatus = false;

  standByIPCallErrorTxt = 'Enter both valid IP & prefix';
  activeIPCallErrorTxt = 'Enter both valid IP & prefix';
  activeIPCallError = false;
  standByIPCallError = false;

  ipConfigForm: FormGroup;
  btnDisable = true;
  disableResetButton = true;

  iperrorStatus = false;
  data: any;
  api_data_status = '0';
  copyData: any;

  sameActiveIP = false;
  sameStandByIP = false;

  submittedFormObjects = {};

  TableConfigArray: any = [];
  tableViewSwitchCase;
  dhcpPrimaryCheck = false;
  dhcpSecondaryCheck = false;

  NetworkregIPVal = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  subnetmaskPatern = /^(((255\.){3}(255|254|252|248|240|224|192|128+))|((255\.){2}(255|254|252|248|240|224|192|128+)\.0)|((255\.)(255|254|252|248|240|224|192|128+)(\.0+){2})|((255|254|252|248|240|224|192|128+)(\.0+){3}))$/;
  ipValdationRegex = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;
  pattern = /^[-a-zA-Z0-9()]+([_@/#&+]+[-a-zA-Z0-9()]+)*$/;

  constructor(
    private elRef: ElementRef,
    private http: Http,
    private _service: WebserviceService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    private notifyPopup: NotificationService,
    private tooltipService: TooltipService,
    private _runtimeCompiler: Compiler
  ) {
  }


  ngOnInit() {
    this.callforAnyEdit();
    this.notifyPopup.confirmationOk().subscribe((page) => {
      if (page === 'ipconfig') {
        this.submitData();
      }
    });
    this.notifyPopup.showLoader('Loading Configurations.');
    this.loadData();

    this.ipConfigForm = new FormGroup({

      'dhcp': new FormControl(false),

      'r_dhcp': new FormControl(false),

      'ip': new FormControl('', [
        Validators.required,
        Validators.pattern(this.NetworkregIPVal),
        this.restrictedIP
      ]),

      'ip_prefix': new FormControl('', [
        Validators.required,
        this.prefixrange,
        Validators.pattern(this.pattern)
      ]),

      'configure_standby': new FormControl(false),

      'end_ip': new FormControl(),
      'ipv4_config': new FormGroup({

        'subnet_mask': new FormControl('', [
          Validators.required,
          Validators.pattern(this.subnetmaskPatern),
          this.restrictedNetMask

        ]),

        'gateway': new FormControl('', [
          Validators.required,
          Validators.pattern(this.ipValdationRegex),
          this.restrictedGatewayIP
        ]),

        'primary_dns': new FormControl('', [
          Validators.required,
          Validators.pattern(this.ipValdationRegex),
          this.restrictedDNS
        ]),

        'secondary_dns': new FormControl('', [
          Validators.required,
          Validators.pattern(this.ipValdationRegex),
          this.restrictedDNS
        ])
      }),

      'r_config': new FormGroup({

        'r_ip': new FormControl('', [
          Validators.required,
          Validators.pattern(this.NetworkregIPVal),
          this.restrictedIP
        ]),

        'r_ip_prefix': new FormControl('', [
          Validators.required,
          this.prefixrange,
          Validators.pattern(this.pattern)
        ]),

        'r_end_ip': new FormControl('', [
          Validators.pattern(this.ipValdationRegex)
        ]),

        'r_netmask': new FormControl('', [
          Validators.required,
          Validators.pattern(this.subnetmaskPatern),
          this.restrictedNetMask

        ]),

        'r_gateway': new FormControl('', [
          Validators.required,
          Validators.pattern(this.ipValdationRegex),
          this.restrictedGatewayIP
        ]),

        'r_primary_dns': new FormControl('', [
          Validators.required,
          Validators.pattern(this.ipValdationRegex),
          this.restrictedDNS
        ]),

        'r_secondary_dns': new FormControl('', [
          Validators.required,
          Validators.pattern(this.ipValdationRegex),
          this.restrictedDNS
        ])
      }),
    });

    this.onChanges();
  }


  public sameAsStandByIP(control: FormControl) {
    const standByIP = this.ipConfigForm.get('r_config.r_ip').value;
    // console.log(standByIP);
    const activeIP = control.value;
    const isValid = (activeIP !== standByIP);
    // console.log(isValid);
    return isValid ? null : {'matchedWithStandByIP': true};
  }

  public sameAsActiveIP(control: FormControl) {
    const activeIP = this.ipConfigForm.get('r_ip').value;
    // console.log(activeIP);
    const standByIP = control.value;
    const isValid = (activeIP !== standByIP);
    // console.log(isValid);
    return isValid ? null : {'matchedWithActiveIP': true};
  }


  public restrictedGatewayIP(control: FormControl) {
    // console.log(control.value);
    const value = control.value;
    const result = value.split('.');
    const isValid = (result[0] == '197' || result[0] == '224' || result[0] == '0' || result[0] == '4' || result[0] == '8' || result[0] == '127' || result[0] == '5' || result[0] == '255' || result[0] == '00' || result[0] == '000');
    return isValid ? {'restrictedIP': true} : null;
  }

  public restrictedIP(control: FormControl) {
    // console.log(control.value);
    const value = control.value;
    const result = value.split('.');
    const isValid = (result[0] == '192' && result[1] == '0' && result[2] == '2') || (result[0] == '224' || result[0] == '0' || result[0] == '4' || result[0] == '8' || result[0] == '127' || result[0] == '5' || result[0] == '255' || result[0] == '00' || result[0] == '000');
    return isValid ? {'restrictedIP': true} : null;
  }

  public restrictedDNS(control: FormControl) {
    // console.log(control.value);
    const value = control.value;
    const result = value.split('.');
    const isValid = (result[0] == '192' && result[1] == '0' && result[2] == '2') || (result[0] == '224' || result[0] == '127' || result[0] == '5' || result[0] == '255' || result[0] == '00' || result[0] == '000');
    return isValid ? {'restrictedIP': true} : null;
  }

  public restrictedNetMask(control: FormControl) {
    // console.log(control.value);
    const value = control.value;
    const result = value.split('.');
    const isValid = (result[0] == '255' && result[1] == '255' && result[2] == '255' && result[3] == '255') || (result[0] == '0' || result[0] == '4' || result[0] == '8' || result[0] == '127' || result[0] == '5' || result[0] == '00' || result[0] == '000');
    return isValid ? {'restrictedIP': true} : null;
  }


  public prefixrange(control: FormControl) {
    const prefixRange = (control.value > 7 && control.value <= 31);
    const isValid = prefixRange;
    return isValid ? null : {'prefixrange': true};
  }

  ngDoCheck() {
    // this.ipConfigForm.get('r_config.r_end_ip').disable();
    // console.log('Do check!!');
  }

  onChanges(): void {


    // this.ipConfigForm.get('ip_prefix').disable();
    // this.ipConfigForm.controls['ip'].disable();
    // this.ipConfigForm.controls['ipv4_config'].disable();

    this.dhcpPrimaryCheck = true;
    this.ipConfigForm.get('configure_standby').valueChanges.subscribe(val => {
      // console.log('configure_standby', val);
      if (val === true) {
        this.TableConfigArray[1] = true;

        this.submitButtonCondition = false;

        this.showRedundancyFlag = 1;

      } else {
        this.TableConfigArray[1] = false;

        this.submitButtonCondition = true;

        this.showRedundancyFlag = 2;
      }
    });
    this.ipConfigForm.get('dhcp').valueChanges.subscribe(val => {
      // console.log(val);
      if (val === true) {
        this.TableConfigArray[0] = true;

        this.showTableFlag = false;
        if (this.ipConfigForm.get('ipv4_config').invalid ||
          this.ipConfigForm.get('ip').invalid ||
          this.ipConfigForm.get('ip_prefix').invalid) {
          this.btnDisable = true;
        }
        // this.ipConfigForm.get('ip_prefix').disable();
        //  this.ipConfigForm.controls['ip'].disable();
        // this.ipConfigForm.controls['ipv4_config'].disable();
        this.dhcpPrimaryCheck = true;
        // console.log('obj_comp_btn', this.btnDisablex);
        // console.log('ip_btn', this.btnDisableonIP);
        // console.log('primary section invalid', this.ipConfigForm.get('ipv4_config').invalid);
        // console.log('primary ip invalid', this.ipConfigForm.get('ip').invalid);
        // console.log('primary prifix invalid', this.ipConfigForm.get('ip_prefix').invalid);

      } else {
        this.TableConfigArray[0] = false;

        this.showTableFlag = true;
        this.dhcpPrimaryCheck = false;
        //  this.ipConfigForm.get('ip_prefix').enable();
        // this.ipConfigForm.controls['ip'].enable();
        // this.ipConfigForm.controls['ipv4_config'].enable();


     // console.log('obj_comp_btn', this.btnDisablex);
     // console.log('ip_btn', this.btnDisableonIP);
     // console.log('primary section invalid', this.ipConfigForm.get('ipv4_config').invalid);
     // console.log('primary ip invalid', this.ipConfigForm.get('ip').invalid);
     // console.log('primary prifix invalid', this.ipConfigForm.get('ip_prefix').invalid);
      }
    });

    this.ipConfigForm.get('r_dhcp').valueChanges.subscribe(val => {
      // console.log('r_config.r_dhcp');
      if (val === true) {
        this.TableConfigArray[2] = true;

        this.showTableFlag = false;
        this.dhcpSecondaryCheck = true;
        // this.ipConfigForm.get('r_config.r_ip_prefix').disable();
        // this.ipConfigForm.get('r_config').disable();
      } else {

        this.TableConfigArray[2] = false;

        this.showTableFlag = true;
        this.dhcpSecondaryCheck = false;
        // this.ipConfigForm.get('r_config.r_ip_prefix').enable();
        // this.ipConfigForm.get('r_config').enable();

      }
    });
  }

  showTableFun() {
    // console.log('In the show Table Function');
    const a = this.TableConfigArray[0]; // primary DHCP
    const r = this.TableConfigArray[1]; // Config Redundancy
    const s = this.TableConfigArray[2]; // secondary DHCP

    if (a === true && r === false) {
      // console.log('condition 1');
      this.tableViewSwitchCase = 1;
    } else if (a === false && r === false) {
      // console.log('condition 2');
      this.tableViewSwitchCase = 1;
    } else if (a === true && r === true) {
      // console.log('condition 2');
      this.tableViewSwitchCase = 3;
    } else {
      // console.log('condition default');
      this.tableViewSwitchCase = 4;
    }
  }


  generateEndIPforActive(netmaskPrefix, ipAddress, wlctype) {
    // http://192.168.103.124:8000/api/utils/ip-range-list/?start_ip=192.168.103.2&netmask=24&wlc_type=2
    this._service.getWeb('utils/ip-range-list/?start_ip=' + ipAddress + '&netmask=' + netmaskPrefix + '&wlc_type=' + wlctype, '', '').then(_result => {
      if (_result.status == '1') {
        // console.log(_result);
        const newEndIP = _result.result[0];
        // const wlcType = _result.result[1];

        this.patchEndIPInForm(newEndIP, 'WLC1');

        // this.ipConfigForm.setValue(this.data);
      } else {
        this.activeIPCallErrorTxt = _result.msg;
        this.activeIPCallError = true;
        setTimeout(() => {
          // console.log('happened');
          this.activeIPCallError = false;
          this.activeIPCallErrorTxt = 'Enter both valid IP & prefix';
        }, 5000);
      }
    });
  }

  generateEndIPforStandby(netmaskPrefix, ipAddress, wlctype) {
    // http://192.168.103.124:8000/api/utils/ip-range-list/?start_ip=192.168.103.2&netmask=24&wlc_type=2

    this._service.getWeb('utils/ip-range-list/?start_ip=' + ipAddress + '&netmask=' + netmaskPrefix + '&wlc_type=' + wlctype, '', '').then(_result => {

      // console.log(_result);
      if (_result.status == '1') {
        // console.log(_result);
        const newEndIP = _result.result[0];
        const wlcType = _result.result[1];

        this.patchEndIPInForm(newEndIP, 'WLC2');

        // this.ipConfigForm.setValue(this.data);
      } else {
        this.standByIPCallErrorTxt = _result.msg;
        this.standByIPCallError = true;
        setTimeout(() => {
          // console.log('happened');
          this.standByIPCallError = false;
          this.standByIPCallErrorTxt = 'Enter both valid IP & prefix';
        }, 5000);
      }
    });
  }


  patchEndIPInForm(newEndIP, patchto) {
    if (patchto == 'WLC1') {
      this.ipConfigForm.patchValue({'end_ip': newEndIP});
    } else {
      this.ipConfigForm.patchValue({'r_config': {'r_end_ip': newEndIP}});
    }

  }

  customFormReset() {
    this.ipConfigForm.patchValue({'ip': ''});
    this.ipConfigForm.patchValue({'ip_prefix': ''});
    this.ipConfigForm.patchValue({'end_ip': ''});
    this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': ''}});
    this.ipConfigForm.patchValue({'ipv4_config': {'gateway': ''}});
    this.ipConfigForm.patchValue({'ipv4_config': {'primary_dns': ''}});
    this.ipConfigForm.patchValue({'ipv4_config': {'secondary_dns': ''}});


    // this.ipConfigForm.patchValue({'r_config': {'r_ip': ''}});
    // this.ipConfigForm.patchValue({'r_config': {'r_ip_prefix': ''}});
    // this.ipConfigForm.patchValue({'r_config': {'r_end_ip': ''}});
    // this.ipConfigForm.patchValue({'r_config': {'r_netmask': ''}});
    // this.ipConfigForm.patchValue({'r_config': {'r_gateway': ''}});
    // this.ipConfigForm.patchValue({'r_config': {'r_primary_dns': ''}});
    // this.ipConfigForm.patchValue({'r_config': {'r_secondary_dns': ''}});

    //  this.ipConfigForm.get('r_config.r_ip').setValidators(this.sameAsStandByIP);
    //  this.ipConfigForm.get('ip').setValidators(this.sameAsActiveIP);

    this.ipConfigForm.controls['dhcp'].patchValue(false);

    this.TableConfigArray[0] = false;

    this.showTableFlag = true;
    this.ipConfigForm.get('ip_prefix').enable();
    this.ipConfigForm.controls['ip'].enable();
    // this.ipConfigForm.controls['ipv4_config'].enable();
    this.dhcpPrimaryCheck = false;
    this.ipConfigForm.controls['configure_standby'].patchValue(false);

    this.TableConfigArray[1] = false;
    this.submitButtonCondition = true;


    this.ipConfigForm.controls['r_dhcp'].patchValue(false);

    this.TableConfigArray[2] = false;

    this.showTableFlag = true;
    this.ipConfigForm.get('r_config.r_ip_prefix').enable();
    this.ipConfigForm.get('r_config').enable();

    // this.redundancySlider();


  }

  onReset() {
    // console.log(this.api_data_status);
    if (this.api_data_status === '1') {
      this.patchValueInForm(this.data);
      this.IpvalidateStatus = false;
      this.iperrorStatus = false;
      this.activeIPCallError = false;
      this.standByIPCallError = false;
     // console.log('if');
    } else {
      this.customFormReset();
      this.ipConfigForm.markAsUntouched();
      // console.log('else');
    }
  }

  validateIP(event) {
    this.btnDisable = true;
    this.IpvalidateStatus = false;
    // var value = this.DHCPForm.get('ipv4_addr').value;
    const value = event.target.value;
    const result = value.split('.');
    if (result[0].length < 3) {
      this.btnDisable = true;
      this.IpvalidateStatus = true;
    } else if (result[0] == '225' || result[0] == '224' || result[0] == '127') {
      this.btnDisable = true;
      this.IpvalidateStatus = true;
    } else if (result[0] == '192' && result[1] == '168') {
      this.btnDisable = false;
      this.IpvalidateStatus = false;
    }
  }


  checkIPStandBy(standByIP) {
    {
      this.sameActiveIP = false;
      const activeIP = this.ipConfigForm.get('ip').value;
      // console.log('primary IP');
      // console.log(activeIP.length);

      if (activeIP.length !== 0) {
        if (typeof standByIP == 'string' && typeof activeIP == 'string' && activeIP === standByIP) {
          // console.log('match');
          this.sameStandByIP = true;
          this.btnDisableonIP = true;
        } else {
          // console.log('not match');
          this.sameStandByIP = false;
          this.btnDisableonIP = false;
        }
      } else {
        this.sameStandByIP = false;
      }
    }

  }

  checkIPActive(activeIP) {
    {
      this.sameStandByIP = false;
      const StandByIP = this.ipConfigForm.get('r_config.r_ip').value;
      // console.log('primary IP');
      // console.log(activeIP.length);

      if (activeIP.length !== 0) {
        if (typeof StandByIP == 'string' && typeof activeIP == 'string' && activeIP === StandByIP) {
          // console.log('match');
          this.sameActiveIP = true;
          this.btnDisableonIP = true;
        } else {
          // console.log('not match');
          this.sameActiveIP = false;
          this.btnDisableonIP = false;
        }
      } else {
        this.sameActiveIP = false;
      }
    }

  }

  netmaskValidation(invokedSource) {
    if (invokedSource === 'ip_active_prefix') {
      const prefixValue = this.ipConfigForm.get('ip_prefix').value;
      const prefixVal = '' + prefixValue;
      switch (prefixVal) {
        case '8':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.0.0.0'}});
        case '9':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.128.0.0'}});
        case '10':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.192.0.0'}});
        case '11':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.224.0.0'}});
        case '12':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.240.0.0'}});
        case '13':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.248.0.0'}});
        case '14':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.252.0.0'}});
        case '15':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.254.0.0'}});
        case '16':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.0.0'}});
        case '17':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.128.0'}});
        case '18':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.192.0'}});
        case '19':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.224.0'}});
        case '20':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.240.0'}});
        case '21':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.248.0'}});
        case '22':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.252.0'}});
        case '23':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.254.0'}});
        case '24':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.255.0'}});
        case '25':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.255.128'}});
        case '26':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.255.192'}});
        case '27':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.255.224'}});
        case '28':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.255.240'}});
        case '29':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.255.248'}});
        case '30':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.255.252'}});
        case '31':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': '255.255.255.254'}});
        case '':
          return this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': ''}});
        default :
          this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': ''}});
      }

    } else {
      const prefixValue = this.ipConfigForm.get('r_config.r_ip_prefix').value;
      // console.log(prefixValue);
      const prefixVal = '' + prefixValue;
      switch (prefixVal) {
        case '8':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.0.0.0'}});
        case '9':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.128.0.0'}});
        case '10':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.192.0.0'}});
        case '11':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.224.0.0'}});
        case '12':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.240.0.0'}});
        case '13':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.248.0.0'}});
        case '14':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.252.0.0'}});
        case '15':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.254.0.0'}});
        case '16':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.0.0'}});
        case '17':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.128.0'}});
        case '18':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.192.0'}});
        case '19':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.224.0'}});
        case '20':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.240.0'}});
        case '21':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.248.0'}});
        case '22':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.252.0'}});
        case '23':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.254.0'}});
        case '24':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.255.0'}});
        case '25':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.255.128'}});
        case '26':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.255.192'}});
        case '27':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.255.224'}});
        case '28':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.255.240'}});
        case '29':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.255.248'}});
        case '30':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.255.252'}});
        case '31':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': '255.255.255.254'}});
        case '':
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': ''}});
        default :
          return this.ipConfigForm.patchValue({'r_config': {'r_netmask': ''}});
      }
    }
  }

  callforAnyEdit() {
    this._service.getWeb('configurations/ip-configuration/', '', '').then(_result => {
      if (_result.status == '1') {
        // console.log('cpy data');
        this.copyData = _result.result;
        // console.log('cpy data', this.copyData);

        delete this.copyData.ip_active.vm_details;
        delete this.copyData.ip_standby.vm_details;
        delete this.copyData.redundancy_state;
        // console.log(this.copyData);
      } else {
      }
    });
  }

  loadData() {
    this._service.getWeb('configurations/ip-configuration/', '', '').then(_result => {
      if (_result.status === '1') {
        this.api_data_status = _result.status;
        this.data = _result.result;
        // console.log(this.data);
        this.activeArray = this.data.ip_active.vm_details;
        // console.log(this.data.ip_active);
        // console.log(this.data);
        const redundancy_status = this.data.redundancy_status;

        if (redundancy_status == true) {
          this.standByArray = this.data.ip_standby.vm_details;
        } else {
          const lenOfActiveIP = this.activeArray.length;
          for (let i = 0; i <= lenOfActiveIP; i++) {
            this.standByArray.push('-');
          }
        }

        if (this.data !== 0 && this.data !== undefined && this.data !== '') {
          this.notifyPopup.clear();

          this.patchValueInForm(this.data);

          // console.log('control came back in load data...');
          //  this.showRedundencyFlag = this.data.redundancy_status;

        } else {
          this.disableResetButton = true;
          this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        }
      } else {
        this.customFormReset();
        this.disableResetButton = true;
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      }
    });
  }


  patchValueInForm(data) {
    // console.log('In patch');
    // console.log(data.ip_active.dhcp_status);
    // console.log(data.redundancy_status);
    // console.log(data.ip_standby.dhcp_status);

    // this.ipConfigForm.patchValue({'configure_standby': <boolean>data.redundancy_status});
    // this.ipConfigForm.patchValue({'r_dhcp': <boolean>data.ip_standby.dhcp_status});

    this.ipConfigForm.patchValue({'ip': data.ip_active.start_ip});
    this.ipConfigForm.patchValue({'ip_prefix': data.ip_active.netmask});
    this.ipConfigForm.patchValue({'end_ip': data.ip_active.end_ip});
    this.ipConfigForm.patchValue({'ipv4_config': {'subnet_mask': data.ip_active.subnetmask}});
    this.ipConfigForm.patchValue({'ipv4_config': {'gateway': data.ip_active.gateway}});
    this.ipConfigForm.patchValue({'ipv4_config': {'primary_dns': data.ip_active.primary_dns}});
    this.ipConfigForm.patchValue({'ipv4_config': {'secondary_dns': data.ip_active.secondary_dns}});


    this.ipConfigForm.patchValue({'r_config': {'r_ip': data.ip_standby.start_ip}});
    this.ipConfigForm.patchValue({'r_config': {'r_ip_prefix': data.ip_standby.netmask}});
    this.ipConfigForm.patchValue({'r_config': {'r_end_ip': data.ip_standby.end_ip}});
    this.ipConfigForm.patchValue({'r_config': {'r_netmask': data.ip_standby.subnetmask}});
    this.ipConfigForm.patchValue({'r_config': {'r_gateway': data.ip_standby.gateway}});
    this.ipConfigForm.patchValue({'r_config': {'r_primary_dns': data.ip_standby.primary_dns}});
    this.ipConfigForm.patchValue({'r_config': {'r_secondary_dns': data.ip_standby.secondary_dns}});

    //  this.ipConfigForm.get('r_config.r_ip').setValidators(this.sameAsStandByIP);
    //  this.ipConfigForm.get('ip').setValidators(this.sameAsActiveIP);

    if (data.ip_active.dhcp_status == true) {
      this.ipConfigForm.controls['dhcp'].patchValue(true);

      this.TableConfigArray[0] = true;

      this.showTableFlag = false;
      // this.ipConfigForm.get('ip_prefix').disable();
      // this.ipConfigForm.controls['ip'].disable();
      // this.ipConfigForm.controls['ipv4_config'].disable();
      this.dhcpPrimaryCheck = true;
      // console.log('1');

    } else {
      this.ipConfigForm.controls['dhcp'].patchValue(false);

      this.TableConfigArray[0] = false;

      this.showTableFlag = true;
      // this.ipConfigForm.get('ip_prefix').enable();
      //  this.ipConfigForm.controls['ip'].enable();
      this.dhcpPrimaryCheck = false;
      //  this.ipConfigForm.controls['ipv4_config'].enable();
      // console.log('1- false');
    }

    if (data.redundancy_status == true) {
      this.ipConfigForm.controls['configure_standby'].patchValue(true);

      this.TableConfigArray[1] = true;

      //  this.showRedundancyFlag = true; not require coz we are not setting visibility of sec form from here. since it will be disabled.

      this.submitButtonCondition = false;
      // console.log('2');

    } else {
      this.ipConfigForm.controls['configure_standby'].patchValue(false);

      this.TableConfigArray[1] = false;


      //  this.showRedundancyFlag = false;

      this.submitButtonCondition = true;
      // console.log('2- false');

    }

    if (data.ip_standby.dhcp_status == true) {
      this.ipConfigForm.controls['r_dhcp'].patchValue(true);

      this.TableConfigArray[2] = true;
      this.showTableFlag = false;
      this.dhcpSecondaryCheck = true;
      // this.ipConfigForm.get('r_config.r_ip_prefix').disable();
      // this.ipConfigForm.get('r_config').disable();

      // this.submitButtonCondition = true;
      // console.log('3');
    } else {
      this.ipConfigForm.controls['r_dhcp'].patchValue(false);

      this.TableConfigArray[2] = false;

      this.showTableFlag = true;
      this.dhcpSecondaryCheck = false;
      // this.ipConfigForm.get('r_config.r_end_ip').disable();
      // this.ipConfigForm.get('r_config.r_ip_prefix').enable();
      // this.ipConfigForm.get('r_config').enable();

      //  this.submitButtonCondition = false;

      // console.log('3- false');
    }
    this.btnDisable = true;
    this.redundancySlider();


  }

  showInfo() {
    // console.log('clicked');
    if (this.data.redundancy_status == false && this.data.redundancy_state == true) {
      setTimeout(() => {
        this.showInfoText = '';
      }, 5000);
      this.showInfoText = 'Redundancy is not configured, please configure it first.';
    } else if (this.data.redundancy_status == false && this.data.redundancy_state == false) {
      setTimeout(() => {
        this.showInfoText = '';
      }, 5000);
      this.showInfoText = 'Redundancy is not configured, Please configure it first.';
    } else if (this.data.redundancy_status == true && this.data.redundancy_state == false) {
      setTimeout(() => {
        this.showInfoText = '';
      }, 5000);
      this.showInfoText = 'Redundant WLC is offline, only active WLC is configurable.';
    } else {
      this.ipConfigForm.get('configure_standby').enable();
      this.showInfoText = '';
    }
  }

  redundancySlider() {
    // console.log(this.data);
    if (this.data.redundancy_status == false && this.data.redundancy_state == true) {
      this.ipConfigForm.get('configure_standby').disable();
      this.showRedundancyFlag = 2;
    } else if (this.data.redundancy_status == true && this.data.redundancy_state == false) {
      this.ipConfigForm.get('configure_standby').disable();
      this.ipConfigForm.controls['configure_standby'].patchValue(false);
      this.showRedundancyFlag = 2;
    } else if (this.data.redundancy_status == false && this.data.redundancy_state == false) {
      this.ipConfigForm.get('configure_standby').disable();
      this.showRedundancyFlag = 2;
    } else {
      this.ipConfigForm.get('configure_standby').enable();
      this.showRedundancyFlag = 1;
    }
  }

  ngAfterViewInit() {
   // console.log('After view Init!');
    this.ipConfigForm.statusChanges.subscribe((val) => {
      // console.log('primary valid', this.ipConfigForm.get('ipv4_config').status );
      // console.log('secondary valid', this.ipConfigForm.get('r_config').status );
      // console.log(`IPConfigFull Status    ${val}`);
      //  this.redundancySlider();
      this.showTableFun();
      this.checkAnyUpdate();
    });
  }

  createFormObject() {
    const redundancy_status = this.ipConfigForm.get('configure_standby').value;
// ip_active
    const a_dhcp_status = this.ipConfigForm.get('dhcp').value;
    const a_start_ip = this.ipConfigForm.get('ip').value;
    const a_end_ip = this.ipConfigForm.get('end_ip').value;
    const a_netmask = this.ipConfigForm.get('ip_prefix').value;
    const a_subnetmask = this.ipConfigForm.get('ipv4_config.subnet_mask').value;
    const a_gateway = this.ipConfigForm.get('ipv4_config.gateway').value;
    const a_primary_dns = this.ipConfigForm.get('ipv4_config.primary_dns').value;
    const a_secondary_dns = this.ipConfigForm.get('ipv4_config.secondary_dns').value;

// ip_standby.
    const s_dhcp_status = this.ipConfigForm.get('r_dhcp').value;
    const s_start_ip = this.ipConfigForm.get('r_config.r_ip').value;
    const s_netmask = this.ipConfigForm.get('r_config.r_ip_prefix').value;
    const s_end_ip = this.ipConfigForm.get('r_config.r_end_ip').value;
    const s_subnetmask = this.ipConfigForm.get('r_config.r_netmask').value;
    const s_gateway = this.ipConfigForm.get('r_config.r_gateway').value;
    const s_primary_dns = this.ipConfigForm.get('r_config.r_primary_dns').value;
    const s_secondary_dns = this.ipConfigForm.get('r_config.r_secondary_dns').value;

    this.submittedFormObjects = {
      'redundancy_status': redundancy_status,
      'ip_active': {
        'dhcp_status': a_dhcp_status,
        'start_ip': a_start_ip,
        'end_ip': a_end_ip,
        'netmask': a_netmask,
        'subnetmask': a_subnetmask,
        'gateway': a_gateway,
        'primary_dns': a_primary_dns,
        'secondary_dns': a_secondary_dns
      },
      'ip_standby': {
        'dhcp_status': s_dhcp_status,
        'start_ip': s_start_ip,
        'end_ip': s_end_ip,
        'netmask': s_netmask,
        'subnetmask': s_subnetmask,
        'gateway': s_gateway,
        'primary_dns': s_primary_dns,
        'secondary_dns': s_secondary_dns
      }
    };
    return this.submittedFormObjects;
  }

  onSubmit() {
    // console.log('clicked');
    this.notifyPopup.info('Are you sure to apply IP configurations? This will initiate system reboot...');
  }

  checkAnyUpdate() {
    const formValue = this.createFormObject();
   // console.log('copydata', this.copyData);
   // console.log('formvalue', formValue);
    if (_.isEqual(this.copyData, formValue)) {
      // console.log('objects are same');
      this.btnDisablex = true;
    } else {
      // console.log('here 2');
      this.btnDisablex = false;
     // console.log('objects are not same');
    }

  }

  submitData() {
    const formData = this.createFormObject();
    // console.log(formData);
    // this.notifyPopup.hideLoader('');
    this.notifyPopup.showLoader('System is undergoing a reboot for the latest IP configurations...');
    this._service.postJson('configurations/ip-configuration/', formData).then(_result => {
      if (_result.status === '1') {
        this.notifyPopup.showLoader('System is undergoing a reboot for the latest IP configurations...');
        // this.notifyPopup.success('Settings applied successfully, system rebooting....');
        this.btnDisable = true;
        //  this.loadData();
        //
        // } else {
        //   this.notifyPopup.error(commonMessages.serverError);
        //   this.notifyPopup.hideLoader('');
      } else {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        this.btnDisable = false;
      }
    });
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }

  ngOnDestroy() {
    // this._runtimeCompiler.clearCache();
  }
}
