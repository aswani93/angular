import {Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';
import {WebserviceService} from '../../../../../services/commonServices/webservice.service';
import {SerachbarComponent} from '../../../../serachbar/serachbar.component';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {Http} from '@angular/http';
import {DataTable, SortEvent} from 'angular2-datatable';
import {NotificationService, commonMessages} from '../../../../../services/notificationService/NotificationService';
import 'rxjs/add/operator/catch'; 

@Component({
  selector: 'app-connected-clients',
  templateUrl: './connected-clients.component.html',
  styleUrls: ['./connected-clients.component.css']
})
export class ConnectedClientsComponent implements OnInit, OnDestroy, AfterViewInit {

  interval;
  interval_details;
  data = [];
  intialLoad = false;
  isClientSelected = false;
  selectedClient;
  clientDetails;
  coloumsClientObjects: any = [];
  count = 0;
  _sortBy;
  _sortOrder;


  showingto = 0;
  showingfrom = 0;
  pageModulus = 0;
  currentPage;
  dataLength;
  rowsOnPage = 20;
/* pagination declaration variable*/
   page: number = 1;
  Math:any = Math;
  firstarrowStatus:boolean = true;
  lastarrowStatus:boolean = false;
    /*pagination declaration variable end */

  @ViewChild('mf')
  connectedClientsDataTable: DataTable;


  constructor(private elRef: ElementRef,
              private http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private notifyPopup: NotificationService) {
  }

  ngOnInit() {
    this.loadData();
    this.loadClientColumnData();
  }

  ngAfterViewInit() {

    this.connectedClientsDataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
    // this.connectedClientsDataTable.valueChanges.subscribe(() => {
    //   if (this.editFlag) {
    //     this.checkAnyUpdate();
    //   }
    // });
    this.connectedClientsDataTable.onPageChange.subscribe((x) => {
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

  }


  ngOnDestroy() {
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
    clearInterval(this.interval);
    // clearInterval(this.interval_details);
  }


  loadData() {

    this._service.getWeb('statistics/connected-clients/', '', '').then(info => {
      if (info) {
        this.intialLoad = true;
        this.data = info.result;
      //  console.log(info);
        this.interval = setTimeout(() => {
          this.loadData();
        }, 5000);
      }
      this.spinnerService.hide();
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }


  showDetails(mac) {
    // clearInterval(this.interval_details);
    // clearInterval(this.interval);
    // this._service.getWeb('statistics/client-stats-detail/?client_mac=' + mac, '', '').then(data => {
    //   this.clientDetails = data.result;
    //   this.isClientSelected = true;
    //   this.interval_details = setTimeout(() => {
    //     this.showDetails(mac);
    //   }, 5000);
    // });
    clearInterval(this.interval);
    this.selectedClient = mac;
    this.isClientSelected = true;

  }

  // goback(tab) {
  //   this.isClientSelected = false;
  //   clearInterval(this.interval_details);
  //   this.loadData();

  // }
  loadClientColumnData() {
    this.coloumsClientObjects = [
      {name: 'Client MAC', checked: true},
      {name: 'AP Name', checked: true},
      {name: 'AP MAC', checked: false},
      {name: 'Group Name', checked: false},
      {name: 'SSID', checked: true},
      {name: 'RSSI', checked: true},
      {name: 'Uplink', checked: false},
      {name: 'Downlink', checked: false},
      {name: 'Online Time', checked: false},
      {name: 'Client Device Type', checked: false},
      {name: 'Client IP', checked: false},
      {name: 'Client Name', checked: false},
      {name: 'Client OS', checked:false}
    ];
  }

  selectClientColoums(event, index) {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.checked === false) {
      this.count = this.count + 1;
    } else {
      this.count = this.count - 1;
    }
    if (this.count <= 4) {
      this.coloumsClientObjects[index].checked = event.target.checked;
    } else {

      this.coloumsClientObjects[index].checked = true;
    }
  }

  holdPopup(event) {
    event.stopPropagation();
  }

  emitEve() {

    this.loadData();
    this.loadClientColumnData();
    this.isClientSelected = false;
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
