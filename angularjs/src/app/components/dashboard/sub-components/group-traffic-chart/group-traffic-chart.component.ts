import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';
@Component({
  selector: 'group-traffic-chart',
  templateUrl: './group-traffic-chart.component.html',
  styleUrls: ['./group-traffic-chart.component.css']
})
export class GroupTrafficChartComponent implements OnInit {
  groupTraffic:any;
   public graphdata;
    public titleText = null;
    alive:boolean;
    timerInterval:number = 10000;
    timer:any;
   @Input()
  set visibleStatus(value: boolean) {
     if(value){
      this.callingFn('groupTraffic',null);
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
        this.callingFn('groupTraffic',null);
      });
}

callingFn(str,titleText){
let t =this;
if(str == "groupTraffic"){
this.groupTraffic = new Chart({
      chart: {
          type: 'spline',
          zoomType: 'x'
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        xAxis: {
        categories:['10:00','10:05','10:10','10:15','10:20','10:25','10:30','10:35','10:40','10:45','10:50','10:55','11:00'],
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',         
        labels: {
        enabled: true
        },
        minorTickLength: 0,
        tickLength: 0,
        title: {
        text: 'Time'
        }
        },
        yAxis: {
        allowDecimals: false,
        title: {
        text: 'MB'
        }
        },
            series: [{
            name: 'G1',
            data: [1.0, 2.5, 4.6, 6.1, 8.6, 9.8,12,14,18,21,24,30],
            color: '#F95577'
        }, {
            name: 'G2',
            data: [2.0, 3.6, 5.1, 7.3, 9.9, 14.2,16,19,20,23,27],
            color: '#B8CE69'
        }, {
            name: 'G3',
            data: [3.0, 4.6, 6.1, 8.3, 10.2, 16.9,20,24,28,35],
            color: '#AF39DD'
        }, {
            name: 'G4',
            data: [4.0, 5.1, 7.0, 10.3, 13.2,18.2,24,28,33,38],
            color: '#FFCF0B'
        }, {
            name: 'G5',
            data: [5.0, 6.6, 8.1, 11.3, 15.2,20.2,28,33,35,39,45],
            color: '#09C4D3'
        }]
    // chart: {
    //   type: 'area'
    // },
    // title: {
    //   text: titleText
    // },
    // credits: {
    //   enabled: false
    // },
    //     series: [{
    //     name: 'T 1',
    //     data:[
    //         null, null, null, null, null, 6, 11, 32, 110, 235,
    //         369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
    //         21434, 24126, 27387, 29459, 31056, 31982, 32040, 11233, 29224, 27342,
    //         25662, 26956, 27912, 28999, 28965, 21826, 25579, 25722, 24826, 24605,
    //         21304, 23464, 23708, 22099, 24357, 24237, 21401, 24344, 23586, 22380,
    //         21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
    //         12577, 10527, 10475, 10421, 10358, 10295, 10104, 9014, 9620, 9326,
    //         5113, 5213, 4954, 4604, 4761, 4717, 4368, 4018
    //     ],
    //     color: '#F95577'
    // }, {
    //     name: 'T 2',
    //     data: [null, null, null, null, null, null, null, null, null, null,
    //         5, 25, 50, 120, 150, 200, 426, 660, 869, 1060,
    //         1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538,
    //         11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935,
    //         30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000,
    //         37000, 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
    //         21000, 20000, 19000, 18000, 18000, 17000, 16000, 15537, 14162, 12787,
    //         12600, 11400, 5500, 4512, 4502, 4502, 4500, 4500
    //     ],
    //     color: '#B8CE69'
    // }, {
    //     name: 'T 3',
    //     data: [null, null, null, null, null, null, null, null, null, null,
    //         5, 25, 50, 120, 150, 200, 426, 660, 869, 1060,
    //         1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538,
    //         11643, 14092, 14478, 11915, 17385, 19055, 22205, 23044, 25393, 27935,
    //         30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000,
    //         37000, 35000, 33000, 31000, 29000, 23000, 24000, 24000, 23000, 22000,
    //         21000, 20000, 19000, 18000, 18000, 17000, 16000, 15537, 14162, 12787,
    //         12600, 11400, 5500, 4512, 4502, 4502, 4500, 4500
    //     ],
    //     color: '#AF39DD'
    // }]
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
