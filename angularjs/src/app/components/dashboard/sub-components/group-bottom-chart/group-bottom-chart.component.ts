import { Component, OnInit,Input } from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'group-bottom-chart',
  templateUrl: './group-bottom-chart.component.html',
  styleUrls: ['./group-bottom-chart.component.css']
})
export class GroupBottomChartComponent implements OnInit {
 groupsBottom:any;
 public graphdata;
  public titleText = null;
  alive:boolean;
  timer:any;
  timerInterval:9000;
    @Input()
  set visibleStatus(value: boolean) {
     if(value){
        this.callingFn('groupsBottom',null);
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
        this.callingFn('groupsBottom',null);
      });
}


callingFn(str,titleText){
let t =this;
if(str == "groupsBottom"){
 this.groupsBottom = new Chart({
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
           series: [ {
        name: 'AP3',
        data: [0.8, 1.6, 2.1, 5.3, 3.2, 6.2],
        color: '#AF39DD'
    }, {
        name: 'AP4',
        data: [0.8, 1.6, 2.1, 0.3, 3.2, 4.2],
        color: '#FFCF0B'
    }, {
        name: 'AP5',
        data: [0.8, 1.6, 2.8, 2.3, 3.4, 4.2],
        color: '#09C4D3'
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
    //this.titleText = null;   
}

 ngOnDestroy() {
     this.alive = false;
     if(this.timer)
    this.timer.unsubscribe();
  }


}
