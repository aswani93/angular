import { Component, OnInit,Input } from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';
@Component({
  selector: 'access-point-bottom-chart',
  templateUrl: './access-point-bottom-chart.component.html',
  styleUrls: ['./access-point-bottom-chart.component.css']
})
export class AccessPointBottomChartComponent implements OnInit {
  AccessPointsBottom:any;
  public graphdata;
    public titleText = null;
        alive:boolean;
    timerInterval:number = 10000;
    timer:any;
   @Input()
  set visibleStatus(value: boolean) {
     if(value){
      this.callingFn('AccessPointsBottom',null);
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
        this.callingFn('AccessPointsTop',null);
      });
}



callingFn(str,titleText){
let t =this;
if(str == "AccessPointsBottom"){
this.AccessPointsBottom = new Chart({
    chart: {
      type: 'line',
      zoomType: 'x'
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
           series: [{
        name: 'AP1',
        data: [1.2, 2.5, 2.6, 3.1, 2.6, 0.8],
        color: '#F95577'
    }, {
        name: 'AP2',
        data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
        color: '#B8CE69'
    }, {
        name: 'AP3',
        data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
        color: '#AF39DD'
    }, {
        name: 'AP4',
        data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
        color: '#FFCF0B'
    }, {
        name: 'AP5',
        data: [0.8, 1.6, 2.1, 1.3, 3.2, 4.2],
        color: '#09C4D3'
    }]
  });
}
}

drawGraph(obj,title){
    this.graphdata = [];
    this.titleText = title;
     if(!this.timer.isStopped) {
    this.timer.unsubscribe();
    }
    setTimeout(() => { this.callingFn(obj,title);
        this.graphdata = obj; }, 500);
}

visibleChange(obj){
    //this.titleText = null;   
}

  ngOnDestroy() {
     this.alive = false;
     if(this.timer)
    this.timer.unsubscribe(); 
  }

}
