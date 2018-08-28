import {Component, OnInit, ElementRef, Input, OnChanges, SimpleChange, Output, EventEmitter} from '@angular/core';
import {Chart} from 'angular-highcharts';
import {WebserviceService} from '../../../../../../services/commonServices/webservice.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import { NotificationService,commonMessages} from '../../../../../../services/notificationService/NotificationService';
import 'rxjs/add/operator/catch';
@Component({
  selector: 'app-downlink-taffic',
  templateUrl: './downlink-taffic.component.html',
  styleUrls: ['./downlink-taffic.component.css']
})
export class DownlinkTafficComponent implements OnInit {
  @Input() apMac: string;
  @Input() scale: string;
  @Input() range: string;
  public tableView = true;
  public downlinkData;
  public uplinkData;
  public totalData;
  public timeData;
  public timeStamp = 'hour';
  public timestamp;
  public selectedRange = 'total';
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
  public downlinkLatest;
  public uplinkLatest;
  public totalLatest;
  public unit;
  public previousUnit;
  public newUnit;
  public noDataMsg = '';

  constructor(private _service: WebserviceService, private elRef: ElementRef, private spinnerService: Ng4LoadingSpinnerService, private notifyPopup : NotificationService) {
  }

  init(timeFlag) {
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
            let x1, x2, x3, y, u;
            t.previousUnit = t.unit;
            t.timerVar = setInterval(function () {
              t._service.getWeb('statistics/down-link-traffic-group/?scale=' + timeFlag + '&time=' + t.timestamp + '&group=' + t.selectedMac + '', '', '').then(_data => {

                if (_data.unit != t.previousUnit) {
                  t.loadData('hour', '');
                  clearInterval(t.timerVar);
                }
                this.apiResult = _data.result;
                let apiLength = this.apiResult[0].length;

                x1 = parseFloat(this.apiResult[this.selectedRange == 'total' ? 1 : this.selectedRange == 'avg' ? 4 : this.selectedRange == 'min' ? 7 : 10][apiLength - 1]);
                x2 = parseFloat(this.apiResult[this.selectedRange == 'total' ? 2 : this.selectedRange == 'avg' ? 5 : this.selectedRange == 'min' ? 8 : 11][apiLength - 1]);
                x3 = parseFloat(this.apiResult[this.selectedRange == 'total' ? 3 : this.selectedRange == 'avg' ? 6 : this.selectedRange == 'min' ? 9 : 12][apiLength - 1]);
                y = parseFloat(this.apiResult[0][apiLength - 1]);
                t.timestamp = y;
                u = _data.unit;
                t.xlabel.push(y);
                let shift = false;
                if (t.xlabel.length > t.number_points) {
                  shift = true;
                }
                if (t.xlabel.length <= t.number_points) {
                  shift = false;
                }
                if (t.xlabel.length > 12) {
                  t.steps = 2;
                }
                series1.addPoint([t.convertTime(y), x1], true, shift);
                series2.addPoint([t.convertTime(y), x2], true, shift);
                series3.addPoint([t.convertTime(y), x3], true, shift);
                series1.update({name: ' Total (' + x1 + ' ' + t.unit + ')'});
                series2.update({name: '<i class=\'down icon icon-download-arrow\'></i> Downlink (' + x2 + ' ' + u + ')'});
                series3.update({name: '<i class=\'up icon icon-up-arrow-1\'></i> Uplink (' + x3 + ' ' + u + ')'});

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
          step: this.steps,
          formatter: function () {
            /*var time = t.convertTime(t.xlabel[t.timeFlag]);
            t.timeFlag++;*/
            var label = t.convertTime(t.xlabel[this.value]);

            if (label == 'NaN:aN:aN' || label == 'NaN:aN' || label == 'Invalid') {
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
        minRange: 0.1,
        showLastLabel: false,
        title: {
          text: '(' + this.unit + ')'
        },
        labels: {
          formatter: function () {
            return this.value;
          }
        }
      },
      tooltip: {
        formatter: function () {
          var label = t.convertTime(t.xlabel[this.x]);
          if (label == 'NaN:aN:aN' || label == 'NaN:aN') {
            label = '';
          }
          return 'Time : <b>' + label + '</b><br/>' + (this.series.name.replace(/<\/?[^>]+(>|$)/g, '')).split(' ')[1] + ' : <b>' + this.y.toFixed(2) + ' ' + t.unit + '</b>';

        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'top',
        symbolWidth: 10,
        useHTML: true
      },
      plotOptions: {
        series: {
          marker: {
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
        name: ' Total (' + this.totalData[this.totalData.length - 1] + ' ' + t.unit + ')',
        data: this.totalData,
        color: '#f4516c'
      },
        {
          name: '<i class="down icon icon-download-arrow"></i> Downlink (' + this.downlinkData[this.downlinkData.length - 1] + ' ' + t.unit + ')',
          data: this.downlinkData,
          color: '#00c5dc'
        },
        {
          name: '<i class="up icon icon-up-arrow-1"></i> Uplink (' + this.uplinkData[this.uplinkData.length - 1] + ' ' + t.unit + ')',
          data: this.uplinkData,
          color: '#ffb822'
        }]
    });
  }

  selectedScale;
  timeInterval = 300000;
;
  number_points = 12;
  steps = 1;

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.apMac) {
      this.selectedMac = changes.apMac.currentValue;
    } else {
      this.selectedMac = this.apMac;
    }
    if (changes.range) {
      this.selectedRange = changes.range.currentValue;
    } else {
      this.selectedRange = 'total';
    }
    if (changes.scale) {
      this.scale = changes.scale.currentValue;
      this.selectedScale = changes.scale.currentValue;
      if (this.selectedScale == '' || this.selectedScale == undefined) {
        this.selectedScale = 'hour';
      }
      // this.drawGraph(this.selectedScale);
      if (this.selectedScale == 'hour') {
        this.timeInterval = 300000;
        this.number_points = 12;
        this.steps = 1;
      }
      if (this.selectedScale == 'day') {
        this.timeInterval = 300000;
        this.number_points = 24;
        if (this.timeData) {
          if (this.timeData.length > 12) {
            this.steps = 2;
          } else {
            this.steps = 1;
          }
        }

      }
      clearInterval(this.timerVar);
    } else {
      this.scale = this.scale;
    }
    this.drawGraph(this.selectedScale);
  }

  ngOnInit() {
    // this.loadData('live','');
    //this.drawGraph(this.timeStamp);
  }

  loadData(param, status) {
    // this.spinnerService.show();
    this._service.getWeb('statistics/down-link-traffic-group/?scale=' + param + '&group=' + this.selectedMac + '', '', '').then(_data => {
      console.log(_data);
      if (_data.status != 0) {
        this.timeData = _data.result[0];
        this.totalData = _data.result[this.selectedRange == 'total' ? 1 : this.selectedRange == 'avg' ? 4 : this.selectedRange == 'min' ? 7 : 10];
        this.downlinkData = _data.result[this.selectedRange == 'total' ? 2 : this.selectedRange == 'avg' ? 5 : this.selectedRange == 'min' ? 8 : 11];
        this.uplinkData = _data.result[this.selectedRange == 'total' ? 3 : this.selectedRange == 'avg' ? 6 : this.selectedRange == 'min' ? 9 : 12];

        this.xlabel = _data.result[0];
        this.timestamp = this.timeData[this.timeData.length - 1];
        this.unit = _data.unit;


        // this.previousUnit = this.unit;
        this.init(param);
        this.noDataMsg = '';

      } else {
        this.noDataMsg = _data.msg;
        clearInterval(this.timerVar);
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }


  drawGraph(obj) {
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
    let dt = new Date(date * 1000);
    var hours = dt.getHours();
    var minutes = '0' + dt.getMinutes();
    var seconds = '0' + dt.getSeconds();
    var formattedTime;
    if (this.selectedScale == 'live') {
      formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    } else {
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
    //  if(this.spinnerService){
    //   this.spinnerService.hide();
    // }
  }
}