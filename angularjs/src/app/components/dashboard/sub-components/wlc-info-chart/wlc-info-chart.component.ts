import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'wlc-info-chart',
  templateUrl: './wlc-info-chart.component.html',
  styleUrls: ['./wlc-info-chart.component.css']
})
export class WlcInfoChartComponent implements OnInit {
     result_data:any;
     emsIP:any;
     primary_name:any;
     primary_IP:any;
     secondry_name:any;
     secondry_IP:any;
     redundancy_enable:any;
    timerInterval:number = 60000;
    initialtimerInterval:number = 60000;
    timer:any;
    showDialogsetting:boolean = false;
    titleText:any;
    alive:boolean = true;
    chartBoolStatus:boolean = false;
   @Input()
  set visibleStatus(value: boolean) {
     if(value){
        this.callingFn('groupsTop',null);
     }
   } 
 @Input()
 set data(data: any) {
     if(data){
     this.initialtimerInterval=data.refresh_interval;
     this.timerInterval = data.refresh_interval;
     }
   }
@Output() deleteWidget: EventEmitter<any> = new EventEmitter<any>();
  
  constructor(private _service: WebserviceService) { }

  ngOnInit() {
         
  }

 setIntervalForChart(){
       this.timer = IntervalObservable.create(this.timerInterval)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.callingFn('groupsTop',null);
      });
}

callingFn(str,titleText){
let t =this;
 if(str == "groupsTop"){

               this._service.getWeb('statistics/wlc-dashboard-info/', '', '').then(_result => {
           if (_result && _result.length > 0) {
              this.result_data = _result;
              if(_result.status != 0){
                this.chartBoolStatus = true;
                this.emsIP = _result[0]['ems']['ems_ip'];
              this.primary_name = _result[0]['primary_wlc_name'];
              this.primary_IP = _result[0]['primary_wlc_ip'];
              this.secondry_name = _result[0]['secondary_wlc']['wlc_name'];
              this.secondry_IP = _result[0]['secondary_wlc']['wlc_ip'];
              this.redundancy_enable = _result[0]['secondary_wlc']['redundancy_enable'];
              }else{
                this.chartBoolStatus = false;
              }
              
             
             
             // console.log(this.emsIP+"////"+this.primary_name);
        }
    });
}

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
      this.callingFn('groupsTop',null);
  }


      /*---------delete widget-----*/
  delete(val){
   this.deleteWidget.emit({id:val});
  }




}
