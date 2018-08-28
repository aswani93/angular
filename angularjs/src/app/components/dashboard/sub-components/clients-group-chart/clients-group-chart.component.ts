import { Component, OnInit,Input,Output,EventEmitter} from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'clients-group-chart',
  templateUrl: './clients-group-chart.component.html',
  styleUrls: ['./clients-group-chart.component.css']
})
export class ClientsGroupChartComponent implements OnInit {
    clientsGroup:any;
    public graphdata;
    public titleText = null;
    apCountGroups:any;
    count_data:any = [];
    xAxisNames:any = [];
    alive:boolean;
    color_data:any = [];
    count:number = 0;
    timer:any;
    chartBoolStatus:boolean = false;
  timerInterval:number = 60000;
  initialtimerInterval:number = 60000;
  showDialogsetting:boolean = false;
  initalcolorArray = ["#F95577","#B8CE69","#AF39DD","#FFCF0B","#09C4D3","#E51919","#54CC19","#ff9141","#95a2a9","#1f2939"];
  colorArray = ["#F95577","#B8CE69","#AF39DD","#FFCF0B","#09C4D3","#E51919","#54CC19","#ff9141","#95a2a9","#1f2939"];
 group_datas:any;
  @Input()
  set visibleStatus(value: boolean) {
     if(value){
         this.loadData();
         this.setIntervalForChart();
         this.groupAPI();

     }
   }
   @Input()
 set data(data: any) {
    if(data){
     this.initialtimerInterval = data.refresh_interval;
     this.timerInterval = data.refresh_interval;
     this.initalcolorArray=data.colour_options;
     this.colorArray = data.colour_options;
    }
    
   } 
  @Output() deleteWidget: EventEmitter<any> = new EventEmitter<any>();
    
  constructor(private _service: WebserviceService) {
      this.alive = true;
   }

  ngOnInit() {
     
  }

  groupAPI(){
    this._service.getWeb('configurations/group-configurations/', '', '').then(_result => {
      if (_result) {
        this.group_datas = _result.result;
       
      }else{
       
      }

    }).catch((error) => {
         });
  }

  loadData(){
             this.color_data = [];
             this.count = 0;
             this.count_data =[];
           this._service.getWeb('statistics/client-count-group-dashboard/', '', '').then(_result => {
               // _result = {"status":"1","result":[{"group_name":"Curiosity killed d cat_1","client_count":0},{"group_name":"check-group-1","client_count":0},{"group_name":"HFCL_DEFAULT","client_count":0},{"group_name":"ws_s","client_count":0},{"group_name":"MSMGROUP","client_count":0},{"group_name":"cli_gcp1","client_count":0},{"group_name":"testkochinnew","client_count":0},{"group_name":"WLC_da","client_count":0},{"group_name":"CURIOSITY_killed_d_CAT_1","client_count":0},{"group_name":"123456789qwerty","client_count":0},{"group_name":"ABHIS_TEST_GROUP","client_count":4},{"group_name":"aMSMGROUP","client_count":0},{"group_name":"GROUPKochiTEST updated","client_count":0}]}
                 if (_result && _result.result && _result.result.length > 0) {
               this.apCountGroups =_result.result;
               this.chartBoolStatus = true;
               for(let result of this.apCountGroups){
                // if(!this.chartBoolStatus && result.client_count > 0){
                //    this.chartBoolStatus = true;
                // }
               this.count_data.push([result.group_name,result.client_count]);
               //this.xAxisNames.push([result.group_name]) 
               this.fillColor(result.group_name,result.client_count,this.count);   
               this.count = this.count+1;
               }
              this.callingFn('clientsGroup',null);
                
        }
       
    });

      
  }

  fillColor(name,data,count){
   // if(data){
   this.color_data.push({name:name,y:data,color:this.colorArray[count]})
  
   this.xAxisNames = [];
  //this.xAxisNames.push([name]);
  //  }
}

setIntervalForChart(){
       this.timer = IntervalObservable.create(this.timerInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.loadData();
      });
}

  callingFn(str,titleText){
let t =this;
if(str == "clientsGroup"){
this.clientsGroup = new Chart({
    chart: {
      type: 'column'
    },
    title: {
      text: ''
    },
    legend: {
       enabled: false
        },
    credits: {
      enabled: false
    },
    plotOptions: {
    column: {
    minPointLength: 3
  }
}, 
    xAxis: {
    //categories:t.xAxisNames,
    lineWidth: 0,
   minorGridLineWidth: 0,
   lineColor: 'transparent',         
   labels: {
       enabled: false
   },
   minorTickLength: 0,
   tickLength: 0,
     title: {
        text: 'Group'
    }
    },
     yAxis: {
    allowDecimals: false,
    title: {
        text: 'Client Count'
    }
},
        series:[{
        name:'client count',
        data:t.color_data
      }]
  });
}
} 

drawGraph(obj,title){
    this.graphdata = [];
    this.titleText = title;
    // this.alive = false;
     if(!this.timer.isStopped) {
    this.timer.unsubscribe();
    } 
    setTimeout(() => {
       this.setIntervalForChart(); 
        this.graphdata = obj; }, 500);
}

visibleChange(obj){
    //this.titleText = null; 
    //   this.alive = true; 
      if(!this.timer.isStopped) {
     this.timer.unsubscribe();
      } 
       this.loadData(); 
     this.setIntervalForChart();    
}

 ngOnDestroy() {
   if(this.timer)
    this.timer.unsubscribe();
  }


  /*........Setting Popup Method......*/
  openSetting(title){
     this.titleText = title;
     this.showDialogsetting = true;

}
   closeSettingPopup(event){
    this.showDialogsetting = event;
}

  modelSettingFun(event){
      this.timerInterval = event.timer;
      if(event.colorcode == 'reset'){
        this.colorArray =[];
        this.colorArray = this.initalcolorArray;
      }
      else if(event.colorcode){
       var index = Math.floor(Math.random() * 10);
       this.colorArray[index] = event.colorcode;
      }
      console.log("selected index color Code is "+this.colorArray[index] +"and index is "+index);
     this.loadData();
  }

      /*---------delete widget-----*/
  delete(val){
    if(this.timer)
    this.timer.unsubscribe();
   this.deleteWidget.emit({id:val});
  }

}
