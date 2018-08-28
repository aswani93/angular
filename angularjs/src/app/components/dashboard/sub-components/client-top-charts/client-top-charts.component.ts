import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'client-top-charts',
  templateUrl: './client-top-charts.component.html',
  styleUrls: ['./client-top-charts.component.css']
})
export class ClientTopChartsComponent implements OnInit {
      clientsTop:any;
      public graphdata;
    public titleText = null;
     alive:boolean;
    timerInterval:number = 12000;
    timer:any;
         @Input()
  set visibleStatus(value: boolean) {
     if(value){
       //console.log("client Top"+value);
      this.callingFn('clientsTop',null);
      this.setIntervalForChart();  
     }

   } 
@Output() deleteWidget: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _service: WebserviceService) {
      this.alive = true;
   }

  ngOnInit() {
   
  }

setIntervalForChart(){
       this.timer = IntervalObservable.create(this.timerInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.callingFn('clientsTop',null);
      });
}

callingFn(str,titleText){
let t =this;
if(str == "clientsTop"){
    this.clientsTop = new Chart({
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
     xAxis: {
    categories:['Client1','Client2','Client3','Client4'],
     lineWidth: 0,
   minorGridLineWidth: 0,
   lineColor: 'transparent',         
   labels: {
       enabled: true
   },
   minorTickLength: 0,
   tickLength: 0,
     title: {
        text: 'Clients'
    }
    },
     yAxis: {
    allowDecimals: false,
    title: {
        text: 'Mbps'
    }
},
        series: [{
        name: 'Client',
        data:[{name:'Client1',y:2, color: '#cc0000'},{name:'Client2',y:3,color: '#3bb300'},{name:'Client3',y:6, color: '#F95577'},{name:'Client4',y:9, color: '#B8CE69'}],
       
    }]
      });
    
}
} 

drawGraph(obj,title){
    this.graphdata = [];
    this.titleText = title;
    // this.alive = false; 
    //  if(!this.timer.isStopped) {
    // this.timer.unsubscribe();
    // }
    setTimeout(() => { this.callingFn(obj,title);
        this.graphdata = obj; }, 500);
}

visibleChange(obj){
  // this.alive = true;
  // this.setIntervalForChart(); 
    //this.titleText = null;   
}

  ngOnDestroy() {
     this.alive = false;
     if(this.timer)
    this.timer.unsubscribe();
  }
      /*---------delete widget-----*/
  delete(val){
    if(this.timer)
    this.timer.unsubscribe();
   this.deleteWidget.emit({id:val});
  }

}
