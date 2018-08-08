import {Component, OnInit, AfterViewInit, TemplateRef, ElementRef, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import {DataService} from '../../../../services/dataService/data.service';
import {DataTable, SortEvent} from 'angular2-datatable';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {NoColonPipe} from '../../../../services/filters/nocolon';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {AlertService} from 'ngx-alerts';
import {commonUrl} from '../../../../../app/services/urls/common-url';
import * as io from 'socket.io-client';
import {NotificationService, commonMessages} from '../../../../services/notificationService/NotificationService';
import {TooltipService} from '../../../../services/tooltip/tooltip.service';
import { ScrollHelper } from '../../../../helpers/scroll-helper/scrollHelper';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'app-registered-ap',
  templateUrl: './registered-ap.component.html',
  styleUrls: ['./registered-ap.component.css']
})
export class RegisteredApComponent implements OnInit, AfterViewInit {
  public ifEdit: boolean = false;
  public data;
  public groups;
  public totalRows;
  public currentPage;
  public btnArray: any = [];
  public finalpostData;
  public filterQuery = '';
  public rowsOnPage = 20;
  public totalPages;
  public dataLength;
  public hasData: boolean = false;
  public errorMsg: string;
  public clickCount = 0;
  private url = commonUrl.dynamicsocket;
  private socket;
  public alertPopUp;
  public deleteSuccessFlag: boolean = false;
  public interval;
  public selectedAPArray: any = [];
  public _sortBy;
  public _sortOrder;
  showLoaderBoolStatus: boolean = true;
  hideLoaderBoolStatus: boolean = false;
  public radioArray_2_4 = [];
  public radioArray_5 = [0,36,40,44,48,52,56,60,64,149,153,157,161,165];
  channel:any;
  channel_1:any;
  channel_2:any;
  channel_3:any;
  channel_5g:any;
  channel_1_5g:any;
  channel_2_5g:any;
  channel_3_5g:any;
  transmit_power:any;
  transmit_power_5g:any;
  tranmit_power_array:any;
  AP_name;any;
  group_Id:any;
  selectIPType:any = '0';
  selectIPType_5g:any = '0';
  radio_2_4:any;
  radio_5:any;
  dataList:any;
  dataList_copy:any;
  wcm_success:boolean = false;
  clickactive:any;
  ap_model_no:any;
  radio_indexArray = [];
  radio_type:any;
  sub_dta_list:any = [];
  tab_name:any = "radio_0";
   private scrollHelper: ScrollHelper = new ScrollHelper();
    focused = false;

    /* pagination declaration variable*/
   page: number = 1;
  Math:any = Math;
  firstarrowStatus:boolean = true;
  lastarrowStatus:boolean = false;
    /*pagination declaration variable end */
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  @ViewChild('mf')
  private dataTable: DataTable;
  private showingto = 1;
  private showingfrom = 0;
  private pageModulus = 0;


  isModalShown: boolean = false;
  coloumsObjects:any = [];
  count:number = 0;
  ap_mac:any;
  button_disabled:boolean = true;
  deleteCheckedStatus : boolean = false;
  btnStatus:any = [];
  constructor(private tooltipService: TooltipService ,
              private http: Http,
              private _service : WebserviceService,
              private elRef: ElementRef,
              private spinnerService: Ng4LoadingSpinnerService,
              private alertService:AlertService,
              private notifyPopup : NotificationService,
              private eleRef:ElementRef) {
   // this.socket = io(this.url);
  }

  ngOnInit(): void {
    for(var i = 0;i<=13;i++){
      this.radioArray_2_4.push(i);
    }
    this.loadData();
    this.notifyPopup.confirmationOk().subscribe((page) => {
      if(page == 'registeredAP' ){
        this.deleteData();
      }
    });
  }


  ngAfterViewChecked(){
    if(!this.focused){
      this.scrollHelper.doScroll();
    }

  }

