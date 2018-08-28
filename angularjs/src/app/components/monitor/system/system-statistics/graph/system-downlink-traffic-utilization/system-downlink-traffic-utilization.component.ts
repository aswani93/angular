import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange} from '@angular/core';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {WebserviceService} from '../../../../../../services/commonServices/webservice.service';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'app-system-downlink-traffic-utilization',
  templateUrl: './system-downlink-traffic-utilization.component.html',
  styleUrls: ['./system-downlink-traffic-utilization.component.css']
})
export class SystemDownlinkTrafficUtilizationComponent implements OnInit, OnDestroy, OnChanges {

  @Input() scale: string;
  @Input() range: string;

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
  public liveFlag = false;


  public unit = 'kbps';
  public noDataMsg = '';
  live = 'live';


  selectedScale;
  timeInterval = 10000;
  // timeInterval = 10000;
  number_points = 12;
  steps = 1;

  constructor(private _service: WebserviceService,
              private elRef: ElementRef,
              private spinnerService: Ng4LoadingSpinnerService) {
  }

  init(timeFlag) {

    // console.log('Init Method is fired where chart is generated.');

    const t = this;
    this.chart = new Chart({
      chart: {
        spacingBottom: 0,
        spacingTop: 0,
        spacingLeft: 20,
        spacingRight: 20,
        height: 300,
        type: 'line',
        events: {
          load: function () {

            // console.log('Chart events :load:  method is fired of network graph');
            // if (t.liveFlag == true) {

            // series is an array of plotting datas on the graph so thats why it is [0] [1] [2]
            const series1 = this.series[0];  // series for the uplink
            const series2 = this.series[1];  // series for the downlink
            //   let series3 = this.series[2];  // series for the
            // var c = this;

            let x1, // for up link (tx)
              x2,  //  for down link (rx)
              // x3,    for total uplink and downlink (tx + rx) but , as of now it is not needed.
              y,   //  for storing the last time stamp, to fire request for the next interval
              u = 'kbps';
            /*  for storing the unit came in the response
                                         (but it is not being used here, coz we are manually setting the unit : kbps) */

            // t.previousUnit = t.unit;

            // setInterval function to hit the api within the specified interval.
            t.timerVar = setInterval(function () {
              // console.log(`Timeflag:  ${timeFlag} TimeStamp:  ${t.timestamp}`);

              t._service.getWeb('statistics/wlc-net-stats/?scale=' + timeFlag +
                '&time=' + t.timestamp, '', '').then(_data => {

                // console.log('with timestamp :load:  method is fired of network graph');
                // console.log(_data);

                // if (_data.unit !== t.previousUnit) {
                //   t.loadData('hour', '');
                //   clearInterval(t.timerVar);
                // }
                // if (_data.status !== 0)

                t.apiResult = _data.result;
                const apiLength = t.apiResult[0].length;

                // console.log(` x axis length ${apiLength} selected range ${t.selectedRange}`);

                x1 = parseFloat(t.apiResult[
                  t.selectedRange === 'avg' ? 3 : t.selectedRange === 'min' ? 1 : t.selectedRange === 'max' ? 2 : 1][apiLength - 1]);
                x2 = parseFloat(t.apiResult[
                  t.selectedRange === 'avg' ? 6 : t.selectedRange === 'min' ? 4 : t.selectedRange === 'max' ? 5 : 2][apiLength - 1]);

                /*   x3 = parseFloat(t.apiResult
                [t.selectedRange === 'avg' ? 3 : t.selectedRange === 'avg' ? 6 : t.selectedRange === 'min' ? 9 : 12][apiLength - 1]); */

                y = parseFloat(t.apiResult[0][apiLength - 1]);

                // console.log(` x1 : ${x1}  x2 : ${x2}`);

                t.timestamp = y;  // putting the last time value of array into timestamp.
                u = t.unit;

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
                // series3.addPoint([t.convertTime(y), x3], true, shift);

                series2.update({name: '<i class=\'up icon icon-up-arrow-1\'></i> Uplink (' + x1 + ' ' + u + ')'});
                series1.update({name: '<i class=\'down icon icon-download-arrow\'></i> Downlink (' + x2 + ' ' + u + ')'});
                // series3.update({name: ' Total (' + x1 + ' ' + t.unit + ')'});

                t.tempData = this.apiResult;
              });
              // // console.log(series1);
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
        title: {
          text: '' // time text is removed Jira:1270
        },
        labels: {
          step: this.steps,
          formatter: function () {
            /*var time = t.convertTime(t.xlabel[t.timeFlag]);
            t.timeFlag++;*/
            let label = t.convertTime(t.xlabel[this.value]);

            if (label === 'NaN:aN:aN' || label === 'NaN:aN' || label === 'Invalid') {
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
          text: `(${this.unit})`
        },
        labels: {
          formatter: function () {
            return this.value;
          }
        }

      },
      tooltip: {
        formatter: function () {
          let label = t.convertTime(t.xlabel[this.x]);
          if (label === 'NaN:aN:aN' || label === 'NaN:aN') {
            label = '';
          }
          return 'Time : <b>' + label +
            '</b><br/>' +
            (this.series.name.replace(/<\/?[^>]+(>|$)/g, '')).split(' ')[1] +
            ' : <b>' +
            this.y.toFixed(2) + ' ' +
            t.unit + '</b>';

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

      series: [
        // {
        //   // name: ' Total (' + this.totalData[this.totalData.length - 1] + ' ' + this.unit + ')',
        //   name: ' Total (' + this.unit + ')',
        //   data: this.totalData,
        //   color: '#f4516c'
        // },
        {
          name: '<i class="down icon icon-download-arrow"></i> Downlink ('
          + this.downlinkData[this.downlinkData.length - 1] +
          ' ' +
          this.unit + ')',
          data: this.downlinkData,
          color: '#00c5dc'
        },
        {
          name: '<i class="up icon icon-up-arrow-1"></i> Uplink (' +
          this.uplinkData[this.uplinkData.length - 1] +
          ' ' + this.unit + ')',
          data: this.uplinkData,
          color: '#ffb822'
        }]
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {

    if (changes.range) {
      this.selectedRange = changes.range.currentValue;
    } else {
      this.selectedRange = 'total';
    }
    if (changes.scale) {
      this.scale = changes.scale.currentValue;
      this.selectedScale = changes.scale.currentValue;
      if (this.selectedScale === '' || this.selectedScale === undefined) {
        this.selectedScale = 'hour';
      }

      // this.drawGraph(this.selectedScale);

      if (this.selectedScale === 'hour') {
        console.log('traffic', this.selectedScale);
        this.timeInterval = 300000;
        this.number_points = 12;
        this.steps = 1;
      }
      if (this.selectedScale === 'day') {
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
    // this.drawGraph(this.timeStamp);
  }

  loadData(scaleVal, status) {
    // this.spinnerService.show();
    // console.log('load data method fired of network graph!');
    this._service.getWeb('statistics/wlc-net-stats/?scale=' + scaleVal, '', '').then(_data => {

      // console.log(_data);

      if (_data.result[0].length >= 1 && _data.result[1].length >= 1 && _data.result[2].length >= 1) {
        this.timeData = _data.result[0];

        // this.totalData = _data.result[
        // this.selectedRange === 'total' ? 1 : this.selectedRange === 'avg' ? 4 : this.selectedRange == 'min' ? 7 : 10];

        this.downlinkData = _data.result[
          this.selectedRange === 'avg' ? 3 : this.selectedRange === 'min' ? 1 : this.selectedRange === 'max' ? 2 : 1];
        this.uplinkData = _data.result[
          this.selectedRange === 'avg' ? 6 : this.selectedRange === 'min' ? 4 : this.selectedRange === 'max' ? 5 : 2];

        this.xlabel = _data.result[0];

        // Extracting the last time stamp for firing the next interval.
        this.timestamp = this.timeData[this.timeData.length - 1];

        // this.unit = _data.unit;  // previously we were fetching the unit from the API response

        this.unit = 'kbps';    // now we are setting the unit as 'kbps'.

        console.log(`TimeStamp:  ${this.convertTime(this.timestamp)}`);

        // this.previousUnit = this.unit;
        this.init(scaleVal);
        this.noDataMsg = '';

      } else {
        // this.noDataMsg = _data.msg;
        this.noDataMsg = 'No Data Available';
        clearInterval(this.timerVar);

      }
    });
  }

  // This method will load the graph data as per scale value [live, hour] day is not available for now.
  drawGraph(scaleVal) {
    // console.log('draw graph method is fired.');
    this.timeStamp = scaleVal;
    if (scaleVal === 'live') {
      this.liveFlag = true;
    } else {
      this.liveFlag = false;
    }
    this.loadData(scaleVal, '');
    clearInterval(this.timerVar);
  }

  // convertTime method is used to convert the epoch time to the current time
  // which will be plotted to the x axis for the graphs.
  convertTime(date) {
    const dt = new Date(date * 1000);
    const hours = dt.getHours();
    const minutes = '0' + dt.getMinutes();
    const seconds = '0' + dt.getSeconds();
    let formattedTime;
    if (this.selectedScale === 'live') {
      formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    } else {
      formattedTime = hours + ':' + minutes.substr(-2);
    }
    return formattedTime;
  }

  // formateobject(obj) {
  //   var output = [];
  //   for (var key in obj) {
  //     var tempObj = {};
  //     tempObj[key] = obj[key];
  //     output.push(tempObj);
  //   }
  //   return output;
  // }

  ngOnDestroy() {
    clearInterval(this.timerVar);
    //  if(this.spinnerService){
    //   this.spinnerService.hide();
    // }
  }
}
