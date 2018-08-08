import { Component, OnInit,Input } from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';

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

   @Input()
  set visibleStatus(value: boolean) {
     if(value){
        this.callingFn('groupsTop',null);
     }
   } 

  constructor(private _service: WebserviceService) { }

  ngOnInit() {
         
  }


   callingFn(str,titleText){
let t =this;
 if(str == "groupsTop"){

               this._service.getWeb('statistics/wlc-dashboard-info/', '', '').then(_result => {
           if (_result && _result.length > 0) {
              this.result_data = _result;
              if(_result.status != 0){
                this.emsIP = _result[0]['ems']['ems_ip'];
              this.primary_name = _result[0]['primary_wlc_name'];
              this.primary_IP = _result[0]['primary_wlc_ip'];
              this.secondry_name = _result[0]['secondary_wlc']['wlc_name'];
              this.secondry_IP = _result[0]['secondary_wlc']['wlc_ip'];
              this.redundancy_enable = _result[0]['secondary_wlc']['redundancy_enable'];
              }
              
             
             
             // console.log(this.emsIP+"////"+this.primary_name);
        }
    });
}

}



}
