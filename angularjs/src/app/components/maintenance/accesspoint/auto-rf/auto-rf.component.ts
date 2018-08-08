import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {DataTable, SortEvent} from 'angular2-datatable';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {commonUrl} from '../../../../../app/services/urls/common-url';
import {NotificationService, commonMessages} from '../../../../services/notificationService/NotificationService';
import { ScrollHelper } from '../../../../helpers/scroll-helper/scrollHelper';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'app-auto-rf',
  templateUrl: './auto-rf.component.html',
  styleUrls: ['./auto-rf.component.css']
})

export class AutoRfComponent implements OnInit, AfterViewInit {
  public ifEdit: boolean = false;
  public data;
  public currentPage;
  public rowsOnPage = 20;
  public dataLength;
  public autoRF_2dot4g: boolean = false;
  public autoRF_5g:boolean =false;
  public showSuccessPopup: boolean = false;
  public rogue2dot4gDisabled = [];
  public autoRF_2dot4g_aps = [];
  public rogue5gDisabled = [];
  public autoRF_5g_aps = [];
  public isDataChanged:boolean = false;
  private url = commonUrl.dynamicsocket;
  private socket;
  public selectedAPArray: any = [];
  public _sortBy;
  public _sortOrder;
  showLoaderBoolStatus: boolean = true;
  hideLoaderBoolStatus: boolean = false;
  AP_name:any;
  public finalJSON: any;
  group_Id:any;
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
  private autoRFTable: DataTable;
  private showingto = 1;
  private showingfrom = 0;
  private pageModulus = 0;
  private autoRefreshTable;
  private autoRefreshTime: Number = 50000;


  coloumsObjects:any = [];
  count:number = 0;
  showUpdatedAPnames = [];
  constructor(private _service : WebserviceService,
              private elRef: ElementRef,
              private notifyPopup : NotificationService,
              private eleRef:ElementRef) {
  }

  ngOnInit(): void {
    this.loadData();
    this.generateJSON();

    this.notifyPopup.showing().subscribe(() =>{
      this.showAutoRFUpdatedAPs();
    })
    
  }

  showAutoRFUpdatedAPs(){

    let autoRFUpdatedAPs = [];

    for(let i=0;i<this.showUpdatedAPnames.length;i++){
      autoRFUpdatedAPs.push({
        ap_mac_name: this.showUpdatedAPnames[i],
        ap_macs_2dot4g: this.autoRF_2dot4g_aps[i],
        ap_macs_5g: this.autoRF_5g_aps[i]
      });
    }

    this.notifyPopup.autorf_success_details(autoRFUpdatedAPs);
  }

  ngAfterViewChecked(){
    
    if(!this.focused){
      this.scrollHelper.doScroll();
    }

  }

  generateJSON(){
    this.finalJSON = {
      ap_macs_2dot4g : [],
      ap_macs_5g: [],
      autoRF_2dot4g: false,
      autoRF_5g: false
    }
  }


  loadData(){
    this.coloumsObjects=[
      { name:'AP Name', checked: true},
      { name:'Location', checked: true},
      { name:'IP Address', checked: true},
      { name:'MAC Address', checked: true},
      { name:'Group Name',  checked: false},
      { name:'No. of Clients',  checked: true},
      { name:'AP Model',  checked: false},
      { name:'Status', checked: true}

    ];

    
    this.fetchDataFromServer();  
    this.autoRefreshTable = setInterval(() => this.fetchDataFromServer(), this.autoRefreshTime);
  }

