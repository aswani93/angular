import {Component, OnInit, ElementRef, ViewChild, OnDestroy,Input,Output,EventEmitter} from '@angular/core';
import {TabsetComponent} from 'ngx-bootstrap';
import {Http} from '@angular/http';
import {WebserviceService} from '../../../../../services/commonServices/webservice.service';
import {NotificationService, commonMessages} from '../../../../../services/notificationService/NotificationService';
import 'rxjs/add/operator/catch';
import { Chart } from 'angular-highcharts';
import {DataTable, SortEvent} from 'angular2-datatable';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-air-quality-details',
  templateUrl: './air-quality-details.component.html',
  styleUrls: ['./air-quality-details.component.css'],
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
export class AirQualityDetailsComponent implements OnInit {

  constructor(private http: Http,private _service : WebserviceService,private notifyPopup : NotificationService,private elRef: ElementRef,
  ) { }
  @Input() selectedAp: any;
  @Output() emitEve = new EventEmitter();
  @ViewChild('mf') private dataTable: DataTable;
  @ViewChild('mf2') private dataTable2: DataTable;
  minValue: number = -100;
  maxValue: number = -10;
  options: Options = {
    floor: -100,
    ceil: -10,
    step: 1,
    minRange: 10
  };
  chart: Chart;
  selectedTab = 0;
  detailData;
  detailDataLength;
  detailDataforGraph:any = [];
  lengthVarTemp;
  selectAllChecked;
  color_24 = ['#44b2d7','#ffb822','#f4516c','#34bfa3','#fa8c53','#716aca'];
  color_5 =  ['#716aca','#0c317a','#ff6767','#ab0e86','#5c3c10','#1e1548'];
  dataforPlot : any = [];
  dataforPlot_copy : any = [];
  graphData : any = [];
  currentPage;
  dataLength;
  showingto = 1;
  showingfrom = 0;
  pageModulus = 0;
  public _sortBy;
  public _sortOrder;
  public _sortBy2;
  public _sortOrder2;
  rowsOnPage = 20;
  menuState:string = 'out';
  isOpened: boolean = false;
  filterForm;
  public ssid_settings = {};
  public mac_settings = {};
  public channel_settings = {};
  public status_settings = {};
  channelList: any = [];
  public statusList = [{"id":"Known","itemName":"Known"},{"id":"Unknown","itemName":"Unknown"}];
  ssidList: any = [];
  macList: any = [];
  selectedssids = [];
  selectedmacs = [];
  selectedchannels = [];
  selectedStatus = [];
  public rssithreshold = 10;
  public selectedrssi;
  ngOnInit() {
   this.loadData();
   this.generateForm();
   this.generateMultiselect();
   this.generateChannel();
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
  toggleTab(tab){
    this.selectedTab = tab;
    this.loadData();
    this.generateChannel();
    this.selectedssids = [];
    this.selectedmacs = [];
    this.selectedchannels = [];
    this.minValue = -100;
    this.maxValue = -10;
    this.menuState = 'out';
   
  }
  channelVal;
  generateChannel(){
    this.channelList = [];
    if(this.selectedTab == 0){
      this.channelVal= [1,2,3,4,5,6,7,8,9,10,11];
     
    }else{
      this.channelVal = [36,40,44,48,52,56,60,64,100,104,108,112,116,132,136,140,149,153,157,161,165];
    }
    for(let c of this.channelVal){
      let obj = {"id":c.toString(),"itemName":c.toString()};
      this.channelList.push(obj);
      //console.log(this.channelList)
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
  loadData(){
    this._service.getWeb('statistics/air-quality-table-view/?radio='+this.selectedTab+'&ap_mac='+this.selectedAp.ap_mac+'', '', '').then(_data => {
      if (_data.status == 1) {
      this.dataforPlot = _data.result.known_ssid_list.concat(_data.result.unknown_ssid_list);
      //console.log(this.dataforPlot);
      this.dataforPlot_copy = this.dataforPlot;
      this.detailData = JSON.parse(JSON.stringify(this.dataforPlot));
      this.detailDataLength =this.dataforPlot.length;
      this.lengthVarTemp = this.detailDataLength;
      this.selectAllChecked = true;
      this.graphData = [];
      this.createGraphdataNplot();
      this.ssidList = [];
      this.macList = [];
      for(let i of this.dataforPlot){
        let obj = {"id":i.known_ssid_name,"itemName":i.known_ssid_name};
        let obj2 = {"id":i.ssid_mac,"itemName":i.ssid_mac};
        let index = this.macList.findIndex(x => x.id==obj2.id);
        if (index == -1) {
          this.macList.push(obj2);
        }
        this.ssidList.push(obj);
      }
      if(this.selectedTab == 1){
        if(this.dataTable2){
          this.dataTable2.onSortChange.subscribe((event: SortEvent) => {
            this._sortBy2 = event.sortBy;
            this._sortOrder2 = event.sortOrder;
          });
        }
      }
      } else {
        
      }
    }).catch((error) => {//console.log(error);
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }
  goback(){
    this.emitEve.emit();
  }

  checkNredraw(eve,item){
  
    
    if(eve.target.checked == true){
      this.lengthVarTemp = this.lengthVarTemp+1;
      if(this.lengthVarTemp == this.detailDataLength){
        this.selectAllChecked = true;
      }
      let index = this.dataforPlot.findIndex(x => x.ssid_mac==item.ssid_mac);
      if (index == -1) {
        this.dataforPlot.push(item);
      }
      
    }else{
      this.lengthVarTemp = this.lengthVarTemp-1;
      this.selectAllChecked = false;
      let index = this.dataforPlot.findIndex(x => x.ssid_mac==item.ssid_mac);
      if (index > -1) {
        this.dataforPlot.splice(index, 1);
      }
    }
    this.createGraphdataNplot();
    
   
  }
  selectAll(status){
    
    var chkLen = this.elRef.nativeElement.querySelectorAll('.ssid-check').length;
   if(status){
    this.selectAllChecked = true;
    for (var i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.ssid-check')[i]['checked'] = true;
    }
    this.loadData();
   }else{
    this.selectAllChecked = false;
    for (var i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.ssid-check')[i]['checked'] = false;
    }
    this.dataforPlot =[];
    this.createGraphdataNplot();
   }
  }
  generateGraph(tab){
    if(tab == 0){
      this.chart = new Chart({
        chart: {
        type: 'spline',
        height: 300
      },

      title: {
        text: null
      },

      subtitle: {
        text: null
      },

      xAxis: [{
        tickPositions: [1,2,3,4,5,6,7,8,9,10,11],
        min: -3,
        max: 15,
        title: {
        text: 'Channel',
        style: {
          fontWeight: 'bold'
        }
        }
      }
      ],
      yAxis: {    
        showLastLabel:false,
        title: {
          text: 'RSSI',
          style: {
          fontWeight: 'bold'
          }
        },
        labels: {
          format: '{value}',
        },
        tickInterval: 10,
        reversed: true
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        symbolWidth: 5,
        enabled: false
      },
      series: this.graphData
      });
    }else{
      this.chart = new Chart({
      chart: {
      type: 'spline',
      height: 300
      },

      title: {
      text: null
      },

      subtitle: {
      text: null
      },

      xAxis: [{
      tickPositions: [36,40,44,48,52,56,60,64,100,104,108,112,116,132,136,140,149,153,157,161,165],
      min: 25,
      max: 175,
      title: {
      text: 'Channel',
      style: {
      fontWeight: 'bold'
      }
      }
      }
      ],

      yAxis: {    
      showLastLabel:false,
      title: {
      text: 'RSSI',
      style: {
      fontWeight: 'bold'
      }
      },
      labels: {
      format: '{value}'
      },
      tickInterval: 10,
      reversed: true
      },
      legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'top',
      symbolWidth: 5,
      enabled: false
      },
      series: this.graphData
      });
    }
   
  
  }

  createGraphdataNplot(){
    this.graphData = [];
    let index = 0;
    for(let ssid of this.dataforPlot){
      let ssidname = ssid.known_ssid_name;
      let channel  = ssid.channel;
      let channelWidth  = ssid.channel_width/10;
      let rssi  = ssid.rssi;
      let start_point = channel - (channelWidth/2);
      let end_point   = channel + (channelWidth/2);
      let data = this.generatePoints(start_point,end_point,channelWidth,rssi,channel);
      let series = {
        name: ssidname,
        data: data,
        color: this.selectedTab == 0 ? this.color_24[index]:this.color_5[index]
      }
      this.graphData.push(series);
     
     index = index+1;
    }
   
    this.generateGraph(this.selectedTab);
  }
  
  generatePoints(start,end,width,rssi,channel){
    let obj = [];
    let obj1 = [];
    let index = 0;
    if(width>2){
      if(this.selectedTab == 0){
        for(let i=0;i<width;i++){
          //console.log(i);
          if(i == 0 ){
            obj.push({'x':start,'y':0})
          }
          else if(i == width-1){
            obj.push({'x':end,'y':0})
          } 
          else if(i == 1){
            obj.push({'x':start,'y':rssi})
          }
          else if(i == width-2){
            obj.push({'x':end,'y':rssi})
          }else{
            obj.push({'x':i,'y':rssi})
          }
          
        }
      }else{
        for(let i=0;i<width;i++){
          //console.log(i);
          if(i == 0 ){
            obj.push({'x':start,'y':0})
          }
          else if(i == width-1){
            obj.push({'x':end,'y':0})
          } 
          else if(i == 1){
            obj.push({'x':start,'y':rssi})
          }
          else if(i == width-2){
            obj.push({'x':end,'y':rssi})
          }else{
            obj.push({'x':start+i,'y':rssi})
          }
          
        }
      }
     
    }else{
      for(let i=0;i<width;i++){
        if(i == 0 ){
          obj.push({'x':start,'y':0},{'x':start,'y':rssi});
        }
        if(i == 1 ){
          obj.push({'x':end,'y':rssi},{'x':end,'y':0})
        }
        
      }

    }
    
   return(obj);
  }
  generateForm() {
    this.filterForm = new FormGroup({
      'ssid': new FormControl(''),
      'ssid_mac': new FormControl(''),
      'ssid_channel': new FormControl(''),
      'ssid_rssi': new FormControl('')
    });
  }
  generateMultiselect(){
    this.ssid_settings = {
      text: "Select SSID",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: "myclass custom-class",
      enableSearchFilter: true,
      badgeShowLimit: 3
  };
  this.mac_settings = {
    text: "Select MAC",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    classes: "myclass custom-class",
    enableSearchFilter: true,
    badgeShowLimit: 2
};
  this.channel_settings = {
    text: "Select Channel",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    classes: "myclass custom-class",
    enableSearchFilter: true,
    badgeShowLimit: 4
  };
  this.status_settings = {
    text: "Select AP Status",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    classes: "myclass custom-class",
    enableSearchFilter: true,
    badgeShowLimit: 4
  };
  //console.log(this.ssidArray);
  }

  filter(){
    let names = [];
    let macs = [];
    let channels = [];
    let status = [];
    let rssi = this.rssithreshold;
    let res  = this.dataforPlot_copy;
    if(this.selectedssids.length>0){
    for(let item of this.selectedssids){
      names.push(item.itemName);
    }
    res = res.filter(s => names.indexOf(s.known_ssid_name)!== -1 );

    }else{
      names = []
    }
    if(this.selectedmacs.length>0){
    for(let item of this.selectedmacs){
      macs.push(item.itemName);
    }
    res = res.filter(s => macs.indexOf(s.ssid_mac)!== -1 );
    }else{
      macs = []
    }
    if(this.selectedchannels.length>0){
    for(let item of this.selectedchannels){
      channels.push(item.itemName);
    }
    res = res.filter(s => channels.indexOf(s.channel.toString())!== -1 );
    }else{
      channels = []
    }
    if(this.selectedStatus.length>0){
      for(let item of this.selectedStatus){
        status.push(item.itemName.toLowerCase());
      }
      res = res.filter(s => status.indexOf(s.status.toString())!== -1 );
      }else{
        status = []
      }

    res = res.filter(s => (s.rssi>this.minValue && s.rssi<this.maxValue));

    this.dataforPlot = res;
    this.detailData = JSON.parse(JSON.stringify(this.dataforPlot));
    this.graphData = [];
    this.toggleMenu();
    this.createGraphdataNplot();
    
  }
  resetfilter(){
    this.selectedssids = [];
    this.selectedmacs = [];
    this.selectedchannels = [];
    this.minValue = -100;
    this.maxValue = -10;
    this.toggleMenu();
    this.loadData();
  }
}
