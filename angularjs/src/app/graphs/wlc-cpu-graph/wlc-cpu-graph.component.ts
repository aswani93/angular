import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange} from '@angular/core';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {WebserviceService} from '../../services/commonServices/webservice.service';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'app-wlc-cpu-graph',
  templateUrl: './wlc-cpu-graph.component.html',
  styleUrls: ['./wlc-cpu-graph.component.css']
})
export class WlcCpuGraphComponent implements OnInit, OnChanges, OnDestroy {

  @Input() scale: string;
  @Input() range: string;


  cpuData;
  memoryData;
  timeData;
  timeStamp = 'hour';
  timestamp;
  selectedRange = 'total';
  chart: Chart;
  tempData: any = [];
  apiResult: any = [];
  timerVar: any;
  xlabel: any = [];
  liveFlag = false;


  unit = '%';
  noDataMsg = '';


  selectedScale;
  timeInterval = 300000;
  number_points = 12;
  steps = 1;


  constructor(private _service: WebserviceService,
              private elRef: ElementRef,
              private spinnerService: Ng4LoadingSpinnerService) {
  }

  init(timeFlag) {
    const t = this;
    this.chart = new Chart({
      chart: {
        type: 'areaspline',
        height: 250,
        zoomType: 'x',
        events: {
          load: function () {

            // console.log('Chart events :load:  method is fired of network graph');
            // if (t.liveFlag == true) {

            // series is an array of plotting datas on the graph so thats why it is [0] [1] [2]
            const series1 = this.series[0];  // series for the cpu
            const series2 = this.series[1];  // series for the memory
            //   let series3 = this.series[2];  // series for the
            // var c = this;

            let x1, // for up cpu (tx)
              x2,  //  for down memory (rx)
              // x3,    for total uplink and downlink (tx + rx) but , as of now it is not needed.
              y,   //  for storing the last time stamp, to fire request for the next interval
              u = '%';
            /*  for storing the unit came in the response
                                         (but it is not being used here, coz we are manually setting the unit : %) */

            // t.previousUnit = t.unit;

            // setInterval function to hit the api within the specified interval.
            t.timerVar = setInterval(function () {
              // console.log(`Timeflag:  ${timeFlag} TimeStamp:  ${t.timestamp}`);

              t._service.getWeb('statistics/wlc-sys-stats/?scale=' + timeFlag +
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

                series1.update({name: ' Total (' + x1 + ' ' + t.unit + ')'});
                series2.update({name: '<i class=\'down icon icon-download-arrow\'></i> Downlink (' + x2 + ' ' + u + ')'});

                // series3.update({name: '<i class=\'up icon icon-up-arrow-1\'></i> Uplink (' + x3 + ' ' + u + ')'});

                t.tempData = t.apiResult; // changed from this to t.
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
        // tickInterval: 1,
        title: {
          text: 'Time',
        },
        labels: {
          step: this.steps,
          formatter: function () {

            // const newStr = t.str.replace(/^_/, '');
            // const timeArray = newStr.split('_');
            // let label = t.convertTime(timeArray[this.value]);
            let label = t.convertTime(t.xlabel[this.value]);

            if (label === 'NaN:aN:aN' || label === 'NaN:aN' || label === 'Invalid') {
              label = '';
            }
            return label;
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: `%`
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
          return 'Time : <b>' + label + '</b><br/>' + this.series.name + ' : <b>' + this.y.toFixed(2) + ' ' + t.unit + '</b>';
        }
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        symbolWidth: 10,
        useHTML: true
      },
      plotOptions: {
        series: {
          marker: {
            fillColor: '#FFFFFF',
            lineWidth: 2,
            lineColor: null
          }
        }
      },
      series: [{
        name: 'CPU Usage',
        data: this.cpuData,
        color: '#a377ec'
      }
        // {
        //   name: 'Memory Usage %',
        //   data: this.memoryData,
        //   color: '#fa894e'
        // }
      ]
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
    // this.loadRegAp();
  }

  loadData(scaleVal, status) {
    // this.spinnerService.show();
    // console.log('load data method fired of network graph!');
    this._service.getWeb('statistics/wlc-sys-stats/?scale=' + scaleVal, '', '').then(_data => {

      // console.log(_data);

      // if (_data.status !== 0) {
      if (_data.result[0].length >= 1 && _data.result[1].length >= 1 && _data.result[2].length >= 1) {
        this.timeData = _data.result[0];

        // this.totalData = _data.result[
        // this.selectedRange === 'total' ? 1 : this.selectedRange === 'avg' ? 4 : this.selectedRange == 'min' ? 7 : 10];

        this.cpuData = _data.result[
          this.selectedRange === 'avg' ? 3 : this.selectedRange === 'min' ? 1 : this.selectedRange === 'max' ? 2 : 1];
        this.memoryData = _data.result[
          this.selectedRange === 'avg' ? 6 : this.selectedRange === 'min' ? 4 : this.selectedRange === 'max' ? 5 : 2];

        this.xlabel = _data.result[0];
        this.timestamp = this.timeData[this.timeData.length - 1];

        // this.unit = _data.unit;  // previously we were fetching the unit from the API response

        this.unit = '%';    // now we are setting the unit as '%'.


        // this.previousUnit = this.unit;
        // render the graph.
        this.init(scaleVal);
        this.noDataMsg = '';

      } else {
        // console.log('In else block');
        // this.noDataMsg = _data.msg;
        this.noDataMsg = 'No Data Available';
        clearInterval(this.timerVar);

      }
    });
  }

  drawGraph(scaleVal) {
    this.timeStamp = scaleVal;
    if (scaleVal === 'live') {
      this.liveFlag = true;
    } else {

      this.liveFlag = false;
    }

    this.loadData(scaleVal, '');
    clearInterval(this.timerVar);
  }


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

  ngOnDestroy() {
    clearInterval(this.timerVar);
    //  if(this.spinnerService){
    //   this.spinnerService.hide();
    // }
  }
}
