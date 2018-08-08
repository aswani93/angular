import { OrderByPipe } from './../../../../services/filters/sort';
import { Component, OnInit, TemplateRef, ElementRef, ViewChild, Renderer ,SimpleChanges } from '@angular/core';
import { Http } from '@angular/http'
import { DataTable, SortEvent } from 'angular2-datatable';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as io from 'socket.io-client';
import { AlertService } from 'ngx-alerts';
import { commonUrl } from '../../../../services/urls/common-url';
import { ScrollHelper } from '../../../../helpers/scroll-helper/scrollHelper';
import { NoHyphenPipe } from '../../../../services/filters/noHyphen';
import { counrtyService } from '../../../../services/countryList/country';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import * as _ from "lodash";
import { NotificationService,commonMessages} from '../../../../services/notificationService/NotificationService';
import { country } from './../../../../services/countryList/country';
import { transform, isEqual, isObject } from "lodash/fp";
import {TooltipService} from '../../../../services/tooltip/tooltip.service';
import 'rxjs/add/operator/catch';
import { Options } from 'ng5-slider';


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
  selector: 'app-group-config',
  templateUrl: './group-config.component.html',
  styleUrls: ['./group-config.component.css']
})
export class GroupConfigComponent implements OnInit {
  differenceObject(targetObj, baseObj) {
    return _transform(iteratee(baseObj), null, targetObj);
  }
  public group_datas;
  public ssidArray;
  public GroupRegForm: FormGroup;
  public ssid_list = [];
  public new_ssid;
  public ssid_name;
  public is_add_ssid = false;
  public del_ssid_list = [];
  public del_ssid_list_flag = [];
  private url = commonUrl.dynamicsocket;
  private socket;
  public add_group = false;
  public selectedGroups = [];
  public selected_grp;
  public show_ssid_list = false;
  public is_update_group = false;
  public isModalShown: boolean = false;
  public errorMsg: string;
  public alertPopUp;
  public isAllGroupSelected: boolean = false;
  private scrollHelper: ScrollHelper = new ScrollHelper();
  public search_key = '';
  public delete_grp_vap_list = []
  public edit_group_id;
  public label = "Add Group"
  public wcm_success = false;
  public interval;
  public _sortBy;
  public _sortOrder;
  public ssidtableShown : boolean = false;
  public ippattern = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;
  public dataCopy;
  public btnDisable;
  private namepattern = /^[-a-zA-Z0-9-()_=,^;:"'~`@./#&+*!%]/;
  coloumsObjects:any = [];
  count:number = 0;
  isDuplicate = false;
  deleteCheckedStatus:boolean = false;
  showLoaderBoolStatus:boolean = true;
  hideLoaderBoolStatus:boolean = false;
  public countryData;
  clickactive:number = -1;
  focused = false;
  public isChecked = false;
  public settings = {};
  public itemList = [];
  selectedItems = [];
  public selectedAllssid:boolean = false;
  public firstTabOk :boolean = false;
  public secondTabOk :boolean = false;

  public clickedOnNext = false;
  public first_2TabOk = false;
  public second_2TabOk = false;

  country_data;
  channel_5 = [];
  selectedWidth = 0;
  selectedChannel = 0;
  selectedChannel2 = 0;

  selectedWidth_2 = 0;
  channel_2 = [];
  channel_width_2 = [];
  channel_width_5 = [];
  ifRadio24Disabled :boolean = true;
  ifRadio5Disabled :boolean = true;
  

  //slider for Channel Utilization
  value: number = 1;
  options: Options = {
    floor: 1,
    ceil: 100,
    translate: (value: number): string => {
      return value+'%';
    }
  };
  //slider for Channel Utilization

  //slider for max client
  clinet_value: number = 1;
  clinet_options: Options = {
    floor: 1,
    ceil: 64
  };

  //slider for max client

  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  @ViewChild('radioGenTab') radioGenTab: ElementRef;
  @ViewChild('radio2Tab') radio2Tab: ElementRef;
  @ViewChild('radio5Tab') radio5Tab: ElementRef;

  constructor(
    private _service: WebserviceService,
    private spinnerService: Ng4LoadingSpinnerService,
    fb: FormBuilder,
    private alertService: AlertService,
    private renderer : Renderer,
    private eleRef : ElementRef,
    private notifyPopup : NotificationService,
    private tooltipService: TooltipService
  ) {
    //this.socket = io(this.url);
  }

  setRadioState(eve,radio){
    if(radio =='24'){
      if(eve.target.checked == true){
        this.ifRadio24Disabled = true;
      }else{
        this.ifRadio24Disabled = false;
      }
    }else{
      if(eve.target.checked == true){
        this.ifRadio5Disabled = true;
      }else{
        this.ifRadio5Disabled = false;
      }
    }
  }
  ngOnInit(): void {
    this.notifyPopup.confirmationOk().subscribe((page) => {
      if(page == 'groupConfiguration'){
        this.deleteGroups();
      }
    });
   
    this.loadCountryData();
    this.notifyPopup.showLoader(commonMessages.groupShowData);
    this.loadData();
    //this.getSsidList('');
    this.countryData = counrtyService.getCountryList();
    //this.scrollHelper.scrollToFirst("inputGroupName");

    this.generateForm();



  }
  generateMultiselect(){
    this.settings = {
      text: "Select SSID",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      enableSearchFilter: true,
      badgeShowLimit: 16
  };
  //console.log(this.ssidArray);
  }
  generateForm(){

    this.GroupRegForm = new FormGroup({
      "group_name": new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern(this.namepattern),
        this.noEmoji

      ]),
      "wag_data_forwarding": new FormControl('1', [
        Validators.required
      ]),
      "country": new FormControl('IN', [
        Validators.required
      ]),
      // "wag_ip_type": new FormControl('1', [
      //   Validators.required
      // ]),
      // "wag_ip": new FormControl('', [
      //   Validators.required,
      //   Validators.pattern(this.ippattern)
      // ]),
      'radio_2_4': new  FormGroup({
        "is_enabled": new FormControl(true,[

        ]),
        "wireless_mode": new FormControl('2',[
        ]),
        "channel": new FormControl(0,[

        ]),
        //"channel_1": new FormControl(1),
        //"channel_2": new FormControl(1),
        //"channel_3": new FormControl(1),
        "channel_width": new FormControl(0),
        // "mcx_data_rate_2":new FormControl('Best'),
        "primary_channel_2": new FormControl('0'),
        "transmit_power":new FormControl('23'),
        // "guardInterval_2": new FormControl('0'),
        "rts_threshold": new FormControl(2347, [
          Validators.required,
          Validators.min(256),
          Validators.max(2347)

        ]),
        "beacon_interval": new FormControl(100, [
          Validators.required,
          Validators.min(100),
          Validators.max(300)

        ]),
        "dtim_interval": new FormControl(3, [
          Validators.required,
          Validators.min(1),
          Validators.max(255)

        ]),
        // "broadcast_rate_2": new FormControl(50, [
        //   Validators.required,
        //   Validators.min(0),
        //   Validators.max(50)

        // ]),
        // "fixed_multicast_rate_2":new FormControl('0'),
        // "a_mpdu_2": new FormControl(true,[]),
        "fragmentation_threshold": new FormControl(2346, [
          Validators.required,
          Validators.min(256),
          Validators.max(2346)

        ]),
        "cts_protection_mode": new FormControl(false,[]),
        "is_channel_util_enabled": new FormControl(false,[]),
        "channel_util": new FormControl(1,[]),
        "max_clients": new FormControl(1,[])
      }),
      'radio_5': new  FormGroup({
        "is_enabled": new FormControl(true,[

        ]),
        "wireless_mode": new FormControl('5',[

        ]),
        "channel": new FormControl('0',[

        ]),
        //"channel_1": new FormControl('36'),
        //"channel_2": new FormControl('36'),
        //"channel_3": new FormControl('36'),
        "channel_width": new FormControl(0),
        // "mcx_data_rate_2":new FormControl('Best'),
        "primary_channel": new FormControl('0'),
        "transmit_power":new FormControl('23'),
        // "guardInterval_2": new FormControl('auto'),
        "rts_threshold": new FormControl(2347, [
          Validators.required,
          Validators.min(256),
          Validators.max(2347)

        ]),
        "beacon_interval": new FormControl(100, [
          Validators.required,
          Validators.min(100),
          Validators.max(300)

        ]),
        "dtim_interval": new FormControl(3, [
          Validators.required,
          Validators.min(1),
          Validators.max(255)

        ]),
        // "broadcast_rate_2": new FormControl(50, [
        //   Validators.required,
        //   Validators.min(0),
        //   Validators.max(50)

        // ]),
        // "fixed_multicast_rate_2":new FormControl('Auto'),
        // "a_mpdu_2": new FormControl(true,[]),
        "fragmentation_threshold": new FormControl(2346, [
          Validators.required,
          Validators.min(256),
          Validators.max(2346)

        ]),
        "cts_protection_mode": new FormControl(false,[]),
        "mimo": new FormControl(true,[]),
        "is_channel_util_enabled": new FormControl(false,[]),
        "channel_util": new FormControl(1,[]),
        "max_clients": new FormControl(1,[])
        
      })
    })
  }

  public noEmoji(control: FormControl){
    let isEmoji = /(?:[\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|(?:\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6]|\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0]))/.test(control.value);
    let isValid = !isEmoji;
    return isValid ? null : { 'emoji': true }
  }
