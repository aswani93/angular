import {Component, OnInit, Input,Output,EventEmitter} from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {Chart} from 'angular-highcharts';

@Component({
  selector: 'cpu-utilization-chart',
  templateUrl: './cpu-utilization-chart.component.html',
  styleUrls: ['./cpu-utilization-chart.component.css']
})
export class CpuUtilizationChartComponent implements OnInit {
  cpuUtilizationTop: any;
  public graphdata;
  public titleText = null;
  

  @Input()
  set visibleStatus(value: boolean) {
    if (value) {
      this.loadData('live','HOST');

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
  selectedVM = 'HOST';
  //timeInterval = 300000;
  timeInterval = 10000;
  number_points = 12;
  steps = 1;
  alive:boolean = true;
  chartBoolStatus:boolean = false;
  series1:any;
  initialcolor ="#a377ec";
  color ="#a377ec";
  constructor(private _service: WebserviceService) {
  }

  ngOnInit() {
  }

  callingFn(str, val) {
    const t = this;
    this.cpuUtilizationTop = new Chart({
      chart: {
        type: 'areaspline',
        zoomType: 'x',
        events: {
          load: function () {
            // console.log('Chart events :load:  method is fired of network graph');
            // if (t.liveFlag == true) {

            // series is an array of plotting datas on the graph so thats why it is [0] [1] [2]
            t.series1 = this.series[0];  // series for the cpu
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
              t.callingChart(t,x1,y,u);

              // // console.log(series1);
            }, t.timeInterval);
           
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
         tickInterval: 2,
        lineColor: 'transparent',
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
      series: [{
        name: 'CPU',
        data: this.cpuData,
        color:this.color
      }
      ]
    });
  }



  callingChart(t,x1,y,u){
                   t._service.getWeb('statistics/wlc-sys-stats/?scale='+t.selectedScale+'&vm=' + t.selectedVM + '&time=' + t.timestamp, '', '').then(_data => {   
                t.apiResult = _data.result;
                const apiLength = t.apiResult[0].length;

                // console.log(` x axis length ${apiLength} selected range ${t.selectedRange}`);
                 if (_data && _data.result &&  _data.result.length > 0) {
                x1 = parseFloat(t.apiResult[
                  t.selectedRange === 'avg' ? 3 : t.selectedRange === 'min' ? 1 : t.selectedRange === 'max' ? 2 : 1][apiLength - 1]);
                y = parseFloat(t.apiResult[0][apiLength - 1]);

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
                //console.log(t.series1+"oooooooo"+t.convertTime(y));
                t.series1.addPoint([t.convertTime(y), x1], true, shift);

                //t.series1.update({name: 'CPU :'+ x1 + ' ' + t.unit});

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
    
    // setTimeout(() => {
    //   // this.callingFn(obj, title);
    // //  this.graphdata = obj;
    // }, 500);
  }

  loadData(scaleVal, status) {
    // this.spinnerService.show();
    // console.log('load data method fired of network graph!');
    this._service.getWeb('statistics/wlc-sys-stats/?scale='+scaleVal+'&vm=' + this.selectedVM, '', '').then(_data => {

      // console.log(_data);
      // _data = {"status":"1","result":[[1532509160,1532509170,1532509180,1532509190,1532509200,1532509210,1532509220,1532509230,1532509240,1532509250,1532509260,1532509270],[17.19,17.19,17.18,17.17,17.18,17.17,17.15,17.15,17.13,17.12,17.12,17.1],[62.2,62.19,62.18,62.19,62.18,62.23,62.23,62.23,62.23,62.23,62.26,62.26]]}
       if (_data && _data.result &&  _data.result.length > 0) {
      //console.log(_data.result[0].length +"xxxxxx"+ _data.result[1].length +"xxxxxx"+_data.result[2].length)
      if (_data.result[0].length >= 1 && _data.result[1].length >= 1 && _data.result[2].length >= 1) {
          this.timeData = _data.result[0];
         this.chartBoolStatus = true;
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
        this.callingFn(scaleVal, '');
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
     //this.titleText = null;
    //  this.alive = true;
    clearInterval(this.timerVar);
    this.loadData(this.selectedScale, '');
  }

   ngOnDestroy() {
     clearInterval(this.timerVar); 
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
