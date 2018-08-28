import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {WebserviceService} from '../../services/commonServices/webservice.service';
@Component({
  selector: 'app-modal-setting',
  templateUrl: './modal-setting.component.html',
  styleUrls: ['./modal-setting.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(300, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class ModalSettingComponent implements OnInit {
  visiblity:boolean;
  headername:string;
  initialselectedscale:string;
  selectedscale:string;
  initialselectedVM:string;
  selectedvm:string;
  inialOnlineColor:string;
  initalOfflineColor:string;
  onlinecolor:string;
  offlinecolor:string;
  initialTimer:number;
  timer:number;
  initialColor:string;
  color:string;
  initialuplinkColor:string;
  uplinkColor:string;
  initialdownlinkColor:string;
  downlinkColor:string;
  randomcolorArray = [];
  colorArray = [];
  itemList = [];
  selectedItems = [];
  cloneselectedItems = [];
  settings = {};
  graphType:number;
  @Input() closable = true;
  @Input() set visible(value: boolean) {
     if(value){
     this.visiblity = value;
     }
   }   
  @Input() set headerName(value: string) {
     if(value){
    //console.log("header Name" + value);
     this.headername = value;
     }
   }
    @Input() set selectedScale(value: string) {
     if(value){
     this.selectedscale = value;
     this.initialselectedscale = value;

     }
   }

   @Input() set onlineColor(value: string) {
     if(value){
      this.onlinecolor = value;
     this.inialOnlineColor = value;
     }
   }
   
   @Input() set offlineColor(value: string) {
     if(value){
       this.offlinecolor = value;
      this.initalOfflineColor = value;
     }
   }

   @Input() set upLinkColor(value: string) {
     if(value){
      // console.log("uplink color" + value);
       this.uplinkColor = value;
      this.initialuplinkColor = value;
     }
   }

   @Input() set downLinkColor(value: string) {
     if(value){
       //console.log("downlink color" + value);
       this.downlinkColor = value;
      this.initialdownlinkColor = value;
     }
   }

   @Input() set Color(value: string) {
     if(value){
       //console.log("color" + value);
      this.color = value;
     this.initialColor = value;
     }
   }

   

    @Input() set autoRefresh(value: number) {
     if(value){
       this.timer = value;
      this.initialTimer = value;
     }
   }

   @Input() set slectedVM(value: string) {
     if(value){
    //console.log("selected VM" + value);
     this.selectedvm = value;
     this.initialselectedVM = value;

     }
   }
   @Input()set SSIDData(SSIDData: Array<any>) {
    if(SSIDData){
      var len = SSIDData.length;

      for (let i = 0; i < len; i++) {
        if(i <= 160){
      let val = {
         id:SSIDData[i]['vap_id'],
        "itemName": SSIDData[i]['ssid'],
        "category": "Custom"
    };
     //console.log("ssid :"+val);
    this.itemList.push(val);
     }else
      continue;
      
    }

    }
   }

   @Input()set groupData(groupData: Array<any>) {
     if(groupData){
      var len = groupData.length;

      for (let i = 0; i < len; i++) {
        if(i <= 160){
      let val = {
       id:groupData[i]['group_id'],
        "itemName": groupData[i]['group_name'],
        "category": "Custom"
    };
     //console.log("group_name :"+val);
    this.itemList.push(val);
     }else
      continue;
    }
  }
   }
  @Output() visibleDisable: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modelSettingFun: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _service: WebserviceService) { }

  ngOnInit() {
    this.itemList.push({ "id": 'Top 10',"name":"option1", "itemName": "Top 10", "category": "" });
     this.itemList.push({ "id":'Bottom 10',"name":"option1", "itemName": "Bottom 10", "category": "" });
    
  
   
    
    // this.itemList = [
    //   { "id": 1, "itemName": "Top 10", "category": "" },
    //   { "id": 2, "itemName": "Bottom 10", "category": "" },
    //   { "id": 3, "itemName": "HFCL_BOTH", "category": "Custom" },
    //   { "id": 4, "itemName": "VAP2", "category": "Custom" },
    //   { "id": 5, "itemName": "HFCL_110401", "category": "Custom" },
    //   { "id": 6, "itemName": "Cli_Vap1", "category": "Custom" },
    //   { "id": 7, "itemName": "Test_to_test", "category": "Custom" },
    //   { "id": 8, "itemName": "HFCL_Single", "category": "Custom" }
    // ];

       this.settings = {
      singleSelection: false,
      text: "Select Graph Options",
      searchPlaceholderText: 'Search Fields',
      enableCheckAll:false,
      enableSearchFilter: true,
      badgeShowLimit: 2,
      groupBy: "category",
      limitSelection: 10
    };
  }

  ngAfterViewInit(){
    this.loadColor();
  }

  loadColor(){
    for (let i = 0; i < 10; i++) {
    let colorVal = {
       id:i.toString(),
       code:this.getRandomColor()
    };
    this.randomcolorArray.push(colorVal);  
    }
  }

getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

  close() {
    this.visiblity = false;
    this.visibleDisable.emit(this.visiblity);
  }

  resetALLField(){
     if(this.headername == 'WLC CPU Utilization (Top 5)' || this.headername == 'WLC Memory Utilization (Top 5)' ||  this.headername == 'WLC Uplink Downlink Traffic')
    {
     this.selectedscale = this.initialselectedscale;
     this.selectedvm =  this.initialselectedVM;
     if(this.headername == 'WLC CPU Utilization (Top 5)' || this.headername == 'WLC Memory Utilization (Top 5)')
     {
       this.color =  this.initialColor;
       this.modelSettingFun.emit({period:this.selectedscale,vm:this.selectedvm,color:this.color});
    }
     else
     {
     this.uplinkColor =  this.initialuplinkColor;
      this.downlinkColor =  this.initialdownlinkColor; 
     this.modelSettingFun.emit({period:this.selectedscale,vm:this.selectedvm,uplinkcolor:this.uplinkColor,downlinkcolor:this.downlinkColor});
     }
     
    }
     else if(this.headername == 'Alarms' ||  this.headername == 'WLC Info'){
      this.timer = this.initialTimer;
      this.modelSettingFun.emit({timer:this.timer});
    }
    else if(this.headername == 'AP Status'){
      this.offlinecolor = this.initalOfflineColor;
      this.onlinecolor = this.inialOnlineColor;
      this.timer = this.initialTimer;
      this.modelSettingFun.emit({onlinecolor:this.onlinecolor,offlinecolor:this.offlinecolor,timer:this.timer});
    }
     else if(this.headername == 'Clients (SSID wise)'  || this.headername == 'Clients (Group wise)'){
      this.timer = this.initialTimer;
      this.randomcolorArray =[];
      this.selectedItems = [];
       this.loadColor();
      this.modelSettingFun.emit({SSID:'',colorcode:'reset',timer:this.timer});
    }
    
  }

  selectDataType(event){
     //this.modelSettingFun.emit({period:event.target.value,vm:this.selectedvm,color:this.color});
    
  }

  selectedVMFun(event){
    // this.modelSettingFun.emit({period:this.selectedscale,vm:event.target.value,color:this.color});   
  }
   getColor(event){
   // this.modelSettingFun.emit({period:this.selectedscale,vm:this.selectedvm,color:event});
  }

  getuplinkColor(event){
   // this.modelSettingFun.emit({period:this.selectedscale,vm:this.selectedvm,uplinkcolor:event,downlinkcolor:this.downlinkColor});
  }
  getdownlinkColor(event){
   //this.modelSettingFun.emit({period:this.selectedscale,vm:this.selectedvm,uplinkcolor:this.uplinkColor,downlinkcolor:event});
  }


  getOnlineColor(event){
    //this.modelSettingFun.emit({onlinecolor:event,offlinecolor:this.offlinecolor,timer:this.timer});
  }
  
   getOfflineColor(event){
    //this.modelSettingFun.emit({onlinecolor:this.onlinecolor,offlinecolor:event,timer:this.timer});
  }

  selectedIntervalFun(event){
    //this.modelSettingFun.emit({onlinecolor:this.onlinecolor,offlinecolor:this.offlinecolor,timer:event.target.value});
  }

  getColorCode(event){
   
   //this.modelSettingFun.emit({SSID:'',colorcode:event,timer:this.timer});
  }
  
  autoRefreshFun(event){
     //this.modelSettingFun.emit({SSID:'',colorcode:'',timer:event});
  }

  saveSettingInfo(){
    var updatedVal;
    this.colorArray = [];
    this.cloneselectedItems = [];
   //{"status":"1","result":{"widget_position":[1,4,0,5,6,7,8,10,2,3,9,11],"ap_online_status":{"refresh_interval":180000,"online_colour":"#1219e8","offline_colour":"#121229"},"wlc_cpu":{"graph_period":180000,"vm_host":"HOST","colour_options":["#F95577","#1219e8"]},"wlc_memory":{"graph_period":180000,"vm_host":"HOST","colour_options":["#F95577","#1219e8"]},"wlc_network":{"graph_period":1,"vm_host":"HOST","colour_options":["#1219e8","#1219e8"]},"clients_group":{"refresh_interval":60000,"colour_options":["#F95577","#B8CE69","#AF39DD","#FFCF0B","#09C4D3","#E51919","#54CC19","#ff9141","#95a2a9","#1f2939"],"graph_type":1,"custom_items":[]},"clients_ssid":{"refresh_interval":60000,"colour_options":["#F95577","#B8CE69","#AF39DD","#FFCF0B","#09C4D3","#E51919","#54CC19","#ff9141","#95a2a9","#1f2939"],"graph_type":1,"custom_items":[]}}}
    if(this.headername == "AP Status")
    {
    updatedVal = {"ap_online_status": { "refresh_interval":this.timer, "online_colour": this.onlinecolor, "offline_colour": this.offlinecolor }}

    }else if(this.headername == "Clients (SSID wise)")
    {
    for(var i=0;i<this.randomcolorArray.length;i++){
         this.colorArray.push(this.randomcolorArray[i].code);
       }
    for(let i=0; i < this.selectedItems.length; i++) {
          this.cloneselectedItems.push(this.selectedItems[i].id);
          console.log("index value :"+this.cloneselectedItems[i])
    } 
    updatedVal = {"clients_ssid": { "refresh_interval":this.timer, "colour_options":this.colorArray, "graph_type":this.graphType, "custom_items":this.cloneselectedItems}}

    }
     if(this.headername == "Clients (Group wise)")
    {
      for(var i=0;i<this.randomcolorArray.length;i++){
         this.colorArray.push(this.randomcolorArray[i].code);
       }
       for(var i=0; i < this.selectedItems.length; i++) {
          this.cloneselectedItems.push(this.selectedItems[i].id);
    } 
    updatedVal = {"clients_group":{ "refresh_interval":this.timer, "colour_options":this.colorArray, "graph_type": this.graphType, "custom_items":  this.cloneselectedItems}}

    }else if(this.headername == "WLC CPU Utilization (Top 5)")
    {
    updatedVal =  {"wlc_cpu": { "graph_period": this.selectedscale, "vm_host":this.selectedvm, "colour_options": [this.color]}}
 
    }
     if(this.headername == "WLC Memory Utilization (Top 5)")
    {
    updatedVal = {"wlc_memory": { "graph_period": this.selectedscale, "vm_host":this.selectedvm, "colour_options":[this.color]}}

    }else if(this.headername == "WLC Uplink Downlink Traffic")
    {
    updatedVal = {"wlc_network": { "graph_period": this.selectedscale, "vm_host":this.selectedvm, "colour_options":[this.uplinkColor,this.downlinkColor]}}
  
  }
  else if(this.headername == "Alarms")
    {
    updatedVal = {"alarm_status": { "refresh_interval": this.timer}} 
  }
   else if(this.headername == "WLC Info")
    {
    updatedVal = {"wlc_network": { "refresh_interval": this.timer}}
  
  }

  
    //this.notifyPopup.showLoader(commonMessages.AP_updating_msg);
    this._service.postJson('dashboard/widget-settings/',updatedVal).then(
      _data => {
        if (_data) {
         //console.log(">>>>>>>>"+_data);
        if(this.headername == 'WLC CPU Utilization (Top 5)' || this.headername == 'WLC Memory Utilization (Top 5)' ||  this.headername == 'WLC Uplink Downlink Traffic')
        {
        if(this.headername == 'WLC CPU Utilization (Top 5)' || this.headername == 'WLC Memory Utilization (Top 5)')
        {

        this.modelSettingFun.emit({period:this.selectedscale,vm:this.selectedvm,color:this.color});
        }
     else
     { 
     this.modelSettingFun.emit({period:this.selectedscale,vm:this.selectedvm,uplinkcolor:this.uplinkColor,downlinkcolor:this.downlinkColor});
     }
     
    }
    else if(this.headername == 'AP Status'){
      this.modelSettingFun.emit({onlinecolor:this.onlinecolor,offlinecolor:this.offlinecolor,timer:this.timer});
    }
     else if(this.headername == 'Clients (SSID wise)'  || this.headername == 'Clients (Group wise)'){
      this.modelSettingFun.emit({SSID:this.selectedItems,colorcode: this.colorArray,timer:this.timer});
    }

    this.visiblity = false;
    this.visibleDisable.emit(this.visiblity);
        } else {
         // this.notifyPopup.hideLoader("");
        }
      }).catch((error) => {
     // this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
     
  }

  onItemSelect(item: any) {
    //console.log(item);
    var count = 0;
   for(var i=0; i < this.selectedItems.length; i++) {
  if(((this.selectedItems[i].itemName).indexOf("Top 10") > -1 || (this.selectedItems[i].itemName).indexOf("Bottom 10") > -1) && item.category == "Custom"){
       // console.log("Second : "+item.itemName);
        this.selectedItems = [];
         this.selectedItems.push(item);
         this.graphType = 3;
        break;
     }
  if((this.selectedItems[i].category).indexOf(item.category) > -1 && item.category != "Custom"){
       // console.log("first : "+item.itemName);
        this.selectedItems = [];
        if(item.itemName == "Top 10"){
          this.graphType = 1;
        }else{
          this.graphType = 2;
        }
        this.selectedItems.push(item);
        break;
     }
  
    } 
   
  }
  OnItemDeSelect(item: any) {
   // console.log(item);

  }
  
}
