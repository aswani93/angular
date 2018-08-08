import { Component, OnInit , ViewChild} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {DataTable, SortEvent} from 'angular2-datatable';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NotificationService, commonMessages} from '../../../../services/notificationService/NotificationService';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class AlarmComponent implements OnInit {
  public currentPage=1;
  public rowsOnPage=20 ;  
  public dataLength;
  public clickCount = 0;  
  public showingto = 1;
  public showingfrom = 0;
  public pageModulus = 0;
  public hasData : boolean = false;
  public totalRows:any;
  public errorMsg : string;
  public totalPages:any;

  /* pagination declaration variable*/
  page: number = 1;
  Math:any = Math;
  firstarrowStatus:boolean = true;
  lastarrowStatus:boolean = false;
    /*pagination declaration variable end */

  @ViewChild('mf')
  private alarmdataTable: DataTable;
  menuState:string = 'out';
  isOpened: boolean = false;
  coloumsObjects = [];
  alarmData = [];
  _sortBy;
  _sortOrder;
  filterForm;
  param;
  typeJson = [{ "AP":[ { "type":"AP Config Status", "value":"4012" }, { "type":"AP CPU Threshold", "value":"4013" }, { "type":"AP FW Update Status", "value":"4010" }, { "type":"AP MEM Threshold", "value":"4014" }, { "type":"AP Offline", "value":"4001" }, { "type":"AP Online", "value":"4000" }, { "type":"AP Reboot Reason", "value":"4011" }, { "type":"AP User SSH Login Event", "value":"4015" } ], "Client":[ { "type":"Client Connected", "value":"4002" }, { "type":"Client Disconnected", "value":"4003" } ], "EMS":[ ], "WLC":[ { "type":"Break Redundancy", "value":"4009" }, { "type":"Redundancy Config Save", "value":"4007" }, { "type":"Redundancy Info", "value":"4005" }, { "type":"Redundancy Status", "value":"4006" }, { "type":"Redundancy Switch Over", "value":"4008" }, { "type":"WLC Reboot", "value":"4004" } ] }];
  constructor(private _service : WebserviceService, private notifyPopup: NotificationService, private _route : Router, private route : ActivatedRoute) { }

  ngOnInit() {
    this.generateForm();
    this.generateAlarmType('');
    if(sessionStorage.getItem('filter')!=null){
      this.loadData(sessionStorage.getItem('filter'))
    }else{
      this.loadData('')
    }




  }

  toggleMenu() {

    if(!this.isOpened){
      this.isOpened =true;
    }else{
      setTimeout(() => {
        this.isOpened =false;
      }, 500);

    }
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }
  loadData(param) {
    this.coloumsObjects = [
      {name: 'Type', checked: true},
      {name: 'Info', checked: true},
      {name: 'Event Description', checked: true},
      {name: 'Status', checked: true},
      {name: 'Time', checked: true}
    ];
    if(param!=''){
      this.notifyPopup.showLoader('Applying filter...');
    }else{
      this.notifyPopup.showLoader('Loading event details...');
    }
    this._service.getWeb('events/system-alarms/'+param+'', '', '').then(data => {
      if (data.status == 1) {
        this.alarmData = data.result;
        this.totalRows = this.alarmData.length;
        this.hasData = true;
        this.totalPages = (this.totalRows%this.rowsOnPage > 1)?
                Math.trunc(this.totalRows/this.rowsOnPage)+1:
                Math.trunc(this.totalRows/this.rowsOnPage);
        
        this.setOptions(param);
        this.notifyPopup.hideLoader('');
        this.alarmdataTable.setSort('event_at', 'desc');
      } else {
        this.alarmData = null;
        this.notifyPopup.hideLoader('');
        this.errorMsg = data.msg;
      }

    }).catch((error) => {
      //this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }
  generateForm() {
    this.filterForm = new FormGroup({
      'time_interval': new FormControl(''),
      'alarm_type': new FormControl(''),
      'device_type': new FormControl(''),
      'severity_level': new FormControl('')
    });
  }

  filter(){
    sessionStorage.removeItem('filter');
    this.loadData(this.generateQueryparams(this.filterForm.value));
    this.toggleMenu();
  }

  reset(){
    sessionStorage.removeItem('filter');
    this.generateForm();
    this.loadData('');
  }
 
  setOptions(param){
    let splitArr = param.split('&');
    let serverityLevel = splitArr[4].split('=')[1];
    this.filterForm.get('severity_level').setValue(serverityLevel);

  }
  generateQueryparams(formVal){
    let timeFrom = this.convertToepoch(formVal.time_interval[0]);
    let timeTo = this.convertToepoch(formVal.time_interval[1]);
    let alarmtype = formVal.alarm_type;
    let deviccetype = formVal.device_type;
    let serverityLevel = formVal.severity_level;
    let param = '?from='+timeFrom+'&to='+timeTo+'&deviccetype='+deviccetype+'&alarmtype='+alarmtype+'&serverityLevel='+serverityLevel+'';
    return param;
  }
  alarmtype = [];
  generateAlarmType(device){
    this.alarmtype = [];
    if(device == ''){
      let c = 0;
      for(let i of this.typeJson){
        for(let x = 0;x<Object.keys(i).length;x++){
          for(let y = 0;y<i[Object.keys(i)[x]].length;y++){
            this.alarmtype.push(i[Object.keys(i)[x]][y]);
          }

        }
      }
    }else{
      for(let i of this.typeJson){
        for(let y = 0;y<i[device].length;y++){
          this.alarmtype.push(i[device][y]);
        }
      }



    }
    this.alarmtype.sort(function(a, b){
      var nameA = a.type, nameB = b.type
      if (nameA < nameB) //sort string ascending
        return -1
      if (nameA > nameB)
        return 1
      return 0 //default return value (no sorting)
    })
  }
  convertToepoch(time){
    let epochTime = new Date(time).getTime();
    if(isNaN(epochTime)){
      return '';
    }else{
      return epochTime;
    }
  }
  ngAfterViewInit() {
    this.alarmdataTable.onPageChange.subscribe((x) =>{
      this.clickCount = 0;
      this.currentPage = x.activePage;
      this.dataLength = x.dataLength;
      this.pageModulus = this.dataLength % x.rowsOnPage;
      if(x.rowsOnPage * this.currentPage > x.dataLength){
      this.showingto = (x.rowsOnPage * (this.page-1))+ this.pageModulus;
      this.showingfrom = (this.showingto - this.pageModulus) + 1;
      }else{
      this.showingto = x.rowsOnPage * this.page;
      this.showingfrom = (this.showingto - x.rowsOnPage) + 1;
      }
      });

    this.alarmdataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });

  }
  ngOnDestroy() {
    sessionStorage.removeItem('filter');

  }

  /* pagination method here*/
  getNextt(page){
    this.page = page;
      if(this.page == 1)
      {
      this.firstarrowStatus = true;
      this.lastarrowStatus = false; 
      }
      else if(this.page == this.Math.ceil(this.alarmData.length/this.rowsOnPage))
      { 
        this.lastarrowStatus = true;
          this.firstarrowStatus = false; 
      }
      else
      {
      this.firstarrowStatus = false;
        this.lastarrowStatus = false;
      }

  }
  goToPage(num){
  this.getNextt(num);
  }
  /* pagination method here end*/


}
