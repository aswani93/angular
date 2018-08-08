import { Component, OnInit } from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'alarm-status',
  templateUrl: './alarm-status.component.html',
  styleUrls: ['./alarm-status.component.css']
})
export class AlarmStatusComponent implements OnInit {
     alramStat : any = [];
     tabContent:any = [];
     criticalTabActive:boolean = true;
     majorTabActive:boolean = false;
     minorTabActive:boolean = false;
      alive:boolean = true;
    timerInterval:number = 20000;
    timer:any;
  constructor(private _service: WebserviceService,private _router: Router) { }

  ngOnInit() {
    this.loadData();
    this.setIntervalForChart();
  }

  loadData(){
     this._service.getWeb('events/alarms-dashboard/', '', '').then(_result => {
        if (_result && _result.result && _result.result.length > 0) {
            this.alramStat =_result.result[0];
            this.tabContent = this.alramStat.data.highest;
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

  openTab(evt, tab) {
this.criticalTabActive = false;
this.majorTabActive = false;
this.minorTabActive = false;
if(tab == 'critical'){
    this.criticalTabActive = true;
    this.tabContent = this.alramStat.data.highest;
}
if(tab == 'major'){
    this.majorTabActive = true;
    this.tabContent = this.alramStat.data.medium;
}
if(tab == 'minor'){
    this.minorTabActive = true;
    this.tabContent = this.alramStat.data.lowest;
}
}
gotoAlaramPage(data){
   let securityLevel = (data==null)?'':data;
   sessionStorage.setItem('filter','?from=&to=&deviccetype=&alarmtype=&serverityLevel='+securityLevel+'');
   this._router.navigate(['/monitor/system/alarm']);
}

  ngOnDestroy() {
     this.alive = false;
     if(this.timer)
    this.timer.unsubscribe(); 
  }
}
