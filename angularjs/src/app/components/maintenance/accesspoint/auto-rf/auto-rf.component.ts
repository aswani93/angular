import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {DataTable, SortEvent} from 'angular2-datatable';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {commonUrl} from '../../../../../app/services/urls/common-url';
import {NotificationService, commonMessages} from '../../../../services/notificationService/NotificationService';
import { ScrollHelper } from '../../../../helpers/scroll-helper/scrollHelper';
import 'rxjs/add/operator/catch';
import { TooltipService } from '../../../../services/tooltip/tooltip.service';
@Component({
  selector: 'app-auto-rf',
  templateUrl: './auto-rf.component.html',
  styleUrls: ['./auto-rf.component.css']
})

export class AutoRfComponent implements OnInit, AfterViewInit {
  public  arrayOfLocations = [];
  public currentlyEmpty = [];
  public finalPostData = [];
  public registeredLocations = [];
  public ap_location:string = '';
  public selectedAPLocations:any;
  public locationFieldValid:boolean = false;
  public locationList = 'empty';
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
  regAPCount: any;
  dataCopy: any;
  constructor(private _service : WebserviceService,
              private elRef: ElementRef,
              private notifyPopup : NotificationService,
              private eleRef:ElementRef,
              private tooltipService: TooltipService) {
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
      ap_mac:  '',
      autoRF_2dot4g: false,
      autoRF_5g: false,
      ap_location: ''
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
    this._service.getWeb('maintenance/system-auto-rf-location-acs/', '', '').then(_data => {
      if (_data.status == '1') {
        for(let data of _data.result){
          if(data.ap_location != null || data.ap_location != ""){
            this.arrayOfLocations.push(data.ap_location);
          }
        }
      } else {
        this.arrayOfLocations = [];
      }
    }).catch((error) => {
      this.arrayOfLocations = [];
    });

    
    this.fetchDataFromServer();  
    this.autoRefreshTable = setInterval(() => this.fetchDataFromServer(), this.autoRefreshTime);
  }

