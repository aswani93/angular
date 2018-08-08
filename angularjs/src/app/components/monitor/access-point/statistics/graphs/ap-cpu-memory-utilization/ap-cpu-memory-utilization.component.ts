import {Component, OnInit, ElementRef, Input, OnChanges, SimpleChange} from '@angular/core';
import {Chart} from 'angular-highcharts';
import {WebserviceService} from '../../../../../../services/commonServices/webservice.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import { NotificationService,commonMessages} from '../../../../../../services/notificationService/NotificationService';
import 'rxjs/add/operator/catch'; 

@Component({
  selector: 'app-ap-cpu-memory-utilization',
  templateUrl: './ap-cpu-memory-utilization.component.html',
  styleUrls: ['./ap-cpu-memory-utilization.component.css']
})
export class ApCpuMemoryUtilizationComponent implements OnInit, OnChanges {
  @Input() apMac: string;
  @Input() scale: string;
  public tableView = true;
  public cpuData;
  public memoryData;
  public timeData;
  chart: Chart;
  public tempData: any = [];
  public apiResult: any = [];
  public timerVar: any;
  public xlabel: any = [];
  public liveFlag: boolean = false;
  public isopened: boolean = false;
  public regApDetails;
  public selectedMac;
  public selectedAp;
  public initalMac;
  public timeStamp = 'live';
  public resultArray_copy: any = [];
  public resArr = [];
  public str = '';
  public noDataMsg = '';
  public selectedScale;
  public timeInterval = 10000;
  public number_points = 12;
  public steps = 1;

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
            // if (t.liveFlag == true) {
            var series1 = this.series[0];
            var series2 = this.series[1];
            var c = this;

            t.timerVar = setInterval(function () {
              t._service.getWeb('statistics/ap-system-utilization/?ap=' + t.selectedMac +
                '&scale=' + timeFlag +
                '&time=' + t.xlabel[t.xlabel.length - 1] +
                '', '', '')
                .then(_data => {

                  // console.log(_data);
                  if (_data.status != 0) {

                    for (let i = 0; i < _data.result[0].length; i++) {
                      t.str = t.str + '_' + _data.result[0][i];
                      if (t.xlabel.length > t.number_points) {
                        t.xlabel.shift();
                      }
                      let x1, x2, x3, y;
                      x1 = parseFloat(_data.result[1][i]);
                      x2 = parseFloat(_data.result[2][i]);
                      y = parseFloat(_data.result[0][i]);
                      t.xlabel.push(y);
                      let shift = true;

                      if (t.xlabel.length <= t.number_points) {
                        shift = false;
                      }
                      if (t.xlabel.length > 12) {
                        t.steps = 2;
                      }
                      series1.addPoint([t.convertTime(y), x1], true, shift);
                      series2.addPoint([t.convertTime(y), x2], true, shift);
                    }


                  }
                }).catch((error) => {
                  this.notifyPopup.logoutpop(commonMessages.InternalserverError);
                });
              // console.log(series1);
            }, t.timeInterval);
            // }
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
        tickInterval: 1,
        labels: {
          step: this.steps,
          formatter: function () {

            let newStr = t.str.replace(/^_/, '');
            let timeArray = newStr.split('_');
            var label = t.convertTime(timeArray[this.value]);

            if (label == 'NaN:aN:aN' || label == 'NaN:aN' || label == 'Invalid') {
              label = '';
            }
            return label;
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: null
        },
        labels: {
          formatter: function () {
            return this.value;
          }
        }
      },
      tooltip: {
        formatter: function () {
          let newStr = t.str.replace(/^_/, '');
          let timeArray = newStr.split('_');
          var label = t.convertTime(timeArray[this.x]);
          if (label == 'NaN:aN:aN' || label == 'NaN:aN') {
            label = '';
          }
          return 'Time : <b>' + label + '</b><br/>' + this.series.name + ' : <b>' + this.y.toFixed(2) + '%</b>';

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
          marker: {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null,
            radius: 6,
            symbol: 'circle'
          }
        }
      },
      series: [{
        name: 'CPU',
        data: this.cpuData,
        color: '#a377ec'
      },
        {
          name: 'Memory',
          data: this.memoryData,
          color: '#fa894e'
        }]
    });
  }

  ngOnInit() {
    //this.loadData('live','');
    //this.loadRegAp();


  }

  setView(obj) {
    if (obj == 'graph') {
      this.tableView = false;
      this.drawGraph('live');
    } else {
      this.tableView = true;
    }
  }

  loadData(param, status) {
    //this.spinnerService.show();
    this._service.getWeb('statistics/ap-system-utilization/?ap=' + this.selectedMac + '&scale=' + param + '', '', '').then(res => {
      if (res.status != 0) {
        let timeVal = res.result[0];
        for (let j = 0; j < timeVal.length; j++) {
          this.str = this.str + '_' + timeVal[j];
        }


        this.apiResult = res.result;

        this.cpuData = this.apiResult[1];//_data.cpu_info;
        this.memoryData = this.apiResult[2];// _data.memory_used;
        this.timeData = this.apiResult[0];//_data.time_axis;
        this.xlabel = this.apiResult[0];//_data.time_axis;
        this.noDataMsg = '';
        this.init(param);


      } else {
        this.noDataMsg = res.msg;
        clearInterval(this.timerVar);
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  loadRegAp() {
    this._service.getWeb('configurations/registered-ap/', '', '').then(_data => {
      if (_data) {
        this.regApDetails = _data;
        this.initalMac = _data[0].ap_mac;
        this.selectedMac = this.initalMac;

        this.selectedAp = _data[0].ap_name;
        this.tableView = false;
        this.drawGraph(this.timeStamp);
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
    this.xlabel = [];
    this.str = '';
    this.loadData(obj, '');
    clearInterval(this.timerVar);
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

  openSelectApBody() {
    if (this.isopened == false) {
      this.isopened = true;
      this.elRef.nativeElement.querySelector('#selectApBody').classList.remove('hide');

    } else {
      this.isopened = false;
      this.elRef.nativeElement.querySelector('#selectApBody').classList.add('hide');
    }
  }

  setMac(obj) {
    this.selectedMac = obj;
    this.drawGraph(this.timeStamp);
    this.isopened = false;
    this.elRef.nativeElement.querySelector('#selectApBody').classList.add('hide');
    this.getAPname(obj);
  }

  getAPname(val) {
    let res = this.regApDetails.find(x => x.ap_mac == val);
    this.selectedAp = res.ap_name;

  }

  ngOnDestroy() {
    clearInterval(this.timerVar);
    //if(this.spinnerService){
    //  this.spinnerService.hide();
    //}
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

  convertTime(date) {
    let d;
    if (typeof(date) == 'number') {
      d = date.toString();

    } else {
      d = date;
    }

    let dt = new Date(d * 1000);

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
}
