import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {commonMessages, NotificationService} from '../../../../services/notificationService/NotificationService';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {DataTable, SortEvent} from 'angular2-datatable';
import {ScrollHelper} from '../../../../helpers/scroll-helper/scrollHelper';
import * as _ from 'lodash';
import {isEqual, isObject, transform} from 'lodash/fp';
import {TooltipService} from '../../../../services/tooltip/tooltip.service';
import 'rxjs/add/operator/catch';

const _transform = transform.convert({
  cap: false
});
const iteratee = baseObj => (result, value, key) => {
  if (!isEqual(value, baseObj[key])) {
    const valIsObj = isObject(value) && isObject(baseObj[key]);
    result[key] = valIsObj === true ? differenceObject(value, baseObj[key]) : value;
  }
};

export function differenceObject(targetObj, baseObj) {
  return _transform(iteratee(baseObj), null, targetObj);
}

@Component({
  selector: 'app-aaa-server',
  templateUrl: './aaa-server.component.html',
  styleUrls: ['./aaa-server.component.css']
})
export class AaaServerComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private elRef: ElementRef,
              public http: Http,
              private _service: WebserviceService,
              private notifyPopup: NotificationService,
              private tooltipService: TooltipService
  ) {
    // this.socket = io(this.url);
  }

  showInfoText = '';
  toggleDisableofSecondaryForm = true;
  selectedAAAName = 'Add AAA Server';
  // API
  successFlag;
  interval;

  // for passphrase -- blind and eye.
  // isText = false;
  isTextPrimary = false;
  isTextSecondary = false;
  submitButtonCondition;
// edit data validation
  editArray;
  iperrorStatus = false;
  seciperrorStatus = false;
  clickactive: number = -1;

  selectedAAAServerArray = [];
  selectedAAA: any;
  isChecked = false;
  selectAllFlag = false;
  addFlag = false;
  private scrollHelper: ScrollHelper = new ScrollHelper();

  // Data table literals.
  dataLength;
  showingfrom = 0;
  showingto = 0;
  tabledata;
  pageModulus = 0;
  currentPage;

  _sortBy;
  _sortOrder;
  rowsOnPage = 20;


  samePrimaryPort = false;
  sameSecondaryPort = false;