//channel width for 2.4 according to wirelss mode
  generateChannelWidth2(val,from){

    if(val == 0 || val == 1){
      this.channel_width_2 = [20];
    }else if(val == 2){

      this.channel_width_2 = [20,40];
    }
    if(from != 'edit'){
      this.GroupRegForm.get('radio_2_4.channel_width').setValue(0);
      this.generateChannel_2(this.GroupRegForm.get('radio_2_4.channel_width').value,'');
    }

    //console.log(this.GroupRegForm.get('radio_2_4.channel_width').value,'xyyyy');

  }
  //channel width for 5 according to wirelss mode
  generateChannelWidth5(val,from){
    if(val == 3){
      this.channel_width_5 = [20];
    }else if(val == 4 || val == 5){
      this.channel_width_5 = [20,40,80,160];
    }
    if(from != 'edit'){
      this.GroupRegForm.get('radio_5.channel_width').setValue(0);
      this.generateChannel_5(this.GroupRegForm.get('radio_5.channel_width').value,'');
    }
  }

//channel for 2.4  according to channel width
  generateChannel_2(val,radioVal){

    if(!radioVal){
      radioVal = this.GroupRegForm.get('radio_2_4.primary_channel_2').value;
    }
    this.selectedWidth_2 = val;
    if(val == 0){
      this.channel_2 = [1,2,3,4,5,6,7,8,9,10,11];
    }else if(val == 1){

      this.channel_2 = [1,2,3,4,5,6,7];
    }
    if(val == 1 && radioVal == 1){
      this.channel_2 = [5,6,7,8,9,10,11];
    }
    this.setEnableDisable();
  }
  //channel for 5  according to channel width
  generateChannel_5(val,radioVal){
    if(!radioVal){
      radioVal = this.GroupRegForm.get('radio_5.primary_channel').value;
    }
    this.selectedWidth = val;
    // this.selectedChannel = 0;
    if(val == 0){
      this.channel_5 = [36,40,44,48,52,56,60,64,100,104,108,112,116,132,136,140,149,153,157,161,165];

    }else if(val == 1){

      this.channel_5 = [36,44,52,60,100,108,132,149,157];
    }else if(val == 2 || val == 3){
      this.channel_5 = [42,58,106,155];
    }
    if(val == 1 && radioVal == 1){
      this.channel_5 = [40,48,56,64,104,112,136,153,161];
    }
  }


  changeChannelVal(val){
    this.selectedChannel = val;
  }
  changeChannelVal2(val){
    this.selectedChannel2 = val;
  }

  public commonArray : any = [5,6,7];
  setEnableDisable(){
    if(this.commonArray.indexOf(parseInt(this.GroupRegForm.get('radio_2_4.channel').value)) == -1){
      this.GroupRegForm.get('radio_2_4.channel').setValue(0)
    }else{
      this.GroupRegForm.get('radio_2_4.channel').setValue(this.GroupRegForm.get('radio_2_4.channel').value);
    }
  }
  
  lastStepFlag = false;
  checkNgoto(obj){console.log(obj);
    this.secondTabOk = false;
    this.firstTabOk = false;
    this.clickedOnNext = true;
    this.first_2TabOk = false;
    this.second_2TabOk = false;
    if(obj == 1){
      this.firstTabOk = false;
    }
    if(obj == 2){
      this.firstTabOk = true;
    }
    if(obj == 3){
      this.secondTabOk = true;
      this.lastStepFlag = true;
    }
    if(obj == '2_1'){
      this.firstTabOk = true;
      this.first_2TabOk = true;
    }
    if(obj == '2_2'){
      this.firstTabOk = true;
      this.second_2TabOk = true;
    }
    if(obj == '2_3'){
      this.firstTabOk = true;
      this.second_2TabOk = true;
    }



  }
  triggerFalseClick(event) {
    console.log(this.lastStepFlag,'tri');
    if(this.lastStepFlag){
    let el: HTMLElement = this.radioGenTab.nativeElement as HTMLElement;
    let el2: HTMLElement = this.radio2Tab.nativeElement as HTMLElement;
    let el5: HTMLElement = this.radio5Tab.nativeElement as HTMLElement;
    el.classList.add('active');
    el2.classList.remove('active');
    el5.classList.remove('active');
    this.eleRef.nativeElement.querySelector('.radioSecondtab ul > li:first-child').classList.add('active');
    this.eleRef.nativeElement.querySelector('.radioSecondtab ul > li:first-child a').classList.add('active');
    this.eleRef.nativeElement.querySelector('.radioSecondtab ul > li:nth-child(2)').classList.remove('active');
    this.eleRef.nativeElement.querySelector('.radioSecondtab ul > li:nth-child(2) a').classList.remove('active');
    this.eleRef.nativeElement.querySelector('.radioSecondtab ul > li:nth-child(3)').classList.remove('active');
    this.eleRef.nativeElement.querySelector('.radioSecondtab ul > li:nth-child(3) a').classList.remove('active');
    el.click();
  }
}
deactivateGeneral() {
  console.log(this.lastStepFlag,'de');
  if(this.lastStepFlag){
  let el: HTMLElement = this.radioGenTab.nativeElement as HTMLElement;
  el.classList.remove('active');
  this.eleRef.nativeElement.querySelector('.radioSecondtab ul > li:first-child').classList.remove('active');
  this.eleRef.nativeElement.querySelector('.radioSecondtab ul > li:first-child a').classList.remove('active');
  }
  
}
  goToStep(step){

  }

  @ViewChild('mf')
  private dataTable: DataTable;
  @ViewChild('mf2')
  private dataTable1: DataTable;
  ngAfterViewInit() {
    this.dataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
    if(this.ssidtableShown){
      this.dataTable1.onSortChange.subscribe((event: SortEvent) => {
        this._sortBy = event.sortBy;
        this._sortOrder = event.sortOrder;
      });
    }

    this.GroupRegForm.valueChanges.subscribe(() => {
      this.checkAnyUpdate();
    });

  }
  ngAfterViewChecked(){
    //console.log(this.focused);
    if(!this.focused){
      // console.log('scrolled');
      this.scrollHelper.doScroll();
    }

  }


  checkAnyUpdate(){
    if(this.dataCopy){
      let data = this.GroupRegForm.value;
      data.ssids = this.ssid_list;
      data.group_id = this.selected_grp;
      //data.wag_ip_type = parseInt(data.wag_ip_type);
      data.wag_data_forwarding = parseInt(data.wag_data_forwarding);

      if(_.isEqual(this.dataCopy, data)){
        this.btnDisable = true;
        this.delete_grp_vap_list = [];
      }else{
        this.btnDisable = false;
      }
    }
    this.setFocus();
  }

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.isModalShown = false;
  }



  loadData() {
    this.coloumsObjects=[
      { name:'Group Name', checked: true},
      { name:'SSID', checked: true},
      { name:'Associated AP', checked: true},
      { name:'Connected Clients',  checked: true}

    ];

    this.notifyPopup.showLoader(commonMessages.groupShowData);
    this._service.getWeb('configurations/group-configurations/', '', '').then(_result => {
      if (_result) {
        this.group_datas = _result.result;
        this.getSsidList('');
        setTimeout(() => {
          if(this.group_datas!= undefined){
            this.notifyPopup.hideLoader('');
          }
        }, 1000);
       
        
      }else{
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.serverError);
      }

    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  loadCountryData(){
    this._service.getWeb('configurations/country-list/', '', '').then(_data => {
      if (_data.status == 1) {
        this.country_data = _data.results;
      }else{
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.serverError);
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  btnAddGroup() {
    this.add_group = true;
    this.is_update_group = false;
    this.label ="Add Group";
    this.setFocus();
    this.generateChannel_5(0,'');
    this.generateChannel_2(0,'');
    this.generateChannelWidth2(2,'add');
    this.generateChannelWidth5(5,'add');
  }
  focusInterval;
  setFocus() {
    this.scrollHelper.scrollToFirst("inputGroupName");
    this.scrollHelper.scrollToFirst("group-tab");
    this.focusInterval = setTimeout(() => {
      this.focused = true;
      //console.log(2);
    },500);

    //$('#group_name').focus();
  }

  getSsidList(id) {
    let grpidStr = '';
    if (id != '') {
      grpidStr = '?group_id=' + id;
    } else {
      grpidStr = '';
    }
    this._service.getWeb('configurations/ssid-list/' + grpidStr, '', '').then(
      _data => {
        if (_data.status == 1) {
          this.itemList = [];
          this.ssidArray = _data.result;
          for(let i of this.ssidArray){
            let obj = {"id":i.vapid,"itemName":i.ssid};
            this.itemList.push(obj);
          }
        } else {
          this.ssidArray = '';
          this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.serverError);
        }
        console.log(this.itemList)
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
  }

  getEve(e){
    console.log(e)
  }

  getSSID(e) {
    this.new_ssid = e.target.value;
    if (this.new_ssid.length > 0) {
      this.ssid_name = e.target['options']
        [e.target['options'].selectedIndex].text;
      this.is_add_ssid = true;
    } else {
      this.is_add_ssid = false;
    }
  }
  public ssidArr = [];
  addSSIDs(e) {
    if(this.selectedItems.length>0){
      if(!this.ssidtableShown)
        this.ssidtableShown = true;
      let length = this.ssid_list.length + this.selectedItems.length;
      if (length<=16) {
        for(let s of this.selectedItems ){
          this.ssid_list.push(
            { "vapid": s.id, "ssid": s.itemName, "radiotype": 2, "radio_24": true, "radio_5": true }
          )

          let current_ssid = this.ssidArray.find(function (searchArray) { return searchArray.vapid === s.id });
          let idx = this.ssidArray.indexOf(current_ssid);
          this.ssidArray.splice(idx, 1);

        }
        this.ssid_list.sort(function(a, b){
          var nameA =a.ssid.toLowerCase(), nameB=b.ssid.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0 //default return value (no sorting)
        })
        
        this.resetSelection();
        this.checkAnyUpdate();
        //console.log(this.ssidArray);
        //this.ssidArr = [];
        // this.generateMultiselect()
        // this.ssidArr = this.ssidArray;
        // let sid = this.new_ssid;
        // let current_ssid = this.ssidArray.find(function (searchArray) { return searchArray.vapid === sid });
        // let checkdeleteArray = this.delete_grp_vap_list.find(function (searchArray) { return searchArray.vapid === sid });

        // if (current_ssid) {
        //   let idx = this.ssidArray.indexOf(current_ssid)
        //   this.ssidArray.splice(idx, 1);
        //   this.ssidArray.sort();
        // }
        // if (checkdeleteArray) {
        //   let idx = this.delete_grp_vap_list.indexOf(checkdeleteArray)
        //   this.delete_grp_vap_list.splice(idx, 1)
        // }
        // this.is_add_ssid = false;

      } else {

        // this.errorMsg = 'Maxmimu 16 Vap can add with a group';
        // this.showModal();
        this.notifyPopup.error(commonMessages.max_ssid_error);
        this.resetSelection();
      }

    }else{
      this.notifyPopup.error(commonMessages.selectonessid_grp);
      return false;
    }
    if(Object.keys(this.ssid_list).length == Object.keys(this.del_ssid_list).length){
      this.selectedAllssid = true;
    }else{
      this.selectedAllssid = false;
    }
    // console.log(this.ssid_list)
  }
  resetSelection() {
    this.settings = {
      text: "Select SSID",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      enableSearchFilter: true,
      badgeShowLimit: 16
    };
    this.selectedItems = [];
    this.itemList = [];
    const tempArr = this.ssidArray;
    for (let i = 0; i < tempArr.length; ++i) {
      let obj = {"id":tempArr[i].vapid,"itemName":tempArr[i].ssid};
      this.itemList.push(obj);
    }
  }

  changeTwo(vapid, e) {
    let current_ssid = this.ssid_list.find(function (searchArray) { return searchArray.vapid === vapid });
    let radioTwo = e.target.checked;
    current_ssid.radio_24 = radioTwo
    if (current_ssid.radio_24 && current_ssid.radio_5) {
      current_ssid.radiotype = 2;
    } else if (!current_ssid.radio_24 && current_ssid.radio_5) {
      current_ssid.radiotype = 1;
    } else if (current_ssid.radio_24 && !current_ssid.radio_5) {
      current_ssid.radiotype = 0;
    }
    e.target.checked = true;
    this.checkAnyUpdate();
  }

  changeFive(vapid, e) {
    let current_ssid = this.ssid_list.find(function (searchArray) { return searchArray.vapid === vapid });
    let radioFive = e.target.checked;
    current_ssid.radio_5 = radioFive
    if (current_ssid.radio_24 && current_ssid.radio_5) {
      current_ssid.radiotype = 2;
    } else if (!current_ssid.radio_24 && current_ssid.radio_5) {
      current_ssid.radiotype = 1;
    } else if (current_ssid.radio_24 && !current_ssid.radio_5) {
      current_ssid.radiotype = 0;
    }
    this.checkAnyUpdate();
  }
  checkIsAble(state,from){
    if(state == false){
      this.notifyPopup.warn(commonMessages.not_disable_all);
    }
  }
  selectSSID(vap, e) {

    if (e.target.checked) {
      this.del_ssid_list.push(vap);
      this.del_ssid_list_flag.push(vap);

    } else {
      let current_ssid = this.del_ssid_list.find(function (searchArray) { return searchArray.vapid === vap.vapid });
      let idx = this.del_ssid_list.indexOf(current_ssid);
      this.del_ssid_list.splice(idx, 1);
      this.del_ssid_list_flag.splice(idx, 1);

    }

    if(Object.keys(this.ssid_list).length == Object.keys(this.del_ssid_list).length){
      this.selectedAllssid = true;
    }else{
      this.selectedAllssid = false;
    }


  }

  selectAll(e) {
    this.del_ssid_list = [];
    this.del_ssid_list_flag = []
    if (e.target.checked) {
      for (let ssid of this.ssid_list) {
        ssid.is_select = true;
        this.del_ssid_list.push(ssid);
        this.del_ssid_list_flag.push(ssid);
        this.selectedAllssid = true;
      }
    } else {
      this.selectedAllssid = false;
      for (let ssid of this.ssid_list) {
        ssid.is_select = false;
      }
    }

  }
  double_click_event(event,grp,index){
    this.selectedGroups = [];
    this.ssid_list = [];
    this.clickactive = -1;
    //this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    var chkLen = this.eleRef.nativeElement.querySelectorAll('.group-check').length;
    for (var i = 0; i < chkLen; i++) {
      this.eleRef.nativeElement.querySelectorAll('.group-check')[i]['checked'] = false;
    }

    this.selectedGroups.push(grp);
    if (this.selectedGroups.length == 1) {
      this.selected_grp = grp.group_id;
      this.clickactive = index;
      this.eleRef.nativeElement.querySelectorAll('.group-check')[index]['checked'] = true;
      this.isChecked = true;
    } else {
      this.selected_grp = null;
    }
    this.getGroupDetails();
  }

  deleteSSID() {
    console.log(this.del_ssid_list);
    let objLen = Object.keys(this.del_ssid_list).length;
    if(objLen>0){
      if(this.selectedAllssid){
        this.notifyPopup.error(commonMessages.unable_delete_allssid);
        return false;
      }else{
        this.delete_grp_vap_list = [];
        //let objLen = Object.keys(this.del_ssid_list).length;
        for(let i=0;i<objLen;i++){
          this.ssidArray.push(this.del_ssid_list[i]);
          let idx = this.ssid_list.indexOf(this.del_ssid_list[i]);
          this.ssid_list.splice(idx, 1);
          if (this.is_update_group) {
            let del_gcp_map = { "group_id": this.edit_group_id, "vapid": this.del_ssid_list[i].vapid }
            this.delete_grp_vap_list.push(del_gcp_map)
          }
        }
        this.del_ssid_list = [];
        this.resetSelection();
        this.checkAnyUpdate();
      }
    }else{
      this.notifyPopup.error(commonMessages.selectonessid);
    }
  }


  formReset(from) {
    this.GroupRegForm.reset();
    this.generateForm()
    this.clickedOnNext = false;
    this.secondTabOk = false;
    this.firstTabOk = false;
    this.first_2TabOk = false;
    this.second_2TabOk = false;
    this.ssid_list = [];
    this.ssidArray = [];
    this.itemList = [];
    this.add_group = false;
    this.is_update_group = false;
    this.label = "Add Group";
    this.show_ssid_list = false;
    this.isDuplicate = false;
    this.focused = false;
    this.isChecked = false;
    this.selected_grp = null;
    this.resetSelection();
    clearTimeout(this.focusInterval);
    this.focused = false;
    this.del_ssid_list = [];
    this.del_ssid_list_flag = [];
    this.generateChannel_5(0,'');
    this.ifRadio24Disabled = true;
    this.ifRadio5Disabled = true;
    this.generateChannel_2(0,'');
    this.generateChannelWidth2(0,'reset');
    this.generateChannelWidth5(3,'reset');
    this.lastStepFlag = false;
    if(from == 'btn'){
      this.isAllGroupSelected = false;
      this.selectedGroups = [];
      this.eleRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
      this.unCheckAll();
    }


  }
  unCheckAll(){
    var chkLen = this.eleRef.nativeElement.querySelectorAll('.group-check').length;
    for (var i = 0; i < chkLen; i++) {
      this.eleRef.nativeElement.querySelectorAll('.group-check')[i]['checked'] = false;
    }
  }


  onSubmit() {
  if(this.group_datas.length<10){
    if (this.ssid_list.length > 0) {
      let data = this.GroupRegForm.value;
      data.wag_data_forwarding = parseInt(data.wag_data_forwarding);
      data.radio_2_4.primary_channel = data.radio_2_4.primary_channel_2;
      data.ssids = this.ssid_list
      let is_grp_exist = this.group_datas.find(function (searchArray) { return searchArray.group_name === data.group_name });
      if (is_grp_exist === undefined) {
        this.notifyPopup.showLoader(commonMessages.addGroup);
        this._service.postJson('configurations/group-configurations/', data).then(_result => {
          if (_result.status == 1) {
            this.notifyPopup.success(commonMessages.grp_save_success);
            //alert(commonMessages.grp_save_success);
            this.formReset('');
            this.loadData();
            this.getSsidList('');
            this.add_group = false;
            this.wcm_success = true;
          } else {
            this.notifyPopup.error(commonMessages.grp_save_failed);
            this.formReset('');
          //  this.loadData();
            //this.getSsidList('');
            this.add_group = false;
            this.wcm_success = true;
          }
        }).catch((error) => {
          this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        });
      }
      else {
        // this.errorMsg = 'Group Name Already Exists';
        // this.showModal();
        this.notifyPopup.error(commonMessages.group_name_exists);
      }

    } else {
      //this.errorMsg = 'minimum one ssid required to create a group';
      //this.showModal();
      this.notifyPopup.error(commonMessages.selectonessid_group);
    }
  }else{
    this.notifyPopup.error('Maximum group exceeded');
    this.formReset('');
  }

  }


  // select group get all selected groups to array, for edit save one group_id
  // one more group_id select, edit variable set to null
  selectGroup(grp, e) {
    this.formReset('')
    if (e.target.checked) {
      //this.eleRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
      this.selectedGroups.push(grp);
      if (this.selectedGroups.length == 1) {
        this.selected_grp = grp.group_id
      } else {
        this.selected_grp = null;
      }
      this.isChecked = true;
    } else {

      let currentGrp = this.selectedGroups.find(function (arr) { return arr.group_id == grp.group_id })
      let idx = this.selectedGroups.indexOf(currentGrp);
      this.selectedGroups.splice(idx, 1);
      if (this.selectedGroups.length == 1) {
        this.selected_grp = this.selectedGroups[0].group_id;
        this.isChecked = true;
      } else {
        this.selected_grp = null;
        if(this.selectedGroups.length<1){
          this.isAllGroupSelected = false;
          this.selectedGroups = [];
          this.isChecked = false;
          this.formReset('');
        }else{
          this.isChecked = true;
        }
      }
    }
  }

  //select all group except default one
  selectAllGroup(e) {
    this.selectedGroups = [];
    if (e.target.checked) {
      this.isAllGroupSelected = true;
      for (let grp of this.group_datas) {
        if (!grp.default) {
          this.selectedGroups.push(grp);
        }
      }
      //console.log(this.selectedGroups);
      if(this.selectedGroups.length == 1){
        this.selected_grp = this.selectedGroups[0].group_id;
      }else{
        this.selected_grp = null;
      }
      this.isChecked = true;
      //if(this.selectedGroups.length)
    } else {
      this.unCheckAll();
      this.isAllGroupSelected = false;
      this.selectedGroups = [];
      this.isChecked = false;
      this.formReset('');
    }
    //console.log(this.selectedGroups);
  }

  copyFromGroup(group_id){
    this._service.getWeb('configurations/group-configurations/' + group_id + '/', '', '').then(
      _data => {

        if (_data.status == 1) {

          //this.GroupRegForm.get('wag_ip').setValue(_data.result.wag_ip);
          //this.GroupRegForm.get('wag_ip_type').setValue(_data.result.wag_ip_type.toString());
          //this.GroupRegForm.get('wag_data_forwarding').setValue(_data.result.wag_data_forwarding);
          this.getSsidList(group_id)
          this.ssid_list = _data.result.ssids
          let res = _data.result;
          delete res.group_id;
          delete res.ssids;
          this.GroupRegForm.setValue(res);
          this.GroupRegForm.get('group_name').setValue(_data.result.group_name+'_copy');
          this.generateChannel_5(this.GroupRegForm.get('radio_5')['controls']["channel_width"].value,this.GroupRegForm.get('radio_5')['controls']["primary_channel"].value);
          this.selectedChannel = this.GroupRegForm.get('radio_5')['controls']["channel"].value;
          this.generateChannel_2(this.GroupRegForm.get('radio_2_4')['controls']["channel_width"].value,this.GroupRegForm.get('radio_2_4')['controls']["primary_channel_2"].value);
          this.selectedChannel2 = this.GroupRegForm.get('radio_2_4')['controls']["channel"].value
          // for(let sid of this.ssid_list){
          //   sid.radiotype = sid.radio_type
          // }
          this.isDuplicate = true;
        } else {
          this.ssidArray = '';
          this.notifyPopup.hideLoader('');
          this.notifyPopup.error(commonMessages.serverError);
        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
  }

  // get details of selected group
  editgroupSsids = [];
  getGroupDetails() {
    this.ssid_list = [];
    //this.formReset();

    if (this.selectedGroups.length == 1) {
      //this.scrollHelper.scrollToFirst("inputGroupName");
      this._service.getWeb('configurations/group-configurations/' + this.selected_grp + '/', '', '').then(
        _data => {
          if (_data.status == 1) {
            console.log(_data.result,'res');
            this.dataCopy=JSON.parse(JSON.stringify(_data.result));
            this.dataCopy.ssids.sort(function(a, b){
              var nameA =a.ssid.toLowerCase(), nameB=b.ssid.toLowerCase()
              if (nameA < nameB) //sort string ascending
                return -1
              if (nameA > nameB)
                return 1
              return 0 //default return value (no sorting)
            })

            //this.GroupRegForm.get('group_name').setValue(_data.result.group_name);
            //this.GroupRegForm.get('wag_ip').setValue(_data.result.wag_ip);
            //this.GroupRegForm.get('wag_ip_type').setValue(_data.result.wag_ip_type.toString());
            //this.GroupRegForm.get('wag_data_forwarding').setValue(_data.result.wag_data_forwarding);

            this.edit_group_id = _data.result.group_id;
            this.getSsidList(this.edit_group_id);
            for(let o of  _data.result.ssids){
              this.ssid_list.push(o);
            }
            //   this.ssid_list.sort(function(a, b){
            //     var nameA =a.ssid.toLowerCase(), nameB=b.ssid.toLowerCase()
            //     if (nameA < nameB) //sort string ascending
            //         return -1
            //     if (nameA > nameB)
            //         return 1
            //     return 0 //default return value (no sorting)
            // })

            //this.ssid_list = _data.result.ssids;
            this.is_update_group = true;
            this.label = _data.result.group_name;
            this.add_group = false;
            let res = _data.result;
            delete res.group_id;
            delete res.ssids;
            this.GroupRegForm.setValue(res);
            this.generateChannel_5(this.GroupRegForm.get('radio_5.channel_width').value,this.GroupRegForm.get('radio_5.primary_channel').value);

            // this.selectedChannel = this.GroupRegForm.get('radio_5')['controls']["channel"].value;
            this.generateChannel_2(this.GroupRegForm.get('radio_2_4.channel_width').value,this.GroupRegForm.get('radio_2_4')['controls']["primary_channel_2"].value);

            ///this.selectedChannel2 = this.GroupRegForm.get('radio_2_4')['controls']["channel"].value;
            this.isChecked = true;

            this.generateChannelWidth2(this.GroupRegForm.get('radio_2_4.wireless_mode').value,'edit');
            this.generateChannelWidth5(this.GroupRegForm.get('radio_5.wireless_mode').value,'edit');
            this.GroupRegForm.setValue(res);
            //this.scrollHelper.scrollToFirst("inputGroupName");
            this.checkAnyUpdate();
            this.setFocus();
          } else {
            this.ssidArray = '';
            this.notifyPopup.hideLoader('');
            this.notifyPopup.error(commonMessages.serverError);
          }
        }).catch((error) => {
          this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        });
    } else {
      this.notifyPopup.error(commonMessages.selectonegroup_edit);
    }
    this.GroupRegForm.valueChanges.subscribe(() => {
      this.checkAnyUpdate();
    });
  }


  clickSSIDTab() {
    this.generateMultiselect();
    if(this.selected_grp){
      this.getSsidList(this.selected_grp);
    }else{
      this.getSsidList('');
    }
    this.show_ssid_list = true;
    if(this.is_update_group){
      this.ssidtableShown = true;
    }

  }

  hideSSIDList() {
    this.show_ssid_list = false;
  }


  updateGroupInfo() {

    if (this.ssid_list.length > 0) {
      let data = this.GroupRegForm.value;
      let newJson = {"ssids":''};
     // console.log(data.radio_2_4.primary_channel_2);
      if(data.radio_2_4.primary_channel_2){
        data.radio_2_4.primary_channel = data.radio_2_4.primary_channel_2
      }
      delete data.radio_2_4.primary_channel;
      newJson = differenceObject(data,this.dataCopy);
      newJson['group_id'] = this.selected_grp;
      data.ssids = this.ssid_list;
      delete newJson.ssids;
      newJson.ssids = data.ssids;
     
      let is_grp_exist = this.group_datas.find(function (searchArray) { return searchArray.group_name === data.group_name });
      if(is_grp_exist === undefined || is_grp_exist.group_id == this.selected_grp){
        this.notifyPopup.showLoader(commonMessages.updateGroup);

        this._service.putJson('configurations/group-configurations/' + this.selected_grp + '/', newJson).then(_result => {
          
          if (this.delete_grp_vap_list.length > 0) {
            this._service.postJson('configurations/delete-grp-vap/', this.delete_grp_vap_list).then((sucess) => {
              if (sucess.status == 0) {
                this.notifyPopup.hideLoader('');
                this.notifyPopup.success(commonMessages.grp_update_failure);
                return false;
              }
            });
          }
          this.selected_grp = null;
          this.is_update_group = false;
          this.selected_grp = null;
          this.selectedGroups = []
          this.delete_grp_vap_list = [];
          if (_result.status == 1) {
              this.notifyPopup.hideLoader('');
              this.notifyPopup.success(commonMessages.grp_update_success);
              setTimeout(() => {
              this.loadData();
              }, 500);
            
          } else {
              this.notifyPopup.hideLoader('');
              this.notifyPopup.success(commonMessages.grp_update_failure);
              setTimeout(() => {
              this.loadData();
              }, 500);
          }
        });
      }else {
        // this.errorMsg = 'Group Name already exists..';
        // this.showModal();
        this.notifyPopup.error(commonMessages.group_name_exists);
        this.staticTabs.tabs[0].select;
      }

    } else {
      // this.errorMsg = 'Minimum one SSID map required';
      // this.showModal();
      this.notifyPopup.error(commonMessages.min_ssid_group_error);
    }
  }
  blockChar(event){
    let keyEveFlag = event.ctrlKey || event.altKey
      || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false)
      || (95<event.keyCode && event.keyCode<106)
      || (event.keyCode==8) || (event.keyCode==9) || (event.keyCode==110) || (event.keyCode==190) || (event.keyCode==109)
      || (event.keyCode>34 && event.keyCode<40)
      || (event.keyCode==46);
    let specialKey;
    if(event.keyCode == 109 && event.target.value.length>0){
      specialKey = false;
    }
    if(keyEveFlag == false || specialKey == false){
      return false;
    }else{
      return true;
    }
  }
  deleteData(){
    // this.deleteCheckedStatus = false;
    //  for (let grp of this.selectedGroups) {
    //     if (grp.default === true) {
    //       this.errorMsg = 'Unable to delete default group';
    //       this.showModal();
    //       return false;
    //     } else {
    //        this.deleteCheckedStatus = true;
    //        break;
    //     }
    //   }
    if(this.selectedGroups.length > 0){
      for(let groups of this.selectedGroups){
        if(groups.default == true){
          this.notifyPopup.error(commonMessages.default_group_error);
          return false;
        }
      }
      this.notifyPopup.info(commonMessages.confirm_delete_group);
    }else{
      this.notifyPopup.error(commonMessages.selectonegroup);
    }

  }

  deleteGroups() {
    if (this.selectedGroups.length > 0) {
      let del_array = '';
      for (let grp of this.selectedGroups) {
        if (grp.default === true) {
          //this.errorMsg = 'Unable to delete default group';
          //this.showModal();
          return false;
        } else {
          del_array = del_array + ',' + grp.group_id
        }
      }
      // remove starting commas and appends as query params
      del_array = del_array.replace(/^,/, '');
      this.notifyPopup.showLoader(commonMessages.delete_group)
      this._service.deleteWeb('configurations/delete/?group_id=' + del_array, '').then(_data => {
        if (_data.status == 1) {
          this.notifyPopup.hideLoader('');
          this.notifyPopup.success(commonMessages.grp_delete_success);
          setTimeout(() => {
            this.loadData();
            this.formReset('');
            this.getSsidList('');
            this.selected_grp = null;
            this.selectedGroups = []
            this.wcm_success = true;
          }, 500);
        
        } else {
          this.notifyPopup.hideLoader('');
          this.notifyPopup.error(commonMessages.serverError);
        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    } else {
      this.notifyPopup.error(commonMessages.selectonegroup_edit);
    }
  }

  searchGroup() {
    if (this.search_key.length > 2) {
      this._service.getWeb('configurations/group-configurations/?name=' + this.search_key, '', '').then(_result => {
        if (_result) {
          this.group_datas = _result.result;
        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    } else {
      this._service.getWeb('configurations/group-configurations/', '', '').then(_result => {
        if (_result) {
          this.group_datas = _result.result;
        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    }
  }


  selectColoums(event,index){
    event.stopPropagation();
    event.preventDefault();
    if(event.target.checked == false)
      this.count = this.count + 1;
    else{
      this.count = this.count - 1;
    }
    if(this.count <= 2 ){
      this.coloumsObjects[index].checked = event.target.checked;
    }else
      this.coloumsObjects[index].checked =true;
  }

  holdPopup(event){
    event.stopPropagation();
  }
  radioOptionVal = true;
// added for the tooltip text implementation //(by abhishek)
  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }


}
