import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Component, OnInit, TemplateRef, ElementRef, ViewChild, ContentChild, SimpleChanges} from '@angular/core';
import {DataTable, SortEvent} from 'angular2-datatable';
import {Http} from '@angular/http';
import {TabsetComponent} from 'ngx-bootstrap';
import {WebserviceService} from '../../../../../services/commonServices/webservice.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {BsModalService} from 'ngx-bootstrap/modal';
import {AlertService} from 'ngx-alerts';
import * as io from 'socket.io-client';
import {commonUrl} from '../../../../../../app/services/urls/common-url';
import {ScrollHelper} from '../../../../../helpers/scroll-helper/scrollHelper';
import {ModalDirective} from 'ngx-bootstrap/modal';
import * as _ from 'lodash';
import {NotificationService, commonMessages} from '../../../../../services/notificationService/NotificationService';
import {TooltipService} from '../../../../../services/tooltip/tooltip.service';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-ssid-config',
  templateUrl: './ssid-config.component.html',
  styleUrls: ['./ssid-config.component.css']
})
export class SsidConfigComponent implements OnInit {
  constructor(
    private elRef: ElementRef, private http: Http,
    private _service: WebserviceService,
    private alertService: AlertService,
    private spinnerService: Ng4LoadingSpinnerService,
    private notifyPopup: NotificationService,
    private tooltipService: TooltipService
  ) {
   // this.socket = io(this.url);
  }

  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  @ViewChild('errorModalbtn') errorBtn: ElementRef;
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  public ssidForm: FormGroup;
  private alphanumeric = /^[a-zA-Z0-9]*$/;
  private isText = false;
  public coloumsObjects: any = [];
  public data;
  public rowsOnPage = 20;
  public _sortBy;
  public _sortOrder;
  public addFlag: boolean = false;
  public count = 0;
  private url = commonUrl.dynamicsocket;
  private socket;
  public alertPopUp;
  public interval;
  public successFlag;
  public vapID = '';
  public errorMsg = '';
  public isModalShown: boolean = false;
  public passphraseCopy: string;
  public selectAllFlag: boolean = false;
  public btnDisable;
  private scrollHelper: ScrollHelper = new ScrollHelper();
  public isDuplicate;
  private showingto = 0;
  private showingfrom = 0;
  private pageModulus = 0;
  public currentPage;
  public dataLength;
  public selectedVapArray = [];
  public selectedVap: any;
  public editFlag;
  public deleteSuccessFlag: boolean = false;
  deleteCheckedStatus: boolean = false;
  showLoaderBoolStatus: boolean = true;
  hideLoaderBoolStatus: boolean = false;
  clickactive: number = -1;
  public groupdetailArr = [];
  isConfirmed = false;
  aaaserverDetails;
  vlanArr : any = [];
  macAclArr : any = [];
  isMultimediaChecked = true;
  @ViewChild('mf')
  private ssiddataTable: DataTable;

  /* pagination declaration variable*/
  page: number = 1;
  Math:any = Math;
  firstarrowStatus:boolean = true;
  lastarrowStatus:boolean = false;
  /*pagination declaration variable end */
  ngOnInit(): void {
    this.notifyPopup.confirmationOk().subscribe((page) => {
      if (page == 'ssidConfiguration') {
        this.deleteSSID();
      }
    });
    this.notifyPopup.showing().subscribe((page) => {
      if (page == 'ssidConfiguration') {
        this.showGroupnames();
      }
    });
    this.notifyPopup.removing().subscribe((page) => {
      if (page == 'ssidConfiguration') {
        this.loadData();
        this.formReset();
      }
    });
    this.loadData();
    this.generateForm();
    this.updateMobility(this.ssidForm.get('is_l2_roaming_enabled').value);
   // window.addEventListener('scroll', this.scroll, true); //third parameter
  }

