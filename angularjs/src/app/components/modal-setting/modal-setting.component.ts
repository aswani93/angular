import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
  randomcolorArray = [];
  itemList = [];
  selectedItems = [];
  settings = {};
  @Input() closable = true;
  @Input() set visible(value: boolean) {
     if(value){
     this.visiblity = value;
     }
   }   
  @Input() set headerName(value: string) {
     if(value){
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
      console.log("online color :"+value);
     this.inialOnlineColor = value;
     }
   }

   @Input() set offlineColor(value: string) {
     if(value){
       console.log("offline color :"+value);
       this.offlinecolor = value;
      this.initalOfflineColor = value;
     }
   }

    @Input() set autoRefresh(value: number) {
     if(value){
       console.log("timer :"+value);
       this.timer = value;
      this.initialTimer = value;
     }
   }

   @Input() set slectedVM(value: string) {
     if(value){
     this.selectedvm = value;
     this.initialselectedVM = value;

     }
   }
  @Output() visibleDisable: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modelSettingFun: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.itemList = [
      { "id": 1, "itemName": "Top 10", "category": "" },
      { "id": 2, "itemName": "Bottom 10", "category": "" },
      { "id": 3, "itemName": "HFCL_BOTH", "category": "Custom" },
      { "id": 4, "itemName": "VAP2", "category": "Custom" },
      { "id": 5, "itemName": "HFCL_110401", "category": "Custom" },
      { "id": 6, "itemName": "Cli_Vap1", "category": "Custom" },
      { "id": 7, "itemName": "Test_to_test", "category": "Custom" },
      { "id": 8, "itemName": "HFCL_Single", "category": "Custom" }
    ];

       this.settings = {
      singleSelection: false,
      text: "Select Fields",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      searchPlaceholderText: 'Search Fields',
      enableSearchFilter: true,
      badgeShowLimit: 5,
      groupBy: "category"
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

  selectDataType(event){
     this.modelSettingFun.emit({period:event.target.value,vm:this.selectedvm});
    
  }

  resetALLField(){
     if(this.headername == 'WLC CPU Utilization (Top 5)' || this.headername == 'WLC Memory Utilization (Top 5)' ||  this.headername == 'WLC Uplink Downlink Traffic')
    { this.selectedscale = this.initialselectedscale;
     this.selectedvm =  this.initialselectedVM;
     this.modelSettingFun.emit({period:this.initialselectedscale,vm:this.selectedvm});
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
      this.modelSettingFun.emit({SSID:'',colorcode:'reset',timer:event});
    }
    
  }

  selectedVMFun(event){
     this.modelSettingFun.emit({period:this.selectedscale,vm:event.target.value});   
  }

  getOnlineColor(event){
    this.modelSettingFun.emit({onlinecolor:event,offlinecolor:this.offlinecolor,timer:this.timer});
  }
   getOfflineColor(event){
    this.modelSettingFun.emit({onlinecolor:this.onlinecolor,offlinecolor:event,timer:this.timer});
  }

  selectedIntervalFun(event){
    this.modelSettingFun.emit({onlinecolor:this.onlinecolor,offlinecolor:this.offlinecolor,timer:event.target.value});
  }

  getColorCode(event){
   this.modelSettingFun.emit({SSID:'',colorcode:event,timer:this.timer});
  }
  
  autoRefreshFun(event){
     this.modelSettingFun.emit({SSID:'',colorcode:'',timer:event});
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
}