  loadData(){
    this.coloumsObjects=[
      { name:'AP Name', checked: true},
      { name:'IP Address', checked: true},
      { name:'MAC Address', checked: true},
      { name:'Group Name',  checked: true},
      { name:'No. of Clients',  checked: true},
      { name:'AP Model',  checked: true},
      { name:'Status', checked: true}

    ];

    this.tranmit_power_array = [
      {value: '17'},
      {value: '18'},
      {value: '19'},
      {value: '20'},
      {value: '21'},
      {value: '22'},
      {value: '23'}
    ];
    this.showLoaderBoolStatus = true;
    this.hideLoaderBoolStatus = false;
    setTimeout(() => {
      if (this.showLoaderBoolStatus) {
        this.hideLoaderBoolStatus = true;
        this.notifyPopup.showLoader(commonMessages.registerShowData);

      }

    }, 500);
    // this.spinnerService.show();
    let details;
    this._service.getWeb('configurations/registered-ap/', '', '').then(_data => {
      if (_data.status == 1) {
        this.data = _data.result['Registered_aps'];
        this.showLoaderBoolStatus = false;
        this.hasData = true;
        if (this.hideLoaderBoolStatus)
          this.notifyPopup.hideLoader('');

        // this.spinnerService.hide();
      } else {
        if (this.hideLoaderBoolStatus)
          this.notifyPopup.hideLoader('');
        // this.spinnerService.hide();
        this.notifyPopup.error('Some thing went wrong');
        // this.errorMsg = 'Some thing went wrong';
        // this.showModal();
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }


  ngOnDestroy() {
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
  }

  search(event) {
    // this.data = '';
    let val = event.target.value;
    if (val.length > 2) {
      this._service.getWeb('utils/ap-search/?query=' + val + '', '', '').then(_data => {
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

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }

  deleteAp() {
    this.deleteCheckedStatus = false;
    var chkLen = this.elRef.nativeElement.querySelectorAll('.register-table-check').length;
    for (var j = 0; j < chkLen; j++) {
      if (this.elRef.nativeElement.querySelectorAll('.register-table-check')[j]['checked'] == true) {
        this.deleteCheckedStatus = true;
        break;
      }
    }
    if (this.deleteCheckedStatus) {
      this.notifyPopup.info(commonMessages.confirm_delete_register);
    }

  }

  deleteData() {
    let randomidArray = [];
    let del_Array = [];
    if(this.selectedAPArray.length > 0){
    for (var i= 0;i<this.selectedAPArray.length;i++) {
       // console.log(this.selectedAPArray[i].ap_mac);
         del_Array.push(this.selectedAPArray[i].ap_mac);
    }
    this.notifyPopup.showLoader(commonMessages.delete_AP);
    this._service.deleteWeb('configurations/delete/?ap_mac=' + del_Array, '').then(_data => {
      if (_data.status == 1) {
        this.notifyPopup.hideLoader('');
        this.clickCount = 0;
        this.enableDisableDeletebtn();
        this.notifyPopup.success(commonMessages.regiter_delete_success);
        setTimeout(() => {
          this.loadData();
        }, 1000);
        this.deleteSuccessFlag = true;
        this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
      }else{
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error('Some thing went wrong');
      }
    });
    }
  }


  selectAll(ev, filterdVal) {
    var chkLen = this.elRef.nativeElement.querySelectorAll('.register-table-check').length;
    if (ev.target.checked) {
      //this.clickCount = 0
      for (var i = 0; i < chkLen; i++) {
        this.elRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = true;
        this.clickCount++;
      }
      for (let ap of this.dataTable.data) {
        this.selectedAPArray.push(ap);
        if(this.selectedAPArray.length == 1){
          this.ap_mac = ap.ap_mac;
          this.AP_name = ap.ap_name;
        }
        else{
          this.ap_mac = null;
        }
      }

    } else {
      for (var i = 0; i < chkLen; i++) {
        this.elRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = false;
        this.clickCount--;
      }
      this.selectedAPArray = [];

    }

    //this.enableDisableEdixxxxxxxxxxxxtbtn();
    this.enableDisableDeletebtn();

  }


  enableDisableEditbtn() {
    if (this.selectedAPArray.length == 1) {
      this.elRef.nativeElement.querySelector('#edit-btn').classList.remove('disabled');
    } else {
      this.elRef.nativeElement.querySelector('#edit-btn').classList.add('disabled');
    }
  }

  checkboxClick(ap, event) {

    if (event.target.checked) {
      // this.clickCount++;
      this.selectedAPArray.push(ap);
      if (this.selectedAPArray.length == 1) {
        this.ap_mac = ap.ap_mac;
        this.AP_name = ap.ap_name;
      } else {
        this.ap_mac = null;
      }
    } else {
      //this.clickCount--;
      let currentData = this.selectedAPArray.find(function (arr) {
        return arr.group_id == ap.group_id;
      });
      let idx = this.selectedAPArray.indexOf(currentData);
      this.selectedAPArray.splice(idx, 1);
      if (this.selectedAPArray.length == 1) {
        this.ap_mac = this.selectedAPArray[0].ap_mac;
        this.AP_name = this.selectedAPArray[0].ap_name;
      } else {
        this.ap_mac = null;
      }
    }
    //this.enableDisableEditbtn();
    this.enableDisableDeletebtn();


  }

  double_click_event(event,ap,index){
    this.selectedAPArray = [];
    this.clickactive = -1;
    //this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    var chkLen = this.eleRef.nativeElement.querySelectorAll('.register-table-check').length;
    for (var i = 0; i < chkLen; i++) {
      this.eleRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = false;
    }

    this.selectedAPArray.push(ap);
    if (this.selectedAPArray.length == 1) {
      this.ap_mac = ap.ap_mac;
      this.AP_name = ap.ap_name;
      this.clickactive = index;
      this.eleRef.nativeElement.querySelectorAll('.register-table-check')[index]['checked'] = true;
    } else {
      this.ap_mac = null;
    }
    this.EditAp();
  }

  EditAp(){
    if(this.ap_mac){
      this.radio_indexArray =[];
       this.sub_dta_list = [];
       this.notifyPopup.showLoader(commonMessages.edit_reg_page);
      this._service.getWeb('configurations/update-ap/' + this.ap_mac + '/', '', '').then(
        _data => {
          if (_data.status == 1) {
            this.ifEdit = true;
            // this.setFocus();
           this.notifyPopup.hideLoader("")
            this.dataList_copy = _data.result;
             this.dataList = _data.result;
            this.ap_model_no =  this.dataList.ap_model.length;
             for(var i=0;i< this.ap_model_no ; i++){
               var item = this.dataList['radio_'+i];       
               this.btnStatus.push(false);
                this.radio_indexArray.push(item);
             }

             this.radio_indexArray.forEach((v, i) => {
              const val = (typeof v === 'object') ? Object.assign({}, v) : v;
             
              this.sub_dta_list.push(val);
              // console.log(i+"////"+JSON.stringify(val)+"/////"+ this.sub_dta_list[0].transmit_power+"/////"+this.sub_dta_list[0].channel);
              });          
            this.group_Id = _data.result.group_id;
            this.scrollHelper.scrollTo(document.getElementsByClassName('regApList')[0]);
           
            
          } else {

          }
        }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    }else{
      // this.errorMsg = 'Please select One AP for Edit';
      //  this.showModal();
      this.notifyPopup.error(commonMessages.AP_edit_select);
    }
  }

  resetForm_5g() {
    // this.selectIPType_5g = this.dataList.radio_5.channel;
    // this.transmit_power_5g = this.dataList.radio_5.transmit_power;
    // this.channel_1_5g = this.dataList.radio_5.channel_1;
    // this.channel_2_5g = this.dataList.radio_5.channel_2;
    // this.channel_3_5g = this.dataList.radio_5.channel_3;
    // this.EditAp();
  }


  resetForm() {
             
              this.selectedAPArray =[];
              this.ap_mac = null;
              this.btnStatus = [];
             for(var i=0;i< this.ap_model_no ; i++){
              this.btnStatus.push(false);
             }
              this.scrollHelper.scrollTo(document.getElementsByClassName('apList')[0]);
              this.uncheckAllList();
               setTimeout(() => {
               this.ifEdit = false;
               },500);

  }


  submit_g(){
    var body;
   var len =this.btnStatus.length;
    if(this.btnStatus[0] && this.btnStatus[1] && this.btnStatus[2]){ 
     body = {ap_mac:this.ap_mac,radio_0:{"channel":parseInt(this.radio_indexArray[0].channel),"radio_type":parseInt(this.radio_indexArray[0].radio_type),"transmit_power":parseInt(this.radio_indexArray[0].transmit_power)}
     ,radio_1:{"channel":parseInt(this.radio_indexArray[1].channel),"radio_type":parseInt(this.radio_indexArray[1].radio_type),"transmit_power":parseInt(this.radio_indexArray[1].transmit_power)}
     ,radio_2:{"channel":parseInt(this.radio_indexArray[2].channel),"radio_type":parseInt(this.radio_indexArray[2].radio_type),"transmit_power":parseInt(this.radio_indexArray[2].transmit_power)} ,group_id:this.group_Id}; 
    }
    else if(this.btnStatus[0] && this.btnStatus[1] && !this.btnStatus[2]){
      body = {ap_mac:this.ap_mac,radio_0:{"channel":parseInt(this.radio_indexArray[0].channel),"radio_type":parseInt(this.radio_indexArray[0].radio_type),"transmit_power":parseInt(this.radio_indexArray[0].transmit_power)}
     ,radio_1:{"channel":parseInt(this.radio_indexArray[1].channel),"radio_type":parseInt(this.radio_indexArray[1].radio_type),"transmit_power":parseInt(this.radio_indexArray[1].transmit_power)}
    ,group_id:this.group_Id};  
  } 
   else if(this.btnStatus[0] && !this.btnStatus[1] && this.btnStatus[2]){
      body = {ap_mac:this.ap_mac,radio_0:{"channel":parseInt(this.radio_indexArray[0].channel),"radio_type":parseInt(this.radio_indexArray[0].radio_type),"transmit_power":parseInt(this.radio_indexArray[0].transmit_power)}
        ,radio_2:{"channel":parseInt(this.radio_indexArray[2].channel),"radio_type":parseInt(this.radio_indexArray[2].radio_type),"transmit_power":parseInt(this.radio_indexArray[2].transmit_power)} ,group_id:this.group_Id}; 
    
  } 
   else if(!this.btnStatus[0] && this.btnStatus[1] && this.btnStatus[2]){
      body = {ap_mac:this.ap_mac
     ,radio_1:{"channel":parseInt(this.radio_indexArray[1].channel),"radio_type":parseInt(this.radio_indexArray[1].radio_type),"transmit_power":parseInt(this.radio_indexArray[1].transmit_power)}
     ,radio_2:{"channel":parseInt(this.radio_indexArray[2].channel),"radio_type":parseInt(this.radio_indexArray[2].radio_type),"transmit_power":parseInt(this.radio_indexArray[2].transmit_power)} ,group_id:this.group_Id}; 
  } 
   else if(this.btnStatus[0] && !this.btnStatus[1] && !this.btnStatus[2]){
     body = {ap_mac:this.ap_mac,radio_0:{"channel":parseInt(this.radio_indexArray[0].channel),"radio_type":parseInt(this.radio_indexArray[0].radio_type),"transmit_power":parseInt(this.radio_indexArray[0].transmit_power)}
       ,group_id:this.group_Id}; 
  } 
   else if(!this.btnStatus[0] && this.btnStatus[1] && !this.btnStatus[2]){
     body = {ap_mac:this.ap_mac,radio_1:{"channel":parseInt(this.radio_indexArray[1].channel),"radio_type":parseInt(this.radio_indexArray[1].radio_type),"transmit_power":parseInt(this.radio_indexArray[1].transmit_power)}
    ,group_id:this.group_Id}; 
  } 
   else if(!this.btnStatus[0] && !this.btnStatus[1] && this.btnStatus[2]){
     body = {ap_mac:this.ap_mac,radio_2:{"channel":parseInt(this.radio_indexArray[2].channel),"radio_type":parseInt(this.radio_indexArray[2].radio_type),"transmit_power":parseInt(this.radio_indexArray[2].transmit_power)} ,group_id:this.group_Id}; 
    }

    this.notifyPopup.showLoader(commonMessages.AP_updating_msg);
    this._service.putJson('configurations/update-ap/' + this.ap_mac + '/',body).then(
      _data => {
        if (_data.status == 1) {

          this.notifyPopup.hideLoader("");
          setTimeout(() => {
           this.ifEdit = false;
           },500);
          this.selectedAPArray =[];
          this.ap_mac = null;
          this.scrollHelper.scrollTo(document.getElementsByClassName('apList')[0]);
          this.uncheckAllList();
          this.btnStatus = [];
          for(var i=0;i< this.ap_model_no ; i++){
              this.btnStatus.push(false);
             }
          this.notifyPopup.success(commonMessages.AP_update_msg);





          // this.socket.emit('ap_reg', _data);
          // this.socket.on('message', (data) => {
          //   console.log(data+"tttttttttt");

          //   if(data.status== 1){
             
          //   }else{
          //     this.notifyPopup.hideLoader("");
          //     console.log(data.status+"xxxxx"+ this.channel_1+"xxxx"+ this.channel_2+"xxxxx"+ this.channel_3);
          //     this.notifyPopup.error(commonMessages.AP_error_update_msg);
          //   }
          //   this.wcm_success = true;
          // });

          // this.interval = setInterval(() => {
          //   if(!this.wcm_success){
          //     this.notifyPopup.hideLoader('');
          //     //this.spinnerService.hide();
          //     this.notifyPopup.error('WCM not responding');

          //     //this.errorMsg = 'WCM not responding';
          //     //this.showModal();
          //     clearInterval(this.interval)
          //   }
          // }, 15000);

        //  this.notifyPopup.hideLoader("");
        //  this.ifEdit = false;
        //  this.selectedAPArray =[];
        //  this.ap_mac = null;
        //  this.scrollHelper.doScroll();
        //  this.uncheckAllList();
        //  this.notifyPopup.success(commonMessages.AP_update_msg);

        } else {
          this.notifyPopup.hideLoader("");
          this.notifyPopup.error(commonMessages.AP_error_update_msg);
        }
      }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  uncheckAllList(){
    var chkLen = this.elRef.nativeElement.querySelectorAll('.register-table-check').length;

    for (var i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = false;
      this.clickCount++;
    }

  }

  setFocus() {
    this.scrollHelper.scrollToFirst("regApList");
    setTimeout(() => {
      this.focused = true;
      //console.log(2);
    },500);

    //$('#group_name').focus();
  }



  enableDisableDeletebtn() {
    if (this.selectedAPArray.length > 0) {
      this.elRef.nativeElement.querySelector('#delete-btn').classList.remove('disabled');
    } else {
      this.elRef.nativeElement.querySelector('#delete-btn').classList.add('disabled');
    }
  }


  ngAfterViewInit() {
    this.dataTable.onPageChange.subscribe((x) => {
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

    this.dataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });

  }


  clickActiveEvent(tabName, index) {
    var currentAttrValue = tabName;

    // Show/Hide Tabs
    $('.registered-ap-tabs ' + currentAttrValue).show().siblings().hide();

    // Change/remove current tab to active
    $('.registered-ap-tabs .tab-links a').parent('li').eq(index).addClass('active').siblings().removeClass('active');

  }

  change_g(obj, index) {
    this.tab_name ='radio_'+index;
    $('.active_g .tab-links a').parent('li').eq(index).addClass('active').siblings().removeClass('active');
}

  changeBtnStatus(index) {
    if(this.radio_indexArray[index].channel == this.sub_dta_list[index].channel && this.radio_indexArray[index].transmit_power == this.sub_dta_list[index].transmit_power)
    this.btnStatus[index] = false;
    else
    this.btnStatus[index] = true;
  }

  selectColoums(event, index) {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.checked == false)
      this.count = this.count + 1;
    else {
      this.count = this.count - 1;
    }
    if (this.count <= 4) {
      this.coloumsObjects[index].checked = event.target.checked;
    } else
      this.coloumsObjects[index].checked = true;
  }

  holdPopup(event) {
    event.stopPropagation();
  }

// added for the tooltip text implementation //(by abhishek)
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