  fetchDataFromServer() { 

    this.showLoaderBoolStatus = true;
    this.hideLoaderBoolStatus = false;

    setTimeout(() => {
      if (this.showLoaderBoolStatus) {
        this.hideLoaderBoolStatus = true;
        this.notifyPopup.showLoader(commonMessages.autoRFShowData);

      }
    }, 500);

    this._service.getWeb('maintenance/auto-rf-ap-list/', '', '').then(_data => {

    if (_data.status == 1) {
      this.data = _data.result['Registered_aps'];
      this.showLoaderBoolStatus = false;
      
      if (this.hideLoaderBoolStatus)
        this.notifyPopup.hideLoader('');

      this.rogue2dot4gDisabled = [];
      this.rogue5gDisabled = [];
      for (let ap in this.data){
        if(this.data[ap].is_rogue_ap_2dot4_enabled != 1){
          this.rogue2dot4gDisabled.push(this.data[ap].ap_mac);
        }
        if(this.data[ap].is_rogue_ap_5_enabled != 1){
          this.rogue5gDisabled.push(this.data[ap].ap_mac);
        }
      }

      if(this.showSuccessPopup){
        this.notifyPopup.success_details(commonMessages.autoRFUpdate);
        this.showSuccessPopup = false;
      }
      
    } else {
      if (this.hideLoaderBoolStatus)
        this.notifyPopup.hideLoader('');
        
      this.notifyPopup.error(commonMessages.serverError);
    }
   }).catch((error) => {
    this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    }) 
  }

  cancelBtn(){
    this.ifEdit = false;
    this.focused = false;
    this.isDataChanged = true;
    this.eleRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    this.uncheckAllList();
  }

  ngOnDestroy() {
    clearInterval(this.autoRefreshTable);
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
  }

