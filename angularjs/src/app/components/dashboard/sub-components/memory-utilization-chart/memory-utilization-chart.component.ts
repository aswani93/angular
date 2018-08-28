import {Component, OnInit, Input,OnDestroy,Output,EventEmitter} from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'memory-utilization-chart',
  templateUrl: './memory-utilization-chart.component.html',
  styleUrls: ['./memory-utilization-chart.component.css']
})
export class MemoryUtilizationChartComponent implements OnInit,OnDestroy {
  memoryUtilizationTop: any;
  public graphdata;
  public titleText = null;
  alive: boolean;
  timer: any;



  @Input()
  set visibleStatus(value: boolean) {
    if (value) {
      this.loadData('live', 'HOST');
    }
  }

   @Input()
 set data(data: any) {
    if(data){
    this.initialselectedScale = data.graph_period;
     this.selectedScale = data.graph_period;
     this.initialslectedVM=data.vm_host;
     this.selectedVM = data.vm_host;
     this.initialcolor = data.colour_options[0];
     this.color = data.colour_options[0];
    }
   } 
@Output() deleteWidget: EventEmitter<any> = new EventEmitter<any>();

  // @Input() scale: string;
  // @Input() range: string;

  scale = 'live';
  range = '';

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

  initialselectedScale = 'live';
  selectedScale = 'live';
  showDialogsetting:boolean = false;
  initialslectedVM = 'HOST';
  selectedVM = "HOST";
  timeInterval = 10000;
  number_points = 12;
  steps = 1;
  series2:any;
  chartBoolStatus:boolean = false;
  initialcolor="#3bb300";
  color="#3bb300";
  constructor(private _service: WebserviceService) {
    this.alive = true;
  }

  ngOnInit() {
  }

  callingFn(str, val) {
    const t = this;
    this.memoryUtilizationTop = new Chart({
      chart: {
        type: 'areaspline',
        zoomType: 'x',
        events: {
          load: function () {
            clearInterval(t.timerVar);
            console.log(t.timerVar+">>>>>>>>>>>>."+this.series);
            // console.log('Chart events :load:  method is fired of network graph');
            // if (t.liveFlag == true) {

            // series is an array of plotting datas on the graph so thats why it is [0] [1] [2]
            // const series1 = this.series[0];  // series for the cpu
            t.series2 = this.series[0];  // series for the memory
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
              t.callingChart(t,x2,y,u);

              // // console.log(series1);
            }, t.timeInterval);

            // setInterval function to hit the api within the specified interval.


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
      plotOptions: {
        line: {
          lineWidth: 1,
          softThreshold: false
        }
      },
      xAxis: {
        gridLineWidth: 1,
        lineColor: 'transparent',
        tickInterval: 2,
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
        allowDecimals: false,
        title: {
          text: 'Percentage(%)'
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
      series: [
        {
          name: 'Memory',
          data: this.memoryData,
          color:this.color
        }]
    });
  }
  callingChart(t,x2,y,u){
    // setInterval function to hit the api within the specified interval.
    t._service.getWeb('statistics/wlc-sys-stats/?scale=' +t.selectedScale+'&vm=' + t.selectedVM +'&time=' + t.timestamp, '', '').then(_data => {

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

      x2 = parseFloat(t.apiResult[
        t.selectedRange === 'avg' ? 6 : t.selectedRange === 'min' ? 4 : t.selectedRange === 'max' ? 5 : 2][apiLength - 1]);

      /*   x3 = parseFloat(t.apiResult
      [t.selectedRange === 'avg' ? 3 : t.selectedRange === 'avg' ? 6 : t.selectedRange === 'min' ? 9 : 12][apiLength - 1]); */
      if(apiLength > 0){
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
       // console.log(t.series2+"oooooooo"+t.convertTime(y));
        // series1.addPoint([t.convertTime(y), x1], true, shift);
        t.series2.addPoint([t.convertTime(y), x2], true, shift);
        // t.series2.update({name: 'Memory :'+ x2 + ' ' + t.unit});
        //t.series2.update({name: '<i class=\'down icon icon-download-arrow\'></i> Downlink (' + x2 + ' ' + u + ')'});

        // series3.update({name: '<i class=\'up icon icon-up-arrow-1\'></i> Uplink (' + x3 + ' ' + u + ')'});

        t.tempData = t.apiResult; // changed from this to t.
      }
    });

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


  drawGraph(obj, title) {
    this.graphdata = [];
    this.titleText = title;
    // this.alive = false;
    clearInterval(this.timerVar);
    this.graphdata = obj;
    this.loadData(this.selectedScale, '');
    //   clearInterval(this.timerVar);
    // setTimeout(() => {
    //   // this.callingFn(obj, title);
    // //  this.graphdata = obj;
    // }, 500);
  }

  loadData(scaleVal, status) {
    // this.spinnerService.show();
    // console.log('load data method fired of network graph!');
    this._service.getWeb('statistics/wlc-sys-stats/?scale=' + scaleVal+'&vm='+this.selectedVM, '', '').then(_data => {

      // console.log(_data);

       if (_data && _data.result &&  _data.result.length > 0) {
      if (_data.result[0].length >= 1 && _data.result[1].length >= 1 && _data.result[2].length >= 1) {
        this.timeData = _data.result[0];

        // this.totalData = _data.result[
        // this.selectedRange === 'total' ? 1 : this.selectedRange === 'avg' ? 4 : this.selectedRange == 'min' ? 7 : 10];
        this.chartBoolStatus = true;
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
        this.callingFn(scaleVal,  '' );
        this.noDataMsg = '';

      } else {
        // console.log('In else block');
        // this.noDataMsg = _data.msg;
        this.chartBoolStatus = false;
        this.noDataMsg = 'No Data Available';
        clearInterval(this.timerVar);

      }
    }
    });
  }


  visibleChange(obj) {
    // this.alive = true;
    clearInterval(this.timerVar);
    this.loadData(this.selectedScale, '');
  }

  ngOnDestroy() {
    clearInterval(this.timerVar);
  }

  /*........Setting Popup Method......*/
  openSetting(title){
    console.log(">>>>>>>"+title);
    this.titleText = title;
    this.showDialogsetting = true;

  }
  closeSettingPopup(event){
    this.showDialogsetting = event;
  }

  modelSettingFun(event){
    this.selectedScale = event.period;
    this.selectedVM = event.vm;
    this.color = event.color;
    if(event.period == 'live')
      this.timeInterval = 10000
    else
      this.timeInterval = 300000
    clearInterval(this.timerVar);
    console.log(event.period+"/////"+event.vm+"//////"+this.timeInterval);

    this.loadData(event.period,event.vm);
  }

      /*---------delete widget-----*/
  delete(val){
    clearInterval(this.timerVar); 
   this.deleteWidget.emit({id:val});
  }

}