  generateForm() {
    this.ssidForm = new FormGroup({
      'ssid': new FormControl('', [
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
      'vap_enable': new FormControl(true, [
        Validators.required
      ]),
      'broadcastssid': new FormControl(true, [
        Validators.required
      ]),
      'authtype': new FormControl('2', [
        Validators.required
      ]),
      'passphrase': new FormControl('password', [
        // Validators.required
      ]),
      'aaa_type': new FormControl('2', [
        // Validators.required
      ]),
      'aaa_id': new FormControl(0, [
        // Validators.required
      ]),
      'vlan_id': new FormControl([
        Validators.required

      ]),
      'is_l2_roaming_enabled': new FormControl(true, [
        Validators.required
      ]),
      'mobility_domain': new FormControl(0),
      'l3_roaming': new FormControl(true, [
        Validators.required
      ]),
      'band_steering': new FormControl(true, [
        Validators.required
      ]),
      'rssi_threshold': new FormControl('10', [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
        Validators.minLength(2)
        //this.ValidNumbers

      ]),
      'macmode': new FormControl(0),
      'is_wmm_enabled': new FormControl(true, [
        Validators.required
      ]),
      'is_wmm_power_save_enabled': new FormControl(true),
      'mac_acl_type': new FormControl('0'),
      'mac_acl_id': new FormControl(null),
      'mac_acl_policy': new FormControl(true),
      'is_pmf_enabled': new FormControl(true),
      'upload_rate_limit_in_mbps': new FormControl(1,[ 
        Validators.min(1),
        Validators.max(1024)
      ]),
      'download_rate_limit_in_mbps': new FormControl(1,[ 
        Validators.min(1),
        Validators.max(1024)
      ]),
    });
  }
  public ValidNumbers(control: FormControl) {
    let isNumber =  /^[-+]?[0-9]*\.?[0-9]+$/.test(control.value);
    let isValid = isNumber;
    return isValid ? null : {'invalidnumber': true};
  }
  public noSpaceatStart(control: FormControl) {
    let isWhitespace = control.value.charAt(0) === ' ';
    let isValid = !isWhitespace;
    return isValid ? null : {'spaceatstart': true};
  }

  public noSpaceatend(control: FormControl) {
    let isWhitespace = control.value.charAt(control.value.length - 1) === ' ';
    let isValid = !isWhitespace;
    return isValid ? null : {'spaceatend': true};
  }

  public noSpecialCharatStart(control: FormControl) {
    let isSpecialChar = /^[a-zA-Z0-9 ]*$/.test(control.value.charAt(0));
    let isValid = isSpecialChar;
    return isValid ? null : {'specialatstart': true};
  }

  public noSpecialCharatEnd(control: FormControl) {
    let isSpecialChar = /^[a-zA-Z0-9 ]*$/.test(control.value.charAt(control.value.length - 1));
    let isValid = isSpecialChar;
    return isValid ? null : {'specialatend': true};
  }

  public noTwoSpace(control: FormControl) {
    let twoSpace = control.value.indexOf('  ');
    let isValid = twoSpace == -1 ? true : false;
    return isValid ? null : {'twospaces': true};
  }

  public noEmoji(control: FormControl) {
    let isEmoji = /(?:[\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|(?:\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6]|\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0]))/.test(control.value);
    let isValid = !isEmoji;
    return isValid ? null : {'emoji': true};
  }
  public selectOne(control: FormControl) {

    let noOption = control.value == '-1';
    let isValid = !noOption;
    return isValid ? null : {'nooption': true};
  }
  changeMultimedia(val){
    if(val){
      this.isMultimediaChecked = true;
    }else{
      this.isMultimediaChecked = false;
    }
  }
  selectedAuthType(param) {
    let val;
    if (param.target) {
      val = param.target.value;
    } else {
      val = param;
    }

    if (val == 0) {
      this.ssidForm.get('passphrase').clearValidators();
      this.ssidForm.get('passphrase').setValue(null);
    } else {
        this.ssidForm.get('passphrase').setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(63),
        this.noSpaceatStart, this.noEmoji]);
        this.ssidForm.get('passphrase').setValue(this.addFlag ? 'password' : this.auth_type_copy == val ? this.passphrase_copy : 'password');

    }
    if (val == 5) {
      this.ssidForm.get('aaa_type').setValue('2');
      this.getaaaDetails();
      this.ssidForm.get('passphrase').clearValidators();
      this.ssidForm.get('passphrase').setValue(null);
     // this.ssidForm.get('passphrase').setValue(null);
      //console.log(this.aaaserverDetails);
    }else{
      this.ssidForm.get('aaa_id').clearValidators();
      this.ssidForm.get('aaa_id').setValue(null);
    }
  }
  getaaaDetails(){
   // this.aaaserverDetails = this.dummmyData.result;
    // console.log(this.aaaserverDetails);
     this._service.getWeb('utils/aaa-server-list/?server_type=2', '', '').then(_result => {
       if (_result) {
         this.aaaserverDetails = _result.result;
         if(this.aaaserverDetails.length == 0){
          this.notifyPopup.error('AAA server is not configured. Please create at least one AAA profile')
        }
         //this.aaaserverDetails = this.dummmyData.result
         this.ssidForm.get('aaa_id').setValidators([
          this.selectOne
        ]);
        this.ssidForm.get('aaa_id').setValue('-1');
       }

     }).catch((error) => {
       this.notifyPopup.logoutpop(commonMessages.InternalserverError);
     });
  }
  showpassword() {
    if (!this.isText) {
      this.isText = true;
    } else {
      this.isText = false;
    }
  }

  ngOnDestroy() {
    this.notifyPopup.hideLoader('');

  }





  ngAfterViewInit() {

    this.ssiddataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
    this.ssidForm.valueChanges.subscribe(() => {
      if (this.editFlag) {
        this.checkAnyUpdate();
      }
    });
    this.ssiddataTable.onPageChange.subscribe((x) => {
      var checkLen = this.elRef.nativeElement.querySelectorAll('.ssid-check').length;
      for (var i = 0; i < checkLen; i++) {
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

  }

  ngAfterViewChecked() {
    this.scrollHelper.doScroll();
  }

  checkAnyUpdate() {
    if (_.isEqual(this.editArray, this.ssidForm.value)) {
      this.btnDisable = true;
    } else {
      this.btnDisable = false;
    }
    this.scrollHelper.scrollToFirst('detailArea');
  }

  loadData() {
    this.notifyPopup.showLoader(commonMessages.SSIDShowData);
    this.coloumsObjects = [
      {name: 'SSID Name', checked: true},
      {name: 'Group', checked: true},
      {name: 'Associated AP', checked: true},
      {name: 'Connected Clients', checked: true},
      {name: 'Security', checked: true}
    ];

    //this.spinnerService.show();
    this._service.getWeb('configurations/vap-configurations/', '', '').then(_result => {
      if (_result) {


        // this.showLoaderBoolStatus = true;
        // this.hideLoaderBoolStatus = false;
        // setTimeout(() => {
        //   if (this.showLoaderBoolStatus) {
        //     this.hideLoaderBoolStatus = true;
        //     this.notifyPopup.showLoader(commonMessages.SSIDShowData);

        //   }
        // }, 1000);
        this.data = _result['result'];
        this.showLoaderBoolStatus = false;
         setTimeout(() => {
          if (this.data)
          this.notifyPopup.hideLoader('');
        }, 1000);

        //this.spinnerService.hide();
      }else{

        this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.serverError);
      }

    }).catch((error) => {
     // console.log(error);
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
     this._service.getWeb('configurations/dhcp-configurations/', '', '').then(data => {
      if (data) {
        this.vlanArr = [];
        for(let i of data.result){
          this.vlanArr.push(i.vlan_id);
        }


      }else{

        this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.serverError);
      }

    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });

    this.resetVal();
  }
  onMacAclChange(value){
    if(value == '1'){
      this.getMacAclDetails();

      this.ssidForm.get('mac_acl_id').setValidators([
        this.selectOne
      ]);
      if(!this.editFlag || this.ssidForm.get('mac_acl_id').value == '00000000-0000-0000-0000-000000000000'){
        this.ssidForm.get('mac_acl_id').setValue('-1');
      }
      
    }else{
      
      this.ssidForm.get('mac_acl_id').clearValidators();
      this.ssidForm.get('mac_acl_id').setValue(null);
    }
  }
  getMacAclDetails(){
    this._service.getWeb('configurations/mac-acl-group/?from=ssid', '', '').then(data => {
      if (data) {
        if( data.result.length == 0){
          this.notifyPopup.error('MAC ACL Profile is not configured. Please create at least one profile')
        }else{
          this.macAclArr = [];
          for(let i of data.result){
            let macdet = {
              "mac_acl_profile_id": i.mac_acl_profile_id,
              "mac_acl_profile_name": i.mac_acl_profile_name,
            }
            this.macAclArr.push(macdet);
            
          }
        }
       


      }else{

        this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.serverError);
      }

    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  public timeOut;

  onSubmit() {
    if (this.checkIsSssidExists()) {
      this.ssidForm.get('broadcastssid').setValue(this.ssidForm.get('broadcastssid').value ? 1 : 0);
      this.ssidForm.get('vap_enable').setValue(this.ssidForm.get('vap_enable').value ? 1 : 0);
      this.ssidForm.get('l3_roaming').setValue(this.ssidForm.get('l3_roaming').value ? 1 : 0);
      this.ssidForm.get('is_l2_roaming_enabled').setValue(this.ssidForm.get('is_l2_roaming_enabled').value ? 1 : 0);
      this.ssidForm.get('band_steering').setValue(this.ssidForm.get('band_steering').value ? 1 : 0);
      this.ssidForm.get('authtype').setValue(parseInt(this.ssidForm.get('authtype').value));
      this.ssidForm.get('rssi_threshold').setValue(parseInt(this.ssidForm.get('rssi_threshold').value));
      this.ssidForm.get('is_wmm_enabled').setValue(this.ssidForm.get('is_wmm_enabled').value ? 1 : 0);
      this.ssidForm.get('is_wmm_power_save_enabled').setValue(this.ssidForm.get('is_wmm_power_save_enabled').value ? 1 : 0);
      this.ssidForm.get('is_pmf_enabled').setValue(this.ssidForm.get('is_pmf_enabled').value ? 1 : 0);
      this.ssidForm.get('mac_acl_policy').setValue(this.ssidForm.get('mac_acl_policy').value ? 1 : 2);

      this.notifyPopup.showLoader(commonMessages.addSSID);
      if(this.ssidForm.get('authtype').value != '5' || this.ssidForm.get('authtype').value != 5){
          this.ssidForm.get('aaa_type').setValue(null);
          this.ssidForm.get('aaa_id').setValue(null);
      }else{
        this.ssidForm.get('aaa_type').setValue(parseInt(this.ssidForm.get('aaa_type').value));
        this.ssidForm.get('aaa_id').setValue(this.aaaserverDetails[this.ssidForm.get('aaa_id').value].aaa_id);
      }
      this.ssidForm.value.rssi_threshold = -this.ssidForm.value.rssi_threshold;
      this._service.postJson('configurations/vap-configurations/', this.ssidForm.value).then(_result => {
        if (_result.status == 1) {
          //this.notifyPopup.hideLoader('');
          this.notifyPopup.success(commonMessages.ssid_save_success);
          this.loadData();
          this.formReset();
        } else {
         // this.notifyPopup.hideLoader('');

          if(_result.msg.ssid){
            this.notifyPopup.error(_result.msg.ssid["0"]);
          }else{
          this.notifyPopup.error(commonMessages.ssid_failed);
          //this.loadData();
          setTimeout(() => {
            this.formReset();
          }, 3000);
         
          }

        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    }
  }


  formReset() {
    this.loadData();
    this.generateForm();
    this.addFlag = false;
    this.editFlag = false;
    this.resetVal();
    this.isChecked = false;
    this.unchekAll();
    this.selectedVapArray = [];
    this.updateMobility(this.ssidForm.get('is_l2_roaming_enabled').value);
    clearTimeout(this.timeOut);
  }

  unchekAll() {
    var chkLen = this.elRef.nativeElement.querySelectorAll('.ssid-check').length;
    for (var i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.ssid-check')[i]['checked'] = false;
    }
  }

  addSSID() {
    this.addFlag = true;
    this.scrollHelper.scrollToFirst("detailArea");
    this.selectedAuthType(2);
   // console.log(this.vlanArr[0]);
    this.ssidForm.get('vlan_id').setValue(this.vlanArr[0]);
  }

  selectColoums(event, index) {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.checked == false)
      this.count = this.count + 1;
    else {
      this.count = this.count - 1;
    }
    if (this.count <= 3) {
      this.coloumsObjects[index].checked = event.target.checked;
    } else
      this.coloumsObjects[index].checked = true;

  }

  holdPopup(event) {
    event.stopPropagation();
  }

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }

  double_click_event(event, vap, index) {
    this.formReset();
    //this.selectedVapArray = [];
    this.clickactive = -1;
    //this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    var chkLen = this.elRef.nativeElement.querySelectorAll('.ssid-check').length;
    for (var i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.ssid-check')[i]['checked'] = false;
    }

    this.selectedVapArray.push(vap);
    if (this.selectedVapArray.length == 1) {
      this.selectedVap = vap.vap_id;
      this.clickactive = index;
      this.elRef.nativeElement.querySelectorAll('.ssid-check')[index]['checked'] = true;
      this.isChecked = true;

    } else {
      this.selectedVap = null;
    }
    this.editSSID();
  }

  public isChecked = false;

  checkboxClick(e, vap) {
    e.stopPropagation();
    // this.formReset();
    if (e.target.checked) {
      this.selectedVapArray.push(vap);
      if (this.selectedVapArray.length == 1) {
        this.selectedVap = vap.vap_id;
      } else {
        this.selectedVap = null;
      }
      this.isChecked = true;
    } else {

      this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
      this.selectedVap = null;
      let currentVap = this.selectedVapArray.find(function (arr) {
        return arr.vap_id == vap.vap_id;
      });
      let idx = this.selectedVapArray.indexOf(currentVap);
      this.selectedVapArray.splice(idx, 1);
      if (this.selectedVapArray.length == 1) {
        this.selectedVap = this.selectedVapArray[0].vap_id;
      } else {
        this.selectedVap = null;
        if (this.selectedVapArray.length < 1) {
          this.selectAllFlag = false;
          this.selectedVapArray = [];
          this.isChecked = false;
        }
      }

    }
  }

  selectAllSSID(e) {
    this.selectedVapArray = [];
    if (e.target.checked) {
      this.selectAllFlag = true;
      for (let vap of this.data) {
        if (!vap.default) {
          this.selectedVapArray.push(vap);
        }
      }
      this.isChecked = true;
    } else {
      this.unchekAll();
      this.selectAllFlag = false;
      this.selectedVapArray = [];
      this.isChecked = false;
    }
  }

  public auth_type_copy;
  public passphrase_copy;
  public editArray;

  editSSID() {
    ///console.log(this.selectedVapArray);
    let t =this;
    if (Object.keys(this.selectedVapArray).length == 1) {
      this._service.getWeb('configurations/vap-configurations/' + this.selectedVap + '/', '', '').then(data => {
        if (data.status == 1) {
          let res = data.result;
          this.vapID = data.result.vapid;
          delete res.vapid;
          res.broadcastssid = data.result.broadcastssid == 1 ? true : false;
          res.vap_enable = data.result.vap_enable == 1 ? true : false;
          res.l3_roaming = data.result.l3_roaming == 1 ? true : false;
          res.is_l2_roaming_enabled = data.result.is_l2_roaming_enabled == 1 ? true : false;
          res.band_steering = data.result.band_steering == 1 ? true : false;
          res.authtype = data.result.authtype.toString();
          res.vlan_id = data.result.vlan_id.toString();
          res.mac_acl_type = data.result.mac_acl_type.toString();
          res.rssi_threshold = data.result.rssi_threshold.toString();
          res.rssi_threshold = res.rssi_threshold.replace("-", "");
          res.is_wmm_enabled = data.result.is_wmm_enabled == 1 ? true : false;
          res.is_wmm_power_save_enabled = data.result.is_wmm_power_save_enabled == 1 ? true : false;
          res.mac_acl_policy = data.result.mac_acl_policy == 1 ? true : false;
         // res.is_wmm_enabled = data.result.is_wmm_enabled == 1 ? true : false;
          res.is_pmf_enabled = data.result.is_pmf_enabled == 1 ? true : false;
          this.onMacAclChange(res.mac_acl_type);
          this.updateMobility(res.is_l2_roaming_enabled);
          if(res.authtype == '5' || res.authtype == 5){
            //this.getaaaDetails();

            this._service.getWeb('utils/aaa-server-list/?server_type=2', '', '').then(_result => {
              if (_result) {
                this.aaaserverDetails = _result.result;


                let searchArray = this.aaaserverDetails.find(function (searchArray) {
                  return searchArray.aaa_id === res.aaa_id;
                });
                res.aaa_id = this.aaaserverDetails.indexOf(searchArray);
                this.ssidForm.get('aaa_id').setValidators([
                 this.selectOne
               ]);
               this.ssidForm.get('aaa_type').setValue('2');
               this.ssidForm.get('aaa_id').setValue(res.aaa_id);
              }

            }).catch((error) => {
              this.notifyPopup.logoutpop(commonMessages.InternalserverError);
            });


          }



          //res.rssi_threshold = data.result.rssi_threshold.toString();

          this.editArray = res;
          //console.log(this.editArray)

          this.ssidForm.setValue(res);
          if (res.authtype == 0 || res.authtype == '0' || res.authtype == '5' || res.authtype == 5) {
            this.ssidForm.get('passphrase').clearValidators();
            // this.ssidForm.get('passphrase').setValue(null);
          } else {
            this.ssidForm.get('passphrase').setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(63), this.noSpaceatStart, this.noEmoji]);
          }
          this.auth_type_copy = res.authtype;
          this.passphrase_copy = res.passphrase;
          this.checkAnyUpdate();
          this.editFlag = true;
        } else {
          this.notifyPopup.hideLoader('');
          this.notifyPopup.error(commonMessages.serverError);
        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });

    } else {
      //this.errorMsg = 'Please select One SSID for Edit';
      //this.showModal();
      this.notifyPopup.error(commonMessages.selectonessid_edit);
      return false;
    }
    this.ssidForm.valueChanges.subscribe(() => {
      this.checkAnyUpdate();

    });


  }

  deleteData() {

    this.groupdetailArr = [];
    if (this.selectedVapArray.length > 0) {
      //console.log(this.selectedVapArray);
      for (let vaps of this.selectedVapArray) {

        if (vaps.default == true) {
          this.notifyPopup.error(commonMessages.default_ssid_error);
          return false;
        }
      }
      //  if(this.groupdetailArr.length>0){
      //   this.notifyPopup.error_details(commonMessages.mapped_ssid_error);
      //  return false;
      // }
      this.notifyPopup.info(commonMessages.confirm_delete_SSID);
    } else {
      this.notifyPopup.error(commonMessages.selectonessid);
    }

  }

  deleteSSID() {
    this.notifyPopup.hideLoader('');
    this.notifyPopup.showLoader(commonMessages.delete_SSID);
    this.groupdetailArr = [];
    if (this.selectedVapArray.length > 0) {
      let del_array = '';
      for (let vap of this.selectedVapArray) {
        del_array = del_array + ',' + vap.vap_id;
      }
      // remove starting commas and appends as query params
      del_array = del_array.replace(/^,/, '');
      let randomidArray = [];
      this._service.deleteWeb('configurations/delete/?ssid=' + del_array, '').then(_data => {
        if (_data.status == 1) {
          if (this.selectedVapArray.length != _data.random_id.length) {
            for (let vaps of _data.affected_groups) {
              let groupArr = [];
              for (let i of vaps.group) {
                let str = {'groupname': i};
                groupArr.push(str);
              }
              let str = {'ssidname': vaps.vap, 'groups': groupArr};
              this.groupdetailArr.push(str);
            }
            this.notifyPopup.hideLoader('');
            this.notifyPopup.error_details(commonMessages.mapped_ssid_error);
            return false;
          } else {
            this.notifyPopup.hideLoader('');
            this.notifyPopup.success(commonMessages.ssid_delete_success);
            setTimeout(() => {
              this.formReset();
              this.loadData();

            }, 1000);
          }

        } else {
          this.notifyPopup.error(commonMessages.ssid_failed_delete);
          this.formReset();
          this.loadData();
        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    } else {
      // this.notifyPopup.error(commonMessages.selectonessid);
      // return false;
    }

  }

  search(event) {
    let val = event.target.value;
    if (val.length > 2) {
      this._service.getWeb('configurations/vap-configurations/?name=' + val + '', '', '').then(_data => {
        if (_data) {
          if (_data.result.length != 0) {
            this.data = _data.result;
          } else {
            this.data = '';

          }
        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    } else if (val.length == 0) {
      this.loadData();
    }

  }

  updateSSID() {
    if (this.checkIsSssidExists()) {
      let newJson = {};
      for (let key in this.ssidForm.value) {
        if (this.ssidForm.value[key] != this.editArray[key]) {
          if (key == 'rssi_threshold' || key == 'authtype') {
            this.ssidForm.value[key] = parseInt(this.ssidForm.value[key]);
            if(key == 'rssi_threshold'){
              this.ssidForm.value[key] = -parseInt(this.ssidForm.value[key]);
            }
          }
          if (key == 'l3_roaming' || key == 'is_l2_roaming_enabled' || key == 'broadcastssid' || key == 'vap_enable' || key == 'band_steering' || key == 'is_wmm_enabled' || key == 'is_wmm_power_save_enabled' || key == 'is_pmf_enabled') {
            this.ssidForm.value[key] = this.ssidForm.value[key] == true ? 1 : 0;
          }
          if (key == 'mac_acl_policy') {
            this.ssidForm.value[key] = this.ssidForm.value[key] == true ? 1 : 2;
          }
          if(key == 'aaa_id'){
            if(this.ssidForm.value[key] == null ){
              this.ssidForm.value[key] = null
            }else{
              this.ssidForm.value[key] = this.aaaserverDetails[this.ssidForm.value[key]].aaa_id;
            }

          }
          if(key == 'mac_acl_id' || key == 'mac_acl_type'){
            //Added for this reqiurement [HFCIWLCD-1577]- when select profile_id set policy as required or send default value while updatingmac_acl_id
            if(this.ssidForm.value['mac_acl_policy'] == '1'){
              newJson['mac_acl_id'] = this.ssidForm.value['mac_acl_id'];
              newJson['mac_acl_policy'] = this.ssidForm.value['mac_acl_policy'] == true ? 1 : 2;
            }
            
          }
          console.log(newJson);
          newJson[key] = this.ssidForm.value[key];
        }
      }
      newJson['vapid'] = this.selectedVap;
      this.notifyPopup.showLoader(commonMessages.updateSSID);
      this._service.putJson('configurations/vap-configurations/' + this.selectedVap + '/', newJson).then(_result => {
        if (_result.status == 1) {
         this.notifyPopup.success(commonMessages.ssid_update_success);
         this.notifyPopup.hideLoader('');
         this.formReset();
         this.loadData();
        } else {
          this.notifyPopup.error(commonMessages.ssid_failed_update);
          this.notifyPopup.hideLoader('');
          this.formReset();
          this.loadData();
        }

      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    }
  }

  resetVal() {
    // this.selectedVapArray=[];
    this.selectedVap = null;
    this.isText = false;
    this.count = 0;
    this.selectAllFlag = false;
    this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    this.addFlag = false;
    this.editFlag = false;
    this.btnDisable = false;
    this.vapID = '';
    this.isDuplicate = false;
    this.successFlag = false;
  }

  duplicateSSIDD(vapid) {
    this.isDuplicate = true;
    this._service.getWeb('configurations/vap-configurations/' + vapid + '/', '', '').then(data => {
      delete data.result.vapid;
      data.result.ssid = data.result.ssid + '_copy';
      data.result.rssi_threshold = data.result.rssi_threshold.toString().replace("-", "");
      this.ssidForm.setValue(data.result);
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  checkIsSssidExists() {
    let t = this;
    let searchArray = this.data.find(function (searchArray) {
      return searchArray.ssid === t.ssidForm.get('ssid').value;
    });
    let searchID = this.data.find(function (searchID) {
      return searchID.vap_id === t.vapID;
    });

    if (searchArray && !searchID) {
      // this.errorMsg = 'SSID name already exists';
      // this.showModal();
      this.notifyPopup.error(commonMessages.ssid_name_exists);
      return false;
    } else {
      if (searchID && this.editArray.ssid != t.ssidForm.get('ssid').value) {
        let searchArray2 = this.data.find(function (searchArray2) {
          return searchArray2.ssid === t.ssidForm.get('ssid').value;
        });
        if (searchArray2) {
          // this.errorMsg = 'SSID name already exists';
          // this.showModal();
          this.notifyPopup.error(commonMessages.ssid_name_exists);
          return false;
        } else {
          return true;
        }

      } else {
        return true;
      }
    }

  }

  blockChar(event) {//console.log(event.keyCode);
    return (event.ctrlKey || event.altKey
      || (47 < event.keyCode && event.keyCode < 58 && event.shiftKey == false)
      || (95 < event.keyCode && event.keyCode < 106)
      || (event.keyCode == 8) || (event.keyCode == 9) || (event.keyCode == 109) || ((event.keyCode == 189 || event.keyCode == 173) && event.shiftKey == false)
      || (event.keyCode > 34 && event.keyCode < 40)
      || (event.keyCode == 46));

  }
  blockAllChar(event) {
    return (event.ctrlKey || event.altKey
      || (47 < event.keyCode && event.keyCode < 58 && event.shiftKey == false)
      || (95 < event.keyCode && event.keyCode < 106)
      || (event.keyCode == 8) || (event.keyCode == 9)
      || (event.keyCode > 34 && event.keyCode < 40)
      || (event.keyCode == 46));

  }

  showGroupnames() {
    //console.log(this.groupdetailArr);
    this.notifyPopup.details(this.groupdetailArr);
    return false;
  }
  updateMobility(status){
    if(status == true){
      this.ssidForm.get('mobility_domain').setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(65535)
      ]);
    }else{
      this.ssidForm.get('mobility_domain').clearValidators();
      //this.ssidForm.get('mobility_domain').setValue('');
    }
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }

     /* pagination method here*/
   getNext(page){
         this.page = page;
      if(this.page == 1){
        this.firstarrowStatus = true;
        this.lastarrowStatus = false;
      }else if(this.page == this.Math.ceil(this.data.length/this.rowsOnPage))
        {
          this.lastarrowStatus = true;
           this.firstarrowStatus = false;
        }
           else{
            this.firstarrowStatus = false;
             this.lastarrowStatus = false;
           }}
    goToPage(num){
      this.getNext(num);
    }
      /* pagination method here end*/

}
