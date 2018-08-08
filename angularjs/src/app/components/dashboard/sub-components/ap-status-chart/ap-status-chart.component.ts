import { Component, OnInit } from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import { Chart } from 'angular-highcharts';
import { Observable } from "rxjs";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';
declare var $: any

@Component({
  selector: 'ap-status-chart',
  templateUrl: './ap-status-chart.component.html',
  styleUrls: ['./ap-status-chart.component.css']
})
export class ApStatusChartComponent implements OnInit {

    apStatus :any;
    activeSlideIndex = 0;
    isApConnected = false;
    apStatGroups:any = [];
    apStatGroups_1:any = [];
    apStatGroups_2:any = [];
    numberCarousel = 0;
    apOnline = 0;
    apOffline = 0;
    apTotal= 0;
    apStatusEach;
    apOnlineEach;
    apOfflineEach;
    isApsysConnected = false;
    public graphdata;
    public titleText = null;
    barCart:any;
    online_data=[];
    offline_data=[];
    xAxisNames=[];

      alive:boolean = true;
    initialtimerInterval:number = 300000;
    timerInterval:number = 300000;
    timer:any;
    showDialogsetting:boolean = false;
    initialOfflineColor = '#cc0000';
    initialOnlineColor = '#3bb300';
    offlineColor = '#cc0000';
    onlineColor = '#3bb300';
  constructor(private _service: WebserviceService) { }

  ngOnInit() {

       
   $('.group-list').owlCarousel({
            loop:true,
            margin:15,
            nav:true,
            items:1,
            dots: false,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:1
                },
                1000:{
                    items:1
                }
            }
         });
       this.loadData();
       this.setIntervalForChart();
  }

  loadData(){
        this._service.getWeb('statistics/ap-status-dashboard/', '', '').then(_result => {
          // _result = {"total_online":9,"total_offline":10,"result":[{"offline_ap":2,"online_ap":1,"group_name":"HFCL_110401"},{"offline_ap":5,"online_ap":2,"group_name":"DATA_WLC"},{"offline_ap":3,"online_ap":7,"group_name":"new-gcp-2"},{"offline_ap":6,"online_ap":0,"group_name":"ap1-group"},{"offline_ap":5,"online_ap":9,"group_name":"new-group"},{"offline_ap":5,"online_ap":0,"group_name":"DATA_AP"},{"offline_ap":5,"online_ap":0,"group_name":"DATA_AP"},{"offline_ap":5,"online_ap":1,"group_name":"DATA_AP"},{"offline_ap":5,"online_ap":1,"group_name":"DATA_AP"},{"offline_ap":5,"online_ap":5,"group_name":"DATA_AP"}],"total_aps":1,"status":"1"} 
        if (_result) {
            this.apStatGroups =_result.result;
            if(this.apStatGroups && this.apStatGroups.length > 0){
            this.apOnline = _result.total_online;
            this.apOffline = _result.total_offline;
            if(this.apOnline!=0 || this.apOffline!=0){
                this.isApsysConnected = true;
            }
            this.apTotal = _result.total_aps;
            this.apOnlineEach = this.apStatGroups[this.activeSlideIndex].online_ap;
            this.apOfflineEach = this.apStatGroups[this.activeSlideIndex].offline_ap;
            if(this.apOnlineEach!=0 || this.apOfflineEach!=0){ 
                this.isApConnected = true;
            }else{
                this.isApConnected = false;
            }
            let idx = 0;
            for(let i of this.apStatGroups){
                idx = idx+1;
                if(idx<=5){
                    this.apStatGroups_1.push(i);
                }else{
                    this.apStatGroups_2.push(i);
                }

            }
            this.callingFn('apStatus',null);
            this.callingFn('apStatusEach',null);
        }
        else{
           this.isApsysConnected = false;
           this.apTotal = 0;  
        }
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


  callingFn(str,titleText){
let t =this;
 if(str == "apStatus"){
    this.apStatus = new Chart({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
                    events: {
          load: function () {
           document.getElementById("online_id").style.background =t.onlineColor;
          document.getElementById("offline_id").style.background =t.offlineColor;    
    }
        }},
        title: {
            text:'<i class="icon icon-router1 title-icon"></i><p class="innerText">Access Points</p><ul class="devices-status"> <li class="fill-circle"><span class="connected-device" id="online_id"></span>'+t.apOnline+'</li> <li class="fill-circle"><span class="disconnected-device" id="offline_id""></span>'+t.apOffline+'</li> </ul>',
            align: 'center',
            verticalAlign: 'middle',
            y: -30,
            useHTML: true
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
             dataLabels: {
               enabled: false
             },
             borderWidth: 0
           }
        },
        series: [{
            type: 'pie',
            name: 'Access Point',
            innerSize: '85%',
            data: [
                ['Online', t.apOnline],
                ['Offline', t.apOffline],
            ]
        }],
        colors: [t.onlineColor,t.offlineColor]
      });
    
}else if(str == "apStatusEach"){
    this.apStatusEach = new Chart({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            events: {
                
            },
        },
        title: {
            text: '',
            align: 'center',
            verticalAlign: 'middle',
            y: -30,
            useHTML: true
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.y}</b>'
        },
        plotOptions: {
            pie: {
             dataLabels: {
               enabled: false
             },
             borderWidth: 0
           },
           series: {
            point: {
                events: {
                    mouseOver: function () {
                        //t.apStatusEach.chart.setTitle({ text: 'New title '});
                       t.apStatusEach.ref.setTitle('xsds');
                    }
                }
            }
        }
        },
        series: [{
            type: 'pie',
            name: 'Access Point',
            innerSize: '50%',
            data: [
                ['Online', t.apOnlineEach],
                ['Offline', t.apOfflineEach],
            ],
        }],
        colors: [t.onlineColor,t.offlineColor]

      });
    
}

}


