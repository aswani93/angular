import { Component, OnInit,Input } from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'clients-ssidchart',
  templateUrl: './clients-ssidchart.component.html',
  styleUrls: ['./clients-ssidchart.component.css']
})
export class ClientsSsidchartComponent implements OnInit {
  clientsSsid:any;
  public graphdata;
  apCountSSIDGroups:any;
  countSSID_data:any = [];
  xAxisNames:any = [];
  public titleText = null;
  alive:boolean;
  count:number = 0;
  color_data:any = [];
  timer:any;
  chartBoolStatus:boolean = false;
   timerInterval:number = 60000;
  initialtimerInterval:number = 60000;
  showDialogsetting:boolean = false;
  initalcolorArray = ["#F95577","#B8CE69","#AF39DD","#FFCF0B","#09C4D3","#E51919","#54CC19","#ff9141","#95a2a9","#1f2939"];
  colorArray = ["#F95577","#B8CE69","#AF39DD","#FFCF0B","#09C4D3","#E51919","#54CC19","#ff9141","#95a2a9","#1f2939"];
@Input()
  set visibleStatus(value: boolean) {
     if(value){
       this.loadData();
      this.setIntervalForChart();
     }
   }   
  
  constructor(private _service: WebserviceService) {
    this.alive = true;
   }

  ngOnInit() {
     
  }

  loadData(){
           this.color_data = [];
           this.count = 0;
           this.countSSID_data =[];
           this._service.getWeb('statistics/client-count-vap-dashboard/', '', '').then(_result => {
               // _result = {"status":"1","result":[{"vap_name":"issued_once","client_count":2},{"vap_name":"test_to_test","client_count":3},{"vap_name":"cli_vap1","client_count":10},{"vap_name":"testing_ssid","client_count":20},{"vap_name":"sugarcane","client_count":30},{"vap_name":"hello","client_count":6},{"vap_name":"dollar_million","client_count":6},{"vap_name":"got_it","client_count":9}]}
                 if (_result && _result.result) {
               this.apCountSSIDGroups =_result.result;
                this.chartBoolStatus = true;
               for(let result of this.apCountSSIDGroups){
                //  if(!this.chartBoolStatus && result.client_count > 0){
                //    this.chartBoolStatus = true;
                // }
               this.countSSID_data.push([result.vap_name,result.client_count]);
              // this.xAxisNames.push([result.vap_name]);
               this.fillColor(result.vap_name,result.client_count,this.count);   
                 this.count = this.count+1; 
              }
              this.callingFn('clientsSsid',null);
        }
       
    });
   }

  setIntervalForChart(){
       this.timer = IntervalObservable.create(this.timerInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
       this.loadData();
      });
}

fillColor(name,data,count){
   // if(data){
  this.color_data.push({name:name,y:data,color:this.colorArray[count]})
    this.xAxisNames =[]; 
    //this.xAxisNames.push([name]);
  //  }  
}

callingFn(str,titleText){
let t =this;
if(str == "clientsSsid"){
this.clientsSsid = new Chart({
    chart: {
      type: 'column'
    },
    // title: {
    //   text: titleText
    // },
    legend: {
        enabled: false
    },
    credits: {
      enabled: false
    },
    plotOptions: {
    column: {
    minPointLength: 3
  },
  line: {
    lineWidth: 1,
    softThreshold: false
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
        text: 'SSID'
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
    //  for(let result of this.apCountSSIDGroups){
    //   this.xAxisNames.push([result.vap_name]);
    //  } 
    setTimeout(() => {
      this.setIntervalForChart();    
        this.graphdata = obj; }, 500);
}

visibleChange(obj){
    //this.titleText = null;
    // this.alive = true; 
    // this.xAxisNames =[];
    if(!this.timer.isStopped) {
     this.timer.unsubscribe();
     }  
     this.loadData();
     this.setIntervalForChart();    
}

  ngOnDestroy() {
     this.alive = false;
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

}
