import { Component, OnInit, ElementRef, Input , OnChanges, SimpleChange,Output,EventEmitter} from '@angular/core';
import { Chart } from 'angular-highcharts';
import { WebserviceService } from '../../../../../../services/commonServices/webservice.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NotificationService,commonMessages} from '../../../../../../services/notificationService/NotificationService';
import 'rxjs/add/operator/catch'; 
@Component({
  selector: 'app-online-ap',
  templateUrl: './online-ap.component.html',
  styleUrls: ['./online-ap.component.css']
})
export class OnlineApComponent implements OnInit { 
    @Input() apMac: string;
    @Input() scale: string;
    @Input() range: string;
    public tableView = true;
    public online;
    public offline;
    public totalAP;
    public timeData;
    chart: Chart;
    public tempData: any = [];
    public apiResult: any = [];
    public timerVar: any;
    public xlabel: any;
    public liveFlag: boolean = false;
    public isopened: boolean = false;
    public regApDetails;
    public selectedMac;
    public selectedAp;
    public initalMac;
    public timeStamp = 'hour';
    public noDataMsg = '';
    public timestamp;
    selectedScale;
    timeInterval  = 300000;;
    number_points = 12;
    steps = 1;
    public selectedRange = 'total';
    constructor(private _service: WebserviceService, private elRef: ElementRef,private spinnerService: Ng4LoadingSpinnerService, private notifyPopup : NotificationService) { }
    init(timeFlag) {console.log('here')
        var t = this;
        this.chart = new Chart({
          chart: {
            type: 'line',
            height: 300,
            events: {
              load: function () {

                //if (t.liveFlag == true) {
                  var series1 = this.series[0];
                  var series2 = this.series[1];
                  var series3 = this.series[2];
                  var c = this;

                  t.timerVar = setInterval(function () {
                    t._service.getWeb('statistics/online-aps-per-group/?group=' + t.selectedMac +'&scale='+timeFlag+'&time='+t.timestamp+'', '', '').then(_data => {
                    this.apiResult = _data.result;
                    let apiLength = this.apiResult[0].length;
                    let x1,x2,x3,y;
                    x1 = parseFloat(this.apiResult[this.selectedRange == 'total'?1:this.selectedRange == 'avg'?4:this.selectedRange == 'min'?7:10][apiLength-1][apiLength-1]);
                    x2 = parseFloat(this.apiResult[this.apiResult[this.selectedRange == 'total'?2:this.selectedRange == 'avg'?5:this.selectedRange == 'min'?8:11][apiLength-1]][apiLength-1]);
                    x3 = parseFloat(this.apiResult[this.selectedRange == 'total'?3:this.selectedRange == 'avg'?6:this.selectedRange == 'min'?9:12][apiLength-1]);
                    y = parseFloat(this.apiResult[0][apiLength-1]);
                    t.timestamp = y;
                    t.xlabel.push(y);
                    let shift = false;
                      if(t.xlabel.length > 12){
                        shift = true;
                      }
                    series1.addPoint([t.convertTime(y), x1], true, shift);
                    series2.addPoint([t.convertTime(y), x2], true, shift);
                    series3.addPoint([t.convertTime(y), x3], true, shift);
                    t.tempData = this.apiResult;
                    }).catch((error) => {
                      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
                    });
                    // console.log(series1);
                  }, t.timeInterval);
                //}
               // t.spinnerService.hide();
              }
            }
          },
          title: {
            text: ''
          },
          credits: {
            enabled: false
          },
          xAxis: {
            gridLineWidth: 1,
            labels: {
              formatter: function () {
                /*var time = t.convertTime(t.xlabel[t.timeFlag]);
                t.timeFlag++;*/
                var label = t.convertTime(t.xlabel[this.value]);

                if (label == 'NaN:aN:aN' ||label == 'NaN:aN' || label == 'Invalid') {
                  label = '';
                }
                return label;
              }
            }
          },
          yAxis: {

            minPadding: 0, 
            maxPadding: 0,         
            min: 0, 
            minRange : 0.1,
            allowDecimals: false,
            title: {
              text: null
            },
            labels: {
              formatter: function () {
                return this.value ;
              }
            }
          },
          tooltip: {
            formatter: function () {
              var label = t.convertTime(t.xlabel[this.x]);
              if (label == 'NaN:aN:aN' || label == 'NaN:aN') {
                label = '';
              }
              return 'Time : <b>' + label + '</b><br/>' + this.series.name + ' : <b>' + this.y + '</b>';

            }
          },
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            symbolWidth: 10
        },
          plotOptions: {
            series: {
              marker : {
                fillColor: '#FFFFFF',
                lineWidth: 2,
                lineColor: null,
                radius: 6,
                symbol: 'circle'
            }
            },
            line: {
              lineWidth: 1,
              softThreshold: false
          }
        },
          series: [{
            name: 'Total',
            data: this.totalAP,
            color: '#716aca'
          },
          {
            name: 'Online',
            data: this.online,
            color: '#34bfa3'
          },
          {
            name: 'Offline',
            data: this.offline,
            color: '#fa894e'
          }]
        });
      }
   
      ngOnChanges(changes: {[propKey: string]: SimpleChange}) {console.log('here');
        if(changes.apMac){
          this.selectedMac = changes.apMac.currentValue;
        }else{
          this.selectedMac = this.apMac;
        }
        if(changes.range){
          this.selectedRange = changes.range.currentValue;
          if(this.selectedRange == '' || this.selectedRange == undefined){
            this.selectedRange = 'total';
            }
        }else{
          this.selectedRange = 'total';
        }
        if(changes.scale){
          this.scale = changes.scale.currentValue;
          this.selectedScale = changes.scale.currentValue;
          if(this.selectedScale == '' || this.selectedScale == undefined){
          this.selectedScale = 'hour';
          }
         // this.drawGraph(this.selectedScale); 
          if(this.selectedScale == 'hour'){
          this.timeInterval = 300000;
          this.number_points = 12;
          this.steps = 1;
          }
          if(this.selectedScale == 'day'){
          this.timeInterval = 300000;
          this.number_points = 24;
          if(this.timeData){
            if(this.timeData.length > 12){
          this.steps = 2;
          }else{
          this.steps = 1;
          }
        }
        
      }
      clearInterval(this.timerVar);
      }else{
      this.scale = this.scale;
      }
      this.drawGraph(this.selectedScale); 
      }
    ngOnInit() {
   
    }

    loadData(param, status) {console.log(this.selectedRange,'range');
     // this.spinnerService.show();
        this._service.getWeb('statistics/online-aps-per-group/?group=' + this.selectedMac + '&scale='+param+'', '', '').then(_data => {
          if (_data.status!=0) {
            this.apiResult = _data.result;
            let apiLength =  this.apiResult[0].length;
            this.timeData = this.apiResult[0];
            this.totalAP = this.apiResult[this.selectedRange == 'total'?1:this.selectedRange == 'avg'?4:this.selectedRange == 'min'?7:10];
            this.online = this.apiResult[this.selectedRange == 'total'?2:this.selectedRange == 'avg'?5:this.selectedRange == 'min'?8:11];
            this.offline = this.apiResult[this.selectedRange == 'total'?3:this.selectedRange == 'avg'?6:this.selectedRange == 'min'?9:12];
            
           
            this.xlabel = this.apiResult[0];
            this.timestamp = this.timeData[this.timeData.length-1]
            /*if (Object.keys(this.timeData).length <13 && param !='live') {
              this.online = [];
              this.totalAP = [];
              this.xlabel = [];
              this.timeData=[];
              setTimeout(() => {
                this.chart.ref.setTitle({ text: "No Data,Come back after 2 hours" });
              }, 1000);
            }*/

           this.init(param);
           this.noDataMsg ='';
          }else{
            this.noDataMsg = _data.msg;
            clearInterval(this.timerVar);
          }
        }).catch((error) => {
          this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        });
      }


      drawGraph(obj) {console.log(obj);
        this.timeStamp = obj;
        if (obj == 'live') {
          this.liveFlag = true;
        } else {

          this.liveFlag = false;
        }
        this.loadData(obj, '');
        clearInterval(this.timerVar);
      }
      convertTime(date) {
        let dt = new Date(date*1000);
        var hours = dt.getHours();
        var minutes = "0" + dt.getMinutes();
        var seconds = "0" + dt.getSeconds();
        var formattedTime;
        if(this.selectedScale == 'live'){
          formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        }else{
          formattedTime = hours + ':' + minutes.substr(-2);
        }
        return formattedTime;
      }
      formateobject(obj) {
        var output = [];
        for (var key in obj) {
          var tempObj = {};
          tempObj[key] = obj[key];
          output.push(tempObj);
        }
        return output;
      }

      ngOnDestroy() {
        clearInterval(this.timerVar);
        //if(this.spinnerService){
        //  this.spinnerService.hide();
       // }
      }
}