  search(event) {
    
    let val = event.target.value;
    if (val.length > 2) {
      this.selectedAPArray = [];
      clearInterval(this.autoRefreshTable);
      this._service.getWeb('utils/ap-search/?query=' + val + '', '', '').then(_data => {
        if (_data) {
          if (_data.result.length != 0) {
            this.data = _data.result;
            this.eleRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
            this.uncheckAllList();
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

  selectAll(ev) {
    let chkLen = this.elRef.nativeElement.querySelectorAll('.register-table-check').length;
    if (ev.target.checked) {
      for (let i = 0; i < chkLen; i++) {
        this.elRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = true;
      }
      for (let ap of this.autoRFTable.data) {
        this.selectedAPArray.push(ap);
        if(this.selectedAPArray.length == 1){
          // this.ap_mac = ap.ap_mac;
          this.AP_name = ap.ap_name;
        }
        else{
          // this.ap_mac = null;
        }
      }

    } else {
      for (let i = 0; i < chkLen; i++) {
        this.elRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = false;
      }
      this.selectedAPArray = [];

    }

  }


  checkboxClick(ap, event) {

    if (event.target.checked) {
      this.selectedAPArray.push(ap);
      if (this.selectedAPArray.length == 1) {
        this.AP_name = ap.ap_name;
      } 
    } else {
      let currentData = this.selectedAPArray.find(function (arr) {
        return arr.group_id == ap.group_id;
      });
      let idx = this.selectedAPArray.indexOf(currentData);
      this.selectedAPArray.splice(idx, 1);
      if (this.selectedAPArray.length == 1) {
        this.AP_name = this.selectedAPArray[0].ap_name;
      }
    }
  }

  double_click_event(event,ap,index){
    this.selectedAPArray = [];
    // this.clickactive = -1;
    this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    let chkLen = this.eleRef.nativeElement.querySelectorAll('.register-table-check').length;
    for (let i = 0; i < chkLen; i++) {
      this.eleRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = false;
    }

    this.selectedAPArray.push(ap);
    this.eleRef.nativeElement.querySelectorAll('.register-table-check')[index]['checked'] = true;
    this.EditAp();
  }

  EditAp(){
    this.isDataChanged = false;
    if(this.selectedAPArray.length == 1){
      this.AP_name = this.selectedAPArray[0].ap_name;
      this.ifEdit = true;
      this.autoRF_2dot4g = (this.selectedAPArray[0].is_auto_rf_2dot4_enabled == 1)? true: false;
      this.autoRF_5g = (this.selectedAPArray[0].is_auto_rf_5_enabled == 1)? true: false;

    }
    else if(this.selectedAPArray.length > 1){
      this.AP_name = "Edit for selected APs"
      this.ifEdit = true;

      let checkDefault2dot4g: boolean = true;
      let checkDefault5g: boolean = true;

      this.autoRF_2dot4g = true;
      this.autoRF_5g = true;

      for(let ap of this.selectedAPArray){
        if(checkDefault2dot4g && ap.is_auto_rf_2dot4_enabled != 1){
          this.autoRF_2dot4g = false;
          checkDefault2dot4g = false;
        }
        if(checkDefault5g && ap.is_auto_rf_5_enabled != 1){
          this.autoRF_5g = false;
          checkDefault5g = false;
        }
        if(checkDefault2dot4g == false && checkDefault5g == false){
          break;
        }
      }
    }
    else{
      this.ifEdit = false;
    }
    this.setFocus();

  }

  autoRFSwitch(autoRFBtn:string){
    this.isDataChanged = true;
      if(autoRFBtn === '2dot4g'){
        this.autoRF_2dot4g = !this.autoRF_2dot4g;
      } else if(autoRFBtn == '5g') {
        this.autoRF_5g = !this.autoRF_5g;      
      } else {

      }

  }


  uncheckAllList(){
    let chkLen = this.elRef.nativeElement.querySelectorAll('.register-table-check').length;

    for (let i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = false;
    }

  }

  setFocus() {
    this.scrollHelper.scrollToFirst("regApList");
    setTimeout(() => {
      this.focused = true;
    },500);

  }


  ngAfterViewInit() {
    
    this.autoRFTable.onPageChange.subscribe((x) => {
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

    this.autoRFTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });

  }

  onSubmit(){

    this.finalJSON['ap_macs_2dot4g'] = [];
    this.finalJSON['ap_macs_5g'] = [];
    this.showUpdatedAPnames = [];
    this.autoRF_2dot4g_aps = [];
    this.autoRF_5g_aps = [];

    for(let ap of this.selectedAPArray){
      this.showUpdatedAPnames.push(ap.ap_name);

      if(this.rogue2dot4gDisabled.indexOf(ap.ap_mac) != -1 || ap.status == 0){
        this.autoRF_2dot4g_aps.push(0);
      }else{
        this.finalJSON['ap_macs_2dot4g'].push(ap.ap_mac);
        if(this.autoRF_2dot4g){
          this.autoRF_2dot4g_aps.push(1);
        } else{
          this.autoRF_2dot4g_aps.push(0);
        }
      }

      if(this.rogue5gDisabled.indexOf(ap.ap_mac) != -1 || ap.status == 0){
        this.autoRF_5g_aps.push(0);
      }else{
        this.finalJSON['ap_macs_5g'].push(ap.ap_mac);
        if(this.autoRF_5g){
          this.autoRF_5g_aps.push(1);
        } else{
          this.autoRF_5g_aps.push(0);
        }
      }

    }

    this.finalJSON.autoRF_2dot4g = this.autoRF_2dot4g;
    this.finalJSON.autoRF_5g = this.autoRF_5g;
    this.uncheckAllList();
    this.ifEdit = false;
    this.focused = false;
    this.isDataChanged = true;
    this.eleRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;

    //api to put data

    if(this.finalJSON['ap_macs_2dot4g'].length <=0 && this.finalJSON['ap_macs_2dot4g'].length <= 0){
      this.notifyPopup.error(commonMessages.offlineAutoRFUpdateError);
    }
    else {
      this.showLoaderBoolStatus = true;
      this.hideLoaderBoolStatus = false;

      setTimeout(() => {
        if (this.showLoaderBoolStatus) {
          this.hideLoaderBoolStatus = true;
          this.notifyPopup.showLoader(commonMessages.updatingAutoRFConfiguration);

        }
      }, 500);

      this._service.putJson('maintenance/auto-rf-ap-list/',this.finalJSON).then(
        _data => {
          if (_data.status == 1) {
            this.scrollHelper.scrollTo(document.getElementsByClassName('apList')[0]);
            // this.selectedAPArray = [];       
            this.showSuccessPopup = true;   
            this.fetchDataFromServer();
            // this.notifyPopup.hideLoader("");
            this.showLoaderBoolStatus = false;
        
            if (this.hideLoaderBoolStatus)
              this.notifyPopup.hideLoader('');
            
            
        }else {
           
          if (this.hideLoaderBoolStatus)
            this.notifyPopup.hideLoader('');
          this.notifyPopup.error(commonMessages.AP_error_update_msg);
        }
      }).catch((error)=>{
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    }    

    this.selectedAPArray = [];
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
