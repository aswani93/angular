import { Component, OnInit } from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'access-point-chart',
  templateUrl: './access-point-chart.component.html',
  styleUrls: ['./access-point-chart.component.css']
})
export class AccessPointChartComponent implements OnInit {
    AccessPointsTop:any;
    public graphdata;
    public titleText = null;
     alive:boolean;
    timerInterval:number = 10000;
    timer:any;
  constructor(private _service: WebserviceService) { 
      this.alive = true;
  }

  ngOnInit() {
    this.callingFn('AccessPointsTop',null);
     this.setIntervalForChart();  
  }
setIntervalForChart(){
       this.timer = IntervalObservable.create(this.timerInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.callingFn('AccessPointsTop',null);
      });
}

callingFn(str,titleText){
let t =this;
if(str == "AccessPointsTop"){
    // this.AccessPointsTop = new Chart({
    //     chart: {
    //       type: 'line'
    //     },
    //     title: {
    //       text: titleText
    //     },
    //     credits: {
    //       enabled: false
    //     },
    //         series: [{
    //         name: 'AP1',
    //         data: [1.2, 2.5, 2.6, 3.1, 2.6, 0.8],
    //         color: '#F95577'
    //     }, {
    //         name: 'AP2',
    //         data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
    //         color: '#B8CE69'
    //     }, {
    //         name: 'AP3',
    //         data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
    //         color: '#AF39DD'
    //     }, {
    //         name: 'AP4',
    //         data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
    //         color: '#FFCF0B'
    //     }, {
    //         name: 'AP5',
    //         data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
    //         color: '#09C4D3'
    //     }]
    //   });

      this.AccessPointsTop= new Chart({
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
    categories:['AP1','AP2','AP3','AP4'],
     lineWidth: 0,
   minorGridLineWidth: 0,
   lineColor: 'transparent',         
   labels: {
       enabled: true
   },
   minorTickLength: 0,
   tickLength: 0,
     title: {
        text: 'Access Points'
    }
    },
     yAxis: {
    allowDecimals: false,
    title: {
        text: 'Mbps'
    }
},
        series: [{
        name: 'AP',
        data:[{name:'AP1',y:8, color: '#cc0000'},{name:'AP2',y:3,color: '#3bb300'},{name:'AP3',y:2, color: '#F95577'},{name:'AP4',y:9, color: '#B8CE69'}],
       
    }]
  });
}
}

drawGraph(obj,title){
    this.graphdata = [];
    this.titleText = title;
    this.alive = false;
    console.log(this.timer.isStopped)
    if(!this.timer.isStopped) {
    this.timer.unsubscribe();
    }
    setTimeout(() => { this.callingFn(obj,title);
        this.graphdata = obj; }, 500);
}

visibleChange(obj){
      this.alive = true;
      this.setIntervalForChart();  
    //this.titleText = null;   
}

  ngOnDestroy() {
     this.alive = false;
     if(this.timer)
    this.timer.unsubscribe();
  }

}
