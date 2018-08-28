import {Component, OnInit, AfterViewInit, TemplateRef, ElementRef, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import {DataService} from '../../../../services/dataService/data.service';
import {DataTable, SortEvent} from 'angular2-datatable';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {NoColonPipe} from '../../../../services/filters/nocolon';
import {commonUrl} from '../../../../../app/services/urls/common-url';
import {NotificationService, commonMessages} from '../../../../services/notificationService/NotificationService';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-air-quality',
  templateUrl: './air-quality.component.html',
  styleUrls: ['./air-quality.component.css']
})
export class AirQualityComponent implements OnInit {
  regAPCount: any;
constructor(
private http: Http,
private _service : WebserviceService,
private elRef: ElementRef,
private notifyPopup : NotificationService,
private eleRef:ElementRef) {
}
@ViewChild('mf') private dataTable: DataTable;
data;
coloumsObjects:any = [];
currentPage;
dataLength;
showingto = 1;
showingfrom = 0;
pageModulus = 0;
public _sortBy;
public _sortOrder;
rowsOnPage = 20;
/* pagination declaration variable*/
page: number = 1;
Math:any = Math;
firstarrowStatus:boolean = true;
lastarrowStatus:boolean = false;
/*pagination declaration variable end */

/*details page vaiarbles*/
isdetailsShowed = false;
selectedAp;
/*details page vaiarbles*/


/*searching */
dataCopy;
search_key;
/*searching */

ngOnInit(): void {
  this.loadData();
  
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
    console.log(this._sortOrder);
  });

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

  let details;
  this._service.getWeb('maintenance/auto-rf-ap-list/', '', '').then(_data => {
    if (_data.status == 1) {
      this.data = _data.result['Registered_aps'];
      this.dataCopy =  _data.result['Registered_aps'];
      this.regAPCount = _data.result['ap_count'];
    } else {
      
    }
  }).catch((error) => {
    this.notifyPopup.logoutpop(commonMessages.InternalserverError);
  });
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
  }
}
goToPage(num){
  this.getNext(num);
}
/* pagination method here end*/

double_click_event(eve,item){
this.isdetailsShowed = true;
this.selectedAp = item;

}
emitEve() {
  this.loadData();
  this.isdetailsShowed = false;
  this.search_key = '';
}
count:number = 0;
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

//searching...

searchAp(){
  let val = this.search_key;
  let search_columns = ['ap_name', 'ap_ip', 'ap_mac', 'ap_group', 'active_clients', 'ap_model', 'status']
  if(val.length > 2){
    this.data = this.dataCopy.filter(function(d){
      let matchFound = false;
      for(let data of search_columns){
        let value = ""+d[data];
        if(value.toLowerCase().indexOf(val) !== -1 || !val){
          matchFound = true;
          break;
        }
      }      
      
      return matchFound;
    });
  }
  else{
    this.data = this.dataCopy;
  }
}

}
