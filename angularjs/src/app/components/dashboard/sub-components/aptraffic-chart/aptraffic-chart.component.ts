import { Component, OnInit,OnDestroy,Input} from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'aptraffic-chart',
  templateUrl: './aptraffic-chart.component.html',
  styleUrls: ['./aptraffic-chart.component.css']
})
export class AptrafficChartComponent implements OnInit,OnDestroy {
   apTraffic:any;
   public graphdata;
    public titleText = null;
    alive:boolean;
    timerInterval:number = 12000;
    timer:any;

    @Input()
  set visibleStatus(value: boolean) {
     if(value){
       this.callingFn('apTraffic',null);
        this.setIntervalForChart();  
     }

   }   
  constructor(private _service: WebserviceService) { 
      this.alive = true;
  }

  ngOnInit() {
        
  }

setIntervalForChart(){
       this.timer = IntervalObservable.create(this.timerInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.callingFn('apTraffic',null);
      });
}

callingFn(str,titleText){
let t =this;
if(str == "apTraffic"){
this.apTraffic = new Chart({
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
            name: 'AP1',
            data: [1.2, 2.5, 2.6, 3.1, 6.6, 9.8,11.0, 13,16,19,23,27,32],
            color: '#F95577'
        }, {
            name: 'AP2',
            data: [0.8, 2.6, 3.1, 4.3, 6.9,9,12, 14.2,15.1,17,19,23,28],
            color: '#B8CE69'
        }, {
            name: 'AP3',
            data: [0.2, 3.6,9,10.1,12, 15.3, 17.2, 18.9,25,27,29],
            color: '#AF39DD'
        }, {
            name: 'AP4',
            data: [1.8, 4.1, 10.0, 16.3, 18.2, 19.2,21.1,23,26,27,30,37],
            color: '#FFCF0B'
        }, {
            name: 'AP5',
            data: [2.8, 5.6, 7.1, 8.3, 10.2,18, 28.2,30,34,36,40],
            color: '#09C4D3'
        }]
    // chart: {
    //   type: 'area',
    //   reflow: true
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
    //         20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
    //         26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
    //         24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
    //         21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
    //         10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
    //         5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
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
    //this.titleText = null;
    console.log('close Popup');
    // this.alive = true;  
    // this.setIntervalForChart();  
}

    ngOnDestroy() {
     this.alive = false;
    if(this.timer)
    this.timer.unsubscribe();
  }

}