  fetchDataFromServer() { 
    this.registeredLocations = [];
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
      this.dataCopy = _data.result['Registered_aps'];
      this.regAPCount = _data.result['ap_count'];
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
        if(this.registeredLocations.indexOf(this.data[ap].ap_location) == -1 &&
               (this.data[ap].ap_location != null || this.data[ap].ap_location != '')){
          this.registeredLocations.push(this.data[ap].ap_location);
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
    this.selectedAPArray = [];
    this.selectedAPLocations = [];
    this.currentlyEmpty = [];
  }

  ngOnDestroy() {
    clearInterval(this.autoRefreshTable);
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
  }

  search(event) {

    // //client side filtering
    //   let val = event.target.value;
    //   let search_columns = ['ap_name', 'ap_ip', 'ap_mac', 'ap_group', 'ap_location', 'ap_model', 'status']
    //   if(val.length > 2){
    //     this.autoRefreshTime = 600000;
    //     this.data = this.dataCopy.filter(function(d){
    //       let matchFound = false;
    //       for(let data of search_columns){
    //         let value = ""+d[data];
    //         if(value.toLowerCase().indexOf(val) !== -1 || !val){
    //           matchFound = true;
    //           break;
    //         }
    //       }      
          
    //       return matchFound;
    //     });
    //   }
    //   else{
    //     this.autoRefreshTime = 50000;
    //     this.data = this.dataCopy;
    //   }
    
    //server side filtering
    let val = event.target.value;
    if (val.length > 2) {
      this.selectedAPArray = [];
      clearInterval(this.autoRefreshTable);
      this._service.getWeb('utils/rogue-ap-search/?query=' + val +'&search_from=autorf'+'', '', '').then(_data => {
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
      this.fetchDataFromServer();
    }

  }

  selectAll(ev) {
    this.selectedAPArray = [];
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
      let found = this.selectedAPArray.some(function (selAp){
        return selAp.ap_mac == ap.ap_mac;
      });
      if(!found){
        this.selectedAPArray.push(ap);
      }
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
    this.selectedAPLocations = [];
    this.currentlyEmpty = [];
    this.isDataChanged = false;
    if(this.selectedAPArray.length == 1){
      this.AP_name = this.selectedAPArray[0].ap_name;
      this.ap_location = (this.selectedAPArray[0].ap_location == null)?'':this.selectedAPArray[0].ap_location;    
      this.selectedAPLocations[this.selectedAPArray[0].ap_mac] = this.ap_location;
      this.ifEdit = true;
      this.autoRF_2dot4g = (this.selectedAPArray[0].is_auto_rf_2dot4_enabled == 1)? true: false;
      this.autoRF_5g = (this.selectedAPArray[0].is_auto_rf_5_enabled == 1)? true: false;
      this.setFocus();
    }
    else if(this.selectedAPArray.length > 1){
      this.AP_name = "Edit for selected APs"
      this.ifEdit = true;

      let checkDefault2dot4g: boolean = true;
      let checkDefault5g: boolean = true;

      this.autoRF_2dot4g = true;
      this.autoRF_5g = true;

      for(let ap of this.selectedAPArray){
        this.selectedAPLocations[ap['ap_mac']] = (ap['ap_location'] == null)?'':ap['ap_location'];
        if(this.selectedAPLocations[ap['ap_mac']] == ''){
          this.currentlyEmpty.push(ap['ap_mac']);
        }
      }

      //This loop may or may not complete looping for all items (efficieny)
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
      this.setFocus();
    }
    else{
      this.ifEdit = false;
    }
    
    

  }

  autoRFSwitch(autoRFBtn:string){
    
      if(autoRFBtn === '2dot4g'){
        this.autoRF_2dot4g = !this.autoRF_2dot4g;
      } else if(autoRFBtn == '5g') {
        this.autoRF_5g = !this.autoRF_5g;      
      } else {

      }
      this.checkLocationValidity();

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

    // this.finalJSON['ap_macs_2dot4g'] = [];
    // this.finalJSON['ap_macs_5g'] = [];
    this.finalPostData = [];
    this.showUpdatedAPnames = [];
    this.autoRF_2dot4g_aps = [];
    this.autoRF_5g_aps = [];
    let offlineAPs:number = 0;

    for(let ap of this.selectedAPArray){
      this.generateJSON();
      this.showUpdatedAPnames.push(ap.ap_name);
      this.finalJSON['ap_mac'] = ap.ap_mac;
      this.finalJSON['ap_location'] = this.selectedAPLocations[ap.ap_mac];
      if(ap.status != 1){
        offlineAPs += 1;
      }

      if(this.rogue2dot4gDisabled.indexOf(ap.ap_mac) != -1 || ap.status != 1){
        this.autoRF_2dot4g_aps.push(0);
        this.finalJSON['autoRF_2dot4g'] = false;
      }else{
        this.finalJSON['autoRF_2dot4g'] = this.autoRF_2dot4g;
        if(this.autoRF_2dot4g){
          this.autoRF_2dot4g_aps.push(1);
        } else{
          this.autoRF_2dot4g_aps.push(0);
        }
      }

      if(this.rogue5gDisabled.indexOf(ap.ap_mac) != -1 || ap.status != 1){
        this.autoRF_5g_aps.push(0);
        this.finalJSON['autoRF_5g'] = false;
      }else{
        this.finalJSON['autoRF_5g'] = this.autoRF_5g;
        if(this.autoRF_5g){
          this.autoRF_5g_aps.push(1);
        } else{
          this.autoRF_5g_aps.push(0);
        }
      }
      this.finalPostData.push(this.finalJSON);
    }


    this.uncheckAllList();
    this.ifEdit = false;
    this.focused = false;
    this.isDataChanged = true;
    this.eleRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;

    //api to put data

    if(this.finalPostData.length == offlineAPs){
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

      this._service.putJson('maintenance/auto-rf-ap-list/',this.finalPostData).then(
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
    this.locationFieldValid =  false;
    this.locationList = 'empty';
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
  
    getToolTipText(fieldId: string) {
        return this.tooltipService.fetchTooltip(fieldId);
    }
      
    checkLocationValidity(){     

      this.isDataChanged = true;
      if(this.selectedAPArray.length == 1){
        this.locationFieldValid = (this.ap_location == '' || this.ap_location.length < 3)?false:true;
        if(this.locationFieldValid){
          this.selectedAPLocations[this.selectedAPArray[0].ap_mac] = this.ap_location;
        }
      } else {
        let allValid:boolean = true;
        // let locationArray:string[] = Object.values(this.selectedAPLocations);
        // for(let ap of locationArray){
        //   if(ap.length < 3 || ap == '')
        //     allValid = false;
        // }

        let locationArray = Object.keys(this.selectedAPLocations);
        for(let ap of locationArray){
          if(this.selectedAPLocations[ap].length < 3 || this.selectedAPLocations[ap] == ''){
            allValid = false;
            if(this.currentlyEmpty.indexOf(ap) == -1)
              this.currentlyEmpty.push(ap);
          }
        }
        this.locationFieldValid = allValid;
      }
    }

    resetLocationList(){
      this.currentlyEmpty = [];
      this.checkLocationValidity();
    }

    fillLocations(selectedLocation){
      if(this.locationList == 'empty'){
        for(let ap of this.currentlyEmpty){
          this.selectedAPLocations[ap] = selectedLocation;
        }
      } else {
        for(let ap of this.selectedAPArray){
          this.selectedAPLocations[ap.ap_mac] = selectedLocation;
        }
      }
      this.checkLocationValidity();
    }

    alphaOnly(event:any) {       
    
      var pattern = /^[a-zA-Z\s]*$/; 
      let inputChar = String.fromCharCode(event.charCode);
    
        if (!pattern.test(inputChar)) {
          // invalid character, prevent input
          event.preventDefault();
        }
      
    };
    
}
