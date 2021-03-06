import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {DataTable, SortEvent} from 'angular2-datatable';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {commonUrl} from '../../../../../app/services/urls/common-url';
import {NotificationService, commonMessages} from '../../../../services/notificationService/NotificationService';
import { ScrollHelper } from '../../../../helpers/scroll-helper/scrollHelper';
import { Chart } from 'angular-highcharts';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";

import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-auto-rfmonitoring',
  templateUrl: './auto-rfmonitoring.component.html',
  styleUrls: ['./auto-rfmonitoring.component.css']
})

export class AutoRfmonitoringComponent implements OnInit, AfterViewInit {
  public ifEdit: boolean = false;
  public data;
  public currentPage;
  public rowsOnPage = 20;
  public dataLength;
  public selectedAp;
  private url = commonUrl.dynamicsocket;
  private socket;
  public _sortBy;
  public _sortOrder;
  showLoaderBoolStatus: boolean = true;
  hideLoaderBoolStatus: boolean = false;
  AP_name:any;
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
  public graphClicked: boolean = false;
  private autoRefreshTime: Number = 50000;
  
  public titleText = null;
  public selectedGraphChannel = 0;

  coloumsObjects:any = [];
  count:number = 0;
  autoRefreshGraph;
  constructor(private _service : WebserviceService,
              private elRef: ElementRef,
              private notifyPopup : NotificationService,
              private eleRef:ElementRef) {
  }

  ngOnInit(): void {
    this.loadData(); 
  }


  ngAfterViewChecked(){
    
    if(!this.focused){
      this.scrollHelper.doScroll();
    }

  }


  loadData(){
    this.coloumsObjects=[
      { name:'AP Name', checked: true},
      { name:'Location', checked: true},
      { name:'IP Address', checked: true},
      { name:'MAC Address', checked: true},
      { name:'Group Name',  checked: true},
      { name:'No. of Clients',  checked: true},
      { name:'AP Model',  checked: true},
      { name:'Status', checked: true}

    ];

    this.showLoaderBoolStatus = true;
    this.hideLoaderBoolStatus = false;
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

    this._service.getWeb('statistics/auto-rf-enabled-ap-list/', '', '').then(_data => {
    if (_data.status == 1) {

      this.data = _data.result['Registered_aps'];
      this.showLoaderBoolStatus = false;
      if (this.hideLoaderBoolStatus)
        this.notifyPopup.hideLoader('');

    } else {
      if (this.hideLoaderBoolStatus)
        this.notifyPopup.hideLoader('');
      
      this.notifyPopup.error(commonMessages.serverError);
    }
   }).catch((error) => {
    this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    }) 
  }

  ngOnDestroy() {
    clearInterval(this.autoRefreshTable);
    clearInterval(this.autoRefreshGraph);
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
  }

  search(event) {
    let val = event.target.value;
    if (val.length > 2) {
      clearInterval(this.autoRefreshTable);
      this._service.getWeb('utils/rogue-ap-search/?query=' + val +'&search_from=autorf'+'', '', '').then(_data => {
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


  double_click_event(event,ap,index){
    this.autoRefreshTime = 300000;
    this.selectedAp = ap;
    this.selectedGraphChannel = 0;
    this.graphClicked = true;   

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
 
      

   
        
  changeGraphValues(channel){
    
    if(channel == 1){
      this.selectedGraphChannel = 1;
      // this.fetchGraphData();
    }else{
      this.selectedGraphChannel = 0;
      // this.fetchGraphData();
    }
  }

  goBack(){
    this.autoRefreshTime = 50000;
    this.graphClicked = false;
    this.fetchDataFromServer();
  }

}
