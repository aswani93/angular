import {Component, OnInit, ElementRef, Input, OnChanges, SimpleChange, Output, EventEmitter} from '@angular/core';
import {Chart} from 'angular-highcharts';
import {WebserviceService} from '../../../../../../services/commonServices/webservice.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {NotificationService, commonMessages} from '../../../../../../services/notificationService/NotificationService';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-ap-downlink-traffic',
  templateUrl: './ap-downlink-traffic.component.html',
  styleUrls: ['./ap-downlink-traffic.component.css']
})
export class ApDownlinkTrafficComponent implements OnInit {
  @Input() apMac: string;
  @Input() scale: string;
  public tableView = true;
  public downlinkData;
  public uplinkData;
  public totalData;
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
  public timeStamp = 'live';
  public downlinkLatest;
  public uplinkLatest;
  public totalLatest;
  public unit;
  public timestamp;
  public previousUnit;
  public noDataMsg = '';
  public noValArray: any = [];
  public selectedScale;
  public timeInterval = 10000;
  public number_points = 12;
  public steps = 1;

  constructor(private _service: WebserviceService, private elRef: ElementRef, private spinnerService: Ng4LoadingSpinnerService, private notifyPopup: NotificationService) {
  }

  ngOnInit() {

  }

  drawGraph(obj) {
    this.timeStamp = obj;
    if (obj == 'live') {
      this.liveFlag = true;
    } else {

      this.liveFlag = false;
    }
    this.xlabel = [];

    this.loadData(obj, '');

    clearInterval(this.timerVar);
  }

  loadData(param, status) {
    // this.spinnerService.show();
    this._service.getWeb('statistics/down-link-traffic-ap/?ap='
      + this.selectedMac + '&scale=' + param +
      '', '', '').then(_data => {

      console.log(_data);

      if (_data.status != 0) {
        this.xlabel = _data.result[0];
        this.timeData = _data.result[0];
        this.totalData = _data.result[1];
        this.downlinkData = _data.result[2];
        this.uplinkData = _data.result[3];
        this.timestamp = this.timeData[this.timeData.length - 1];
        this.unit = _data.unit;


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

  init(timeFlag) {
    let t = this;
    this.chart = new Chart({
      chart: {
        type: 'line',
        height: 300,
        events: {
          load: function () {

            // if (t.liveFlag == true) {
            var series1 = this.series[0];
            var series2 = this.series[1];
            var series3 = this.series[2];
            var c = this;
            let x1, x2, x3, y, u;
            t.previousUnit = t.unit;
            t.timerVar = setInterval(function () {

              console.log(t.timeInterval);

              t._service.getWeb('statistics/down-link-traffic-ap/?ap=' +
                t.selectedMac + '&scale=' + timeFlag + '&time=' + t.timestamp +
                '', '', '').then(_data => {

                if (_data.status != 0) {
                  if (t.previousUnit != _data.unit) {
                    t.loadData(timeFlag, '');
                    clearInterval(t.timerVar);
                  }

                  this.apiResult = _data.result;
                  let apiLength = this.apiResult[0].length;
                  for (let i = 0; i < apiLength; i++) {
                    x1 = parseFloat(this.apiResult[1][i]);   // total data.
                    x2 = parseFloat(this.apiResult[2][i]);   // total down link data.
                    x3 = parseFloat(this.apiResult[3][i]);   // total up link data.
                    y = parseFloat(this.apiResult[0][i]);    // time data i.e to be plotted on the x axis.
                    // if(x1 == 404 && x2 == 404 && x3 == 404){

                    // }
                    t.timestamp = y;
                    u = _data.unit;
                    t.unit = _data.unit;

                    t.xlabel.push(y);
                    let shift = false;
                    if (t.xlabel.length > t.number_points) {
                      shift = true;
                    }
                    if (t.xlabel.length > 12) {
                      t.steps = 2;
                    }

                    // addpoint() : API ref : addPoint(options [, redraw] [, shift] [, animation])
                    // update()  : API ref : update(options [, redraw]).

                    series1.addPoint([t.convertTime(y), x1], true, shift);
                    series2.addPoint([t.convertTime(y), x2], true, shift);
                    series3.addPoint([t.convertTime(y), x3], true, shift);

                    series1.update({name: ' Total (' + x1 + ' ' + u + ')'});
                    series2.update({name: '<i class=\'down icon icon-download-arrow\'></i> Downlink (' + x2 + ' ' + u + ')'});
                    series3.update({name: '<i class=\'up icon icon-up-arrow-1\'></i> Uplink (' + x3 + ' ' + u + ')'});
                    t.tempData = this.apiResult;
                  }


                } else {

                }
              }).catch((error) => {
                this.notifyPopup.logoutpop(commonMessages.InternalserverError);
              });


            }, t.timeInterval);
            // }
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
        color: '#f4516c',
        visible: false
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
    //if(this.spinnerService){
    //  this.spinnerService.hide();
    // }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.apMac) {
      this.selectedMac = changes.apMac.currentValue;
    }

    this.selectedScale = changes.scale.currentValue;
    if (this.selectedScale == '' || this.selectedScale == undefined) {
      this.selectedScale = 'live';
    }
    this.drawGraph(this.selectedScale);
    if (this.selectedScale == 'live') {
      this.timeInterval = 10000;
      this.number_points = 12;
      this.steps = 1;
    }
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
  }
}