ShowLineChart(str,titleText){
let t =this;
if(str == "apStatus"){
this.barCart= new Chart({
    chart: {
      type: 'column'
    },
    title: {
      text: titleText
    },
    credits: {
      enabled: false
    },
    xAxis: {
    categories:t.xAxisNames,
     title: {
        text: 'Group'
    }
    },
  yAxis: {
    allowDecimals: false,
    // labels: {
    //     style: {
    //         fontSize: '9px',
    //         width: '175px'
    //     }
    // },
    title: {
        text: 'AP Count'
    }
},
        series: [{
        name: 'Offline',
        data: t.offline_data,
        color: t.offlineColor
    }, {
        name: 'Online',
        data: t.online_data,
        color: t.onlineColor
    }]
  });
}
}
 

drawGraph(obj,title){
    this.graphdata = [];
    this.online_data = [];
    this.offline_data = [];
    this.xAxisNames = [];
    this.titleText = title;
    this.alive = false;
    console.log("//////"+this.apStatGroups);
    for(let result of this.apStatGroups){
       this.online_data.push([result.group_name,result.online_ap]);
       this.offline_data.push([result.group_name,result.offline_ap])
       this.xAxisNames.push([result.group_name])   
 }
    setTimeout(() => { this.ShowLineChart(obj,title);
        this.graphdata = obj; }, 500);
}


ChangeGroup(indx){
   
    this.activeSlideIndex = indx;
    this.apOnlineEach = this.apStatGroups[this.activeSlideIndex].online_ap;
    this.apOfflineEach = this.apStatGroups[this.activeSlideIndex].offline_ap;
    if(this.apOnlineEach!=0 || this.apOfflineEach!=0){
       
        this.isApConnected = true;
        this.callingFn('apStatusEach',null);
    }else{
        this.isApConnected = false;
    }
   
}

visibleChange(obj){
    //this.titleText = null;
    this.alive = true;
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
     this.onlineColor = event.onlinecolor;
     this.offlineColor = event.offlinecolor;
      this.timerInterval = event.timer;
     this.loadData();
  }


}