// AAA server add/edit panel.
  addAAAServerFlag = false;
  samePrimaryIP = false;
  sameSecondaryIP = false;
  editFlag = false;
  aaa_data;
  btnDisablex = true;
  btnDisable = true;
  IpvalidateStatus;
  serverColCount = 0;
  filterOption = true;
  btndisable_secondary = false;

  columnsAAAObjects = [];
  data;
  payLoad;
  apiErrorMsg;
  tableRefreshTimer;
  ssidDetailArray = [];

  @ViewChild('mf') aaa_dataTable: DataTable;
  aaaServerForm: FormGroup;


  xipValdationRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  ipValdationRegex = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;

  // IPpattern = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;

  /* pagination declaration variable*/
  page: number = 1;
  Math: any = Math;
  firstarrowStatus: boolean = true;
  lastarrowStatus: boolean = false;

  /*pagination declaration variable end */

  ngOnInit() {
    this.notifyPopup.showing().subscribe((page) => {
      if (page == 'aaaserver') {
        this.showAAAnames();
      }
    });

    this.notifyPopup.confirmationOk().subscribe((page) => {
      if (page == 'aaaserver') {
        this.deleteAAA();
      }
    });
    this.generateForm();
    this.loadData();
    this.loadAAAServerColumnData();

    this.onChanges();
    //  console.log(this.aaaServerForm.controls['secondary_aaa'].valid);
  }

  showAAAnames() {
    this.notifyPopup.details(this.ssidDetailArray);
    return false;
  }

  generateForm() {
    this.aaaServerForm = new FormGroup({
      'server_name': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
        this.noSpaceatStart,
        this.noSpaceatend,
        this.noSpecialCharatStart,
        this.noSpecialCharatEnd,
        this.noTwoSpace,
        this.noEmoji
      ]),
      'primary_aaa': new FormGroup({
        'p_ip_type': new FormControl('1'),
        'p_server_ip': new FormControl('', [
          Validators.required,
          Validators.pattern(this.ipValdationRegex),
          this.restrictedIP
        ]),

        'p_port_number': new FormControl('', [
          Validators.required,
          Validators.min(1),
          Validators.max(65535)
        ]),
        'p_passphrase': new FormControl('', [
          Validators.required,
          this.noSpaceatStart,
          this.noSpaceatend,
          Validators.minLength(8),
          Validators.maxLength(32)
        ])

      }),

      'secondary_aaa': new FormGroup({
        's_ip_type': new FormControl('1'),
        's_server_ip': new FormControl('', [
          Validators.required,
          Validators.pattern(this.ipValdationRegex),
          this.restrictedIP
        ]),
        's_port_number': new FormControl('', [
          Validators.required,
          Validators.min(1),
          Validators.max(65535)
        ]),
        's_passphrase': new FormControl('', [
          Validators.required,
          this.noSpaceatStart,
          this.noSpaceatend,
          Validators.maxLength(32),
          Validators.minLength(8)
        ])
      }),
    });
  }

  double_click_event(aaa, index) {
    this.samePrimaryIP = false;
    this.sameSecondaryIP = false;
    this.samePrimaryPort = false;
    this.sameSecondaryPort = false;
    this.formReset();
    this.clickactive = -1;
    const chkLen = this.elRef.nativeElement.querySelectorAll('.aaa-check').length;
    for (let i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.aaa-check')[i]['checked'] = false;
    }

    this.selectedAAAServerArray.push(aaa);
    if (this.selectedAAAServerArray.length === 1) {
      this.selectedAAA = aaa.aaa_server_id;
      this.clickactive = index;
      this.elRef.nativeElement.querySelectorAll('.aaa-check')[index]['checked'] = true;
      this.isChecked = true;

    } else {
      this.selectedAAA = null;
    }
    this.editAAA();
  }

  onChanges(): void {
    this.aaaServerForm.controls['secondary_aaa'].disable();
    this.aaaServerForm.get('primary_aaa').statusChanges.subscribe(val => {
      this.checkAnyUpdate();
     // console.log(`status of Primary Server ${val}`);
      if (val === 'VALID') {
        this.aaaServerForm.controls['secondary_aaa'].enable();
      } else {
        this.aaaServerForm.controls['secondary_aaa'].disable();
      }

    });
  }

  checkAnyUpdate() {
    if (_.isEqual(this.editArray, this.aaaServerForm.value)) {
      // console.log(this.editArray);
      // console.log(this.aaaServerForm.value);
      this.btnDisablex = true;
    //  console.log('is primary-aaa invalid', this.aaaServerForm.get('primary_aaa').invalid);
    //  console.log('is server-name invalid', this.aaaServerForm.get('server_name').invalid);
    //  console.log('is btndisable', this.btnDisable);
    //  console.log('same object');
    } else {
      this.btnDisablex = false;
    //  console.log('is primary-aaa invalid', this.aaaServerForm.get('primary_aaa').invalid);
    //  console.log('is server-name invalid', this.aaaServerForm.get('server_name').invalid);
    //  console.log('is btndisable', this.btnDisable);
    //  console.log('differnce');

    }
    this.scrollHelper.scrollToFirst('detailArea');
  }

  loadData() {
    this._service.getWeb('configurations/aaa-server-configurations/', '', '').then(data => {
      if (data) {
        this.aaa_data = data.result;
        this.notifyPopup.clear();
        this.tabledata = Object.keys(data.result).length;
        // console.log(this.tabledata);
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
    this.reloadData();
  }


  reloadData() {
    this.tableRefreshTimer = setInterval(() => {
      this._service.getWeb('configurations/aaa-server-configurations/', '', '').then(data => {
        if (data) {
          this.aaa_data = data.result;
          this.notifyPopup.clear();
          this.tabledata = Object.keys(data.result).length;
          // console.log(this.tabledata);
        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    }, 300000);
  }


  addAAA() {
    this.selectedAAAName = 'Add AAA Server';
    this.addFlag = true;
    this.formReset();
    this.addAAAServerFlag = true;
    this.scrollHelper.scrollToFirst('detailArea');
    this.clearValidators();
    // toggleState(val)
  }

  showInfo() {
    if (this.aaaServerForm.get('primary_aaa').invalid || this.aaaServerForm.get('server_name').invalid) {
      setTimeout(() => {
        this.showInfoText = '';
      }, 5000);
      this.showInfoText = 'Primary Server configuration is compulsory to configure Secondary Server.';
    }

  }

  toggleState(val) {
    // console.log(val);
    if (val === true) {
      this.toggleDisableofSecondaryForm = false;
      this.submitButtonCondition = true;
      //  console.log('Button state', this.submitButtonCondition);
    } else {
      this.toggleDisableofSecondaryForm = true;
      this.submitButtonCondition = false;

      this.aaaServerForm.patchValue({'secondary_aaa': {'s_server_ip': ''}});
      this.aaaServerForm.patchValue({'secondary_aaa': {'s_port_number': ''}});
      this.aaaServerForm.patchValue({'secondary_aaa': {'s_passphrase': ''}});

      this.aaaServerForm.get('secondary_aaa.s_server_ip').markAsUntouched();
      this.aaaServerForm.get('secondary_aaa.s_port_number').markAsUntouched();
      this.aaaServerForm.get('secondary_aaa.s_passphrase').markAsUntouched();
    }
  }

  clearValidators() {
    this.aaaServerForm.get('secondary_aaa.s_server_ip').markAsUntouched();
    this.aaaServerForm.get('secondary_aaa.s_port_number').markAsUntouched();
    this.aaaServerForm.get('secondary_aaa.s_passphrase').markAsUntouched();

    this.aaaServerForm.patchValue({'secondary_aaa': {'s_server_ip': ''}});
    this.aaaServerForm.patchValue({'secondary_aaa': {'s_port_number': ''}});
    this.aaaServerForm.patchValue({'secondary_aaa': {'s_passphrase': ''}});
  }

  editAAA() {
    this.iperrorStatus = false;

    this.notifyPopup.showLoader('Please wait, loading configuration data...');
    if (Object.keys(this.selectedAAAServerArray).length === 1) {
      this.editFlag = true;

      //  console.log(this.editArray);
      this._service.getWeb('configurations/aaa-server-configurations/' + this.selectedAAA + '/', '', '').then(data => {
        this.selectedAAAName = data.result.server_name;
        if (data.status === '1') {
          let res = data.result;
          //   console.log(res);
          //    console.log(this.selectedAAAName);

          delete res.server_id;
          delete res.server_type;

          this.editArray = res;


          this.aaaServerForm.setValue(res);
          this.notifyPopup.hideLoader('');

          this.checkAnyUpdate();
        } else {

        }
      });

    } else {
      this.notifyPopup.error(commonMessages.selectoneaaa_edit);
      return false;
    }
    this.aaaServerForm.valueChanges.subscribe(() => {
      this.checkAnyUpdate();

    });


  }

  deleteData() {

    // this.groupdetailArr = [];
    if (this.selectedAAAServerArray.length > 0) {
      // console.log(this.selectedVapArray);
      for (let aaa of this.selectedAAAServerArray) {

        if (aaa.default == true) {
          this.notifyPopup.error(commonMessages.default_aaa_error);
          return false;
        }
      }
      //  if(this.groupdetailArr.length>0){
      //   this.notifyPopup.error_details(commonMessages.mapped_ssid_error);
      //  return false;
      // }
      this.notifyPopup.info(commonMessages.confirm_delete_AAA);
    } else {
      this.notifyPopup.error(commonMessages.selectonessid);
    }

  }

  deleteAAA() {
    this.notifyPopup.hideLoader('');
    this.notifyPopup.showLoader(commonMessages.delete_AAA);
    if (this.selectedAAAServerArray.length > 0) {
      let del_array = '';
      for (let aaa of this.selectedAAAServerArray) {
        del_array = del_array + ',' + aaa;
      }
      // remove starting commas and appends as query params
      del_array = del_array.replace(/^,/, '');
      this._service.deleteWeb('configurations/aaa-server-configurations/?aaa-server-id=' + del_array, '').then(_data => {

        if (_data.status == 1) {
          if (this.selectedAAAServerArray.length !== _data.random_id.length) {
            for (let ssid of _data.affected_ssid) {
              let ssidArray = [];
              console.log(JSON.stringify((_data.affected_ssid)));
              for (let i of ssid.ssid_list) {
                const ssidList = {'ssidname': i};
                ssidArray.push(ssidList);
              }
              this.ssidDetailArray.push(
                {
                  'Profile_name': ssid.server_name,
                  'ssidnames': ssidArray
                });
            }
            this.notifyPopup.hideLoader('');
            this.notifyPopup.error_details(commonMessages.aaa_ssid_error);
            console.log(this.ssidDetailArray);
          } else {
            this.notifyPopup.hideLoader('');
            this.notifyPopup.success(commonMessages.aaa_delete_success);
          }
          setTimeout(() => {
            this.formReset();
            this.loadData();
          }, 5000);
        } else {  // this else for status 0 coming from server.
          this.notifyPopup.error(commonMessages.aaa_failed_delete);
          this.formReset();
          this.loadData();
        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    } else {
      this.notifyPopup.logoutpop(commonMessages.selectoneaaa_edit);
    }

  }

  blockAllChar(event) {
    return (event.ctrlKey || event.altKey
      || (47 < event.keyCode && event.keyCode < 58 && event.shiftKey == false)
      || (95 < event.keyCode && event.keyCode < 106)
      || (event.keyCode == 8) || (event.keyCode == 9)
      || (event.keyCode > 34 && event.keyCode <= 40)
      || (event.keyCode == 46));

  }


  checkboxClick(eventObject, aaaServer) {
    eventObject.stopPropagation();
    // this.formReset();
    if (eventObject.target.checked) {
      this.selectedAAAServerArray.push(aaaServer);
      if (this.selectedAAAServerArray.length === 1) {
        this.selectedAAA = aaaServer;
        //  console.log(this.selectedAAA);
      } else {
        this.selectedAAA = null;
      }
      this.isChecked = true;
    } else {

      this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
      this.selectedAAA = null;
      let currentAAA = this.selectedAAAServerArray.find(function (aaaServer) {
        // I am not sure what is going here.
        return aaaServer === aaaServer;
      });
      //  console.log('current AAA', currentAAA);
      const idx = this.selectedAAAServerArray.indexOf(currentAAA);
      this.selectedAAAServerArray.splice(idx, 1);
      if (this.selectedAAAServerArray.length === 1) {
        this.selectedAAA = this.selectedAAAServerArray[0].aaa_server_id;
      } else {
        this.selectedAAA = null;
        if (this.selectedAAAServerArray.length < 1) {
          this.selectAllFlag = false;
          this.selectedAAAServerArray = [];
          this.isChecked = false;
        }
      }

    }
  }

  selectAllAAA(eventObject) {
    this.selectedAAAServerArray = [];
    console.log('SelectedAAA-Array in before select all', this.selectedAAAServerArray);
    if (eventObject.target.checked) {
      // if (this.aaa_data !== undefined || Object.keys(this.aaa_data.result).length !== 0) {
      if (this.aaa_data !== undefined) {
        this.selectAllFlag = true;
        //   console.log('ResultData in', this.aaa_data);

        for (let elements of this.aaa_data) {
          this.selectedAAAServerArray.push(elements.aaa_server_id);
          //  Below conditions are only required if some default AAA server exists.
          // if (!elements.default) {
          //   this.selectedAAAServerArray.push(elements);
          // }
        }
        console.log('SelectedAAA-Array in after select all', this.selectedAAAServerArray);
        this.isChecked = true;
      } else {
        // this.notifyPopup.error(commonMessages.nodatainaaa);
        this.uncheckAll();
        this.selectAllFlag = false;
        this.selectedAAAServerArray = [];
        this.isChecked = false;
      }
    } else {
      this.uncheckAll();
      this.selectAllFlag = false;
      this.selectedAAAServerArray = [];
      this.isChecked = false;
    }
  }

  uncheckAll() {
    const chkLen = this.elRef.nativeElement.querySelectorAll('.aaa-check').length;
    // console.log('In uncheckAll', chkLen);
    for (let i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.aaa-check')[i]['checked'] = false;
    }
    this.selectedAAAServerArray = [];
  }

  loadAAAServerColumnData() {
    this.columnsAAAObjects = [
      {name: 'Server Name', checked: true},
      {name: 'Server IP', checked: true},
      {name: 'No. of SSID', checked: true},
      {name: 'No. of APs', checked: true}
    ];
  }

  checkIPSecondary(secondaryIP) {
    // console.log(source);
    this.samePrimaryIP = false;
    const primaryIP = this.aaaServerForm.get('primary_aaa.p_server_ip').value;
    //  console.log('secondary IP');
    if (typeof secondaryIP == 'string' && typeof secondaryIP == 'string' && secondaryIP === primaryIP) {
      // console.log('match');
      this.sameSecondaryIP = true;
      this.btnDisable = true;
    } else {
      //     console.log('not match');
      this.sameSecondaryIP = false;
      this.btnDisable = false;
    }
  }

  checkIPPrimary(primaryIP) {
    {
      this.sameSecondaryIP = false;
      const secondaryIP = this.aaaServerForm.get('secondary_aaa.s_server_ip').value;
      //  console.log('primary IP');
      // console.log(primaryIP.length);

      if (primaryIP.length !== 0) {
        if (typeof secondaryIP == 'string' && typeof secondaryIP == 'string' && secondaryIP === primaryIP) {
          //   console.log('match');
          this.samePrimaryIP = true;
          this.btnDisable = true;
        } else {
          //   console.log('not match');
          this.samePrimaryIP = false;
          this.btnDisable = false;
        }
      } else {
        this.samePrimaryIP = false;
      }
    }

  }

  checkPrimaryPort(primaryPort) {
    // console.log('check primary port');
    this.sameSecondaryPort = false;
    //  console.log(primaryPort);
    const secondaryPort = this.aaaServerForm.get('secondary_aaa.s_port_number').value.toString();
    // console.log('primary Port');
    if (primaryPort.length !== 0) {
      if (primaryPort === secondaryPort) {
        //    console.log('match');
        this.samePrimaryPort = true;
        this.btnDisable = true;
      } else {
        //    console.log('not match');
        this.samePrimaryPort = false;
        this.btnDisable = false;
      }
    } else {
      this.samePrimaryPort = false;
    }
  }

  checkSecondaryPort(secondaryPort) {
    this.samePrimaryPort = false;
    //   console.log('secondary port', typeof(secondaryPort));
    const primaryPort = this.aaaServerForm.get('primary_aaa.p_port_number').value.toString();
    //  console.log('primary port', typeof(primaryPort));

    if (secondaryPort === primaryPort) {
      //  console.log('match');
      this.sameSecondaryPort = true;
      this.btnDisable = true;
    } else {
      // console.log('not match');
      this.sameSecondaryPort = false;
      this.btnDisable = false;
    }
  }


  validatePrimaryIP() {
    // alert( this.systemRedundancy.get('redundancy_ipv4').value)
    const value = this.aaaServerForm.get('primary_aaa.p_server_ip').value;
    const result = value.split('.');
    if (result[0].length == 0) {
      this.iperrorStatus = true;
      this.btnDisable = true;
    } else if (result[0] == '127' || result[0] == '8' || result[0] == '4') {
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

  validateSecondaryIP() {
    // alert( this.systemRedundancy.get('redundancy_ipv4').value)
    const value = this.aaaServerForm.get('secondary_aaa.p_server_ip').value;
    const result = value.split('.');
    if (result[0].length == 0) {
      this.seciperrorStatus = true;
      this.btnDisable = true;
    } else if (result[0] == '127' || result[0] == '8' || result[0] == '4') {
      this.seciperrorStatus = true;
      this.btnDisable = true;
    } else if (result[0] < 224 && result[0] >= 1 && result[3] < 255) {
      this.seciperrorStatus = false;
      this.btnDisable = false;
    }
    else {
      this.seciperrorStatus = true;
      this.btnDisable = true;
    }

  }

  public ipMatch(control: FormControl) {
    const primaryIP = this.aaaServerForm.get('primary_aaa.p_server_ip').value;
    // console.log(primaryIP);
    const secondaryIP = control.value;
    //  const result = value.split('.');
    const isValid = secondaryIP !== primaryIP ? true : false;
    return isValid ? null : {'ipMatch': true};
  }

  public restrictedIP(control: FormControl) {
    // console.log(control.value);
    const value = control.value.toString();
    const result = value.split('.');
    const isValid = (result[0] == '192' && result[1] == '0' && result[2] == '2') || (result[0] == '224' || result[0] == '0' || result[0] == '4' || result[0] == '8' || result[0] == '127' || result[0] == '5' || result[0] == '255' || result[0] == '00' || result[0] == '000');
    // console.log(isValid);
    return isValid ? {'restrictedIP': true} : null;
  }

  public noSpaceatStart(control: FormControl) {
    const isWhitespace = control.value.charAt(0) === ' ';
    const isValid = !isWhitespace;
    return isValid ? null : {'spaceatstart': true};
  }

  public noSpaceatend(control: FormControl) {
    const isWhitespace = control.value.charAt(control.value.length - 1) === ' ';
    const isValid = !isWhitespace;
    return isValid ? null : {'spaceatend': true};
  }

  public noSpecialCharatStart(control: FormControl) {
    const isSpecialChar = /^[a-zA-Z0-9 ]*$/.test(control.value.charAt(0));
    const isValid = isSpecialChar;
    return isValid ? null : {'specialatstart': true};
  }

  public noSpecialCharatEnd(control: FormControl) {
    const isSpecialChar = /^[a-zA-Z0-9 ]*$/.test(control.value.charAt(control.value.length - 1));
    const isValid = isSpecialChar;
    return isValid ? null : {'specialatend': true};
  }

  public noTwoSpace(control: FormControl) {
    const twoSpace = control.value.indexOf('  ');
    const isValid = twoSpace == -1 ? true : false;
    return isValid ? null : {'twospaces': true};
  }

  public noEmoji(control: FormControl) {
    const isEmoji = /(?:[\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|(?:\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6]|\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0]))/.test(control.value);
    const isValid = !isEmoji;
    return isValid ? null : {'emoji': true};
  }


  checkIsAAAExists() {
    let t = this;
    // console.log(t.aaaServerForm.get('server_name').value);
    let searchArray = this.aaa_data.find(function (searchArray) {
      //  console.log(searchArray, 'searchArray');
      //  console.log('Name compare');

      console.log(searchArray.aaa_server_name === t.aaaServerForm.get('server_name').value);
      return searchArray.aaa_server_name === t.aaaServerForm.get('server_name').value;
    });

    let searchID = this.aaa_data.find(function (searchID) {
      // console.log(searchID.aaa_server_id + 'Search ID');
      // console.log('ID compare');
      //  console.log(searchID.aaa_server_id === t.selectedAAA);
      return searchID.aaa_server_id === t.selectedAAA;
    });

    if (searchArray && !searchID) {
      // this.errorMsg = 'SSID name already exists';
      // this.showModal();
      this.notifyPopup.error(commonMessages.aaa_name_exists);
      return false;
    } else {
      if (searchID && this.editArray.server_name !== t.aaaServerForm.get('server_name').value) {
        let searchArray2 = this.aaa_data.find(function (searchArray2) {
          return searchArray2.server_name === t.aaaServerForm.get('server_name').value;
        });
        if (searchArray2) {
          // this.errorMsg = 'SSID name already exists';
          // this.showModal();
          // this.notifyPopup.error(commonMessages.aaa_name_exists);
          return false;
        } else {
          return true;
        }

      } else {
        return true;
      }
    }

  }

  updateAAA() {
    if (this.checkIsAAAExists()) {
      let newJson = {};
      newJson = differenceObject(this.aaaServerForm.value, this.editArray);
      //  console.log(newJson, 'newjson');
      newJson['aaa_server_id'] = this.selectedAAA;
      newJson['aaa_server_name'] = this.aaaServerForm.get('server_name').value;
      this.notifyPopup.showLoader(commonMessages.aaaSSID);
      this._service.putJson('configurations/aaa-server-configurations/' + this.selectedAAA + '/', newJson).then(_result => {
        if (_result.status === '1') {

          this.notifyPopup.hideLoader('');
          this.notifyPopup.success(commonMessages.aaa_update_success);
          this.formReset();

          setTimeout(() => {
            this.loadData();
          }, 2000);

          this.successFlag = true;


        } else {
          // this.alertPopUp = this.alertService.danger("Internal Error,Try after some time");
          this.notifyPopup.hideLoader('');
          this.notifyPopup.error(commonMessages.failure_wcm);

          this.formReset();

          //     console.log(data.status);
          this.successFlag = false;


          this.loadData();
          // this.spinnerService.hide();
        }

      });
    }
  }


  onSubmit() {
    //   console.log(this.aaaServerForm.value);
    this.payLoad = JSON.stringify(this.aaaServerForm.value);
    //   console.log(this.checkIsAAAExists());
    this.uncheckAll();
    if (this.checkIsAAAExists()) {
      this.notifyPopup.showLoader(commonMessages.addAAA);
      //    console.log('In if block');
      this._service.postJson('configurations/aaa-server-configurations/', this.aaaServerForm.value).then(_result => {

        if (_result.status === '1') {
          // this.notifyPopup.showLoader(commonMessages.addAAA);
          this.notifyPopup.hideLoader('');
          this.notifyPopup.success(commonMessages.aaa_save_success);
          this.formReset();
          this.submitButtonCondition = false;
          // this.clearValidators();

          setTimeout(() => {
            this.loadData();
          }, 2000);

          this.successFlag = true;


        }  // else if (_result.status === '0' && _result.msg === 'ip_exists') {
        //   this.notifyPopup.error(_result.msg[0]);
        // }
        else {
          this.apiErrorMsg = _result.msg[0];
          // this.showModal();
          // console.log(_result.msg[0]);
          this.notifyPopup.hideLoader('');
          this.notifyPopup.error(_result.msg);
          this.btnDisable = true;
          // this.notifyPopup.error(_result.msg);
          setTimeout(() => {
            this.loadData();
          }, 3000);

          this.successFlag = false;
          // this.formReset();
        }
      }).catch((error) => {
        // this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    }
  }


  formReset() {
    this.generateForm();
    this.addFlag = false;
    this.editFlag = false;
    this.isChecked = false;
    this.iperrorStatus = true;
    this.seciperrorStatus = true;
    this.selectedAAAName = 'Add AAA Server';
    this.btnDisable = true;
    this.uncheckAll();
    this.addAAAServerFlag = false;
  }

  onCancel() {
    // this.editFlag = false;
    this.formReset();
    this.submitButtonCondition = false;
  }

  selectServerColoums(event, index) {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.checked === false) {
      this.serverColCount = this.serverColCount + 1;
    } else {
      this.serverColCount = this.serverColCount - 1;
    }
    if (this.serverColCount <= 1) {
      this.columnsAAAObjects[index].checked = event.target.checked;
    } else {
      this.columnsAAAObjects[index].checked = true;
    }
  }

  holdPopup(event) {
    event.stopPropagation();
  }

  ngAfterViewInit() {
    this.checkAnyUpdate();

    this.aaa_dataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });

    this.aaa_dataTable.onPageChange.subscribe((x) => {
      const checkLen = this.elRef.nativeElement.querySelectorAll('.ssid-check').length;
      for (let i = 0; i < checkLen; i++) {
        this.elRef.nativeElement.querySelectorAll('.ssid-check')[i]['checked'] = false;
        this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;

      }
      this.currentPage = x.activePage;
      this.dataLength = x.dataLength;
      this.pageModulus = this.dataLength % x.rowsOnPage;
      if (x.rowsOnPage * this.currentPage > x.dataLength) {
        this.showingto = (x.rowsOnPage * (this.currentPage - 1)) + this.pageModulus;
        this.showingfrom = (this.showingto - this.pageModulus) + 1;
      } else {
        this.showingto = x.rowsOnPage * this.currentPage;
        this.showingfrom = (this.showingto - x.rowsOnPage) + 1;
      }


    });

    this.aaaServerForm.valueChanges.subscribe(() => {
      if (this.editFlag) {
        this.checkAnyUpdate();
      }
    });

  }

  showpasswordofPrimaryPassphrase() {
    if (!this.isTextPrimary) {
      this.isTextPrimary = true;
    } else {
      this.isTextPrimary = false;
    }
  }

  showpasswordofSecondaryPassphrase() {
    if (!this.isTextSecondary) {
      this.isTextSecondary = true;
    } else {
      this.isTextSecondary = false;
    }
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }


  /* pagination method here*/
  getNext(page) {
    this.page = page;
    if (this.page == 1) {
      this.firstarrowStatus = true;
      this.lastarrowStatus = false;
    } else if (this.page == this.Math.ceil(this.data.length / this.rowsOnPage)) {
      this.lastarrowStatus = true;
      this.firstarrowStatus = false;
    }
    else {
      this.firstarrowStatus = false;
      this.lastarrowStatus = false;
    }
  }

  goToPage(num) {
    this.getNext(num);
  }

  ngOnDestroy(): void {
    clearInterval(this.tableRefreshTimer);
  }

  /* pagination method here end*/


}
