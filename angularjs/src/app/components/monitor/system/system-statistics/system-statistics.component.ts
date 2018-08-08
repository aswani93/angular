import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {NotificationService} from '../../../../services/notificationService/NotificationService';
import {Http} from '@angular/http';

@Component({
  selector: 'app-system-statistics',
  templateUrl: './system-statistics.component.html',
  styleUrls: ['./system-statistics.component.css']
})
export class SystemStatisticsComponent implements OnInit, OnDestroy {

// for the unit displayed on the table

  percentage = '';
  unit = '';
  degree = '';
  rpm = '';
  volt = '';
  disk = '';

  // view template visibility (graph/tabular)
  templateViewText = 'Graph View';
  isGraphViewSelected = true;
  isTabularViewSelected = false;

  scaleText_wlc_downlink = 'Live data';
  scaleText_wlc_cpu = 'Live data';

  rangeText_wlc_cpu = 'Average';
  rangeText_wlc_downlink = 'Average';

  scaleVal_wlc_cpu_live = 'live';
  rangeVal_wlc_cpu = 'avg';
  scaleVal_wlc_cpu = 'hour';

  scaleVal_wlc_downlink_live = 'live';
  scaleVal_wlc_downlink = 'hour';
  rangeVal_wlc_downlink = 'avg';

  ifLiveNetworkGraphSelected = true;
  ifHourNetworkGraphSelected = false;

  ifLiveCPUGraphSelected = true;
  ifHourCPUGraphSelected = false;


  ifLiveSelectedFromCPU = false;
  ifLiveSelectedFromNetwork = false;

  interval_details;
  wlc_info = {
    'cpu': '-',
    'fan': '-',
    'mem': '-',
    'rx': '-',
    'disk': '-',
    'client': '-',
    'amp_temp': '-',
    'ap_count': '-',
    'client_count': '-',
    'power_supply': '-',
    'tx': '-'
  };
  demoData = {
    'cpu': '-',
    'fan': '-',
    'mem': '-',
    'rx': '-',
    'disk': '-',
    'client': '-',
    'amp_temp': '-',
    'ap_count': '-',
    'client_count': '-',
    'power_supply': '-',
    'tx': '-'
  };

  constructor(private elRef: ElementRef,
              private http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private notifyPopup: NotificationService) {
  }

  ngOnInit() {
    this.notifyPopup.showLoader('Loading WLC Data!');
    // http://192.168.0.27:8000/api/statistics/wlc-host-stats-table/?vm=HOST
    this._service.getWeb('statistics/wlc-host-stats-table/?vm=HOST', '', '').then(data => {
      if (data.status === '0') {
        this.wlc_info = this.demoData;
        this.notifyPopup.clear();
      } else {
        // console.log(Object.keys(data.result).length);
        this.wlc_info = Object.keys(data.result).length !== 0 ? data.result : this.demoData;
        console.log(this.wlc_info);

        this.percentage = '%';
        this.unit = 'kbps';
        this.degree = data.result.amp_temp === '-' ? ' ' : '°c';
        this.rpm = data.result.fan === '-' ? ' ' : 'rpm';
        this.volt = data.result.power_supply === '-' ? ' ' : 'volts';
        this.disk = data.result.disk === '-' ? ' ' : '%';
        this.notifyPopup.clear();
      }
    });
    this.reloadData();
  }

  reloadData() {
    this.interval_details = setInterval(() => {
      this._service.getWeb('statistics/wlc-host-stats-table/?vm=HOST', '', '').then(data => {
        if (data.status === '0') {
          this.wlc_info = this.demoData;
        } else {
          // console.log(Object.keys(data.result).length);
          this.wlc_info = Object.keys(data.result).length !== 0 ? data.result : this.demoData;
          console.log(this.wlc_info);
          this.percentage = '%';
          this.unit = 'kbps';
          this.degree = data.result.amp_temp === '-' ? ' ' : '°c';
          this.rpm = data.result.fan === '-' ? ' ' : 'rpm';
          this.volt = data.result.power_supply === '-' ? ' ' : 'volts';
          this.disk = data.result.disk === '-' ? ' ' : '%';

        }
      });
    }, 10000);
  }


  ngOnDestroy() {
    if (this.interval_details) {
      clearInterval(this.interval_details);
    }
  }

  setScale(from, scale) {
//  for the setting scale of wlc_cpu usage. eg. live, hour, day

    //  console.log(scale + 'in set scale');
    //  console.log(from + 'from  in set scale');
    switch (scale + '_' + from) {
      case 'live_wlc_cpu':
        this.scaleText_wlc_cpu = 'Live data';
        this.ifLiveSelectedFromCPU = false;
        this.ifLiveCPUGraphSelected = true;
        this.ifHourCPUGraphSelected = false;
        break;
      case 'hour_wlc_cpu':
        this.scaleText_wlc_cpu = 'Last 1 hour';
        this.ifLiveSelectedFromCPU = true;
        this.ifLiveCPUGraphSelected = false;
        this.ifHourCPUGraphSelected = true;
        break;

// for the setting scale of wlc_downlink eg. live, hour, day.

      case 'live_wlc_downlink':
        this.scaleText_wlc_downlink = 'Live data';
        this.ifLiveSelectedFromNetwork = false;
        this.ifLiveNetworkGraphSelected = true;
        this.ifHourNetworkGraphSelected = false;
        break;
      case 'hour_wlc_downlink':
        this.scaleText_wlc_downlink = 'Last 1 hour';
        this.ifLiveSelectedFromNetwork = true;
        this.ifLiveNetworkGraphSelected = false;
        this.ifHourNetworkGraphSelected = true;
        break;
    }
    if (from === 'wlc_cpu') {
      this.scaleVal_wlc_cpu = scale;
    }
    if (from === 'wlc_downlink') {
      this.scaleVal_wlc_downlink = scale;
    }
  }

  setRange(from, range) {
    switch (range + '_' + from) {

      // for the setting scale of wlc_cpu eg. Avg, Min, Max.

      case 'avg_wlc_cpu':
        this.rangeText_wlc_cpu = 'Average';
        break;
      case 'min_wlc_cpu':
        this.rangeText_wlc_cpu = 'Minimum';
        break;
      case 'max_wlc_cpu':
        this.rangeText_wlc_cpu = 'Maximum';
        break;

      // for the setting scale of wlc_downlink eg. Avg, Min, Max.

      case 'avg_wlc_downlink':
        this.rangeText_wlc_downlink = 'Average';
        break;
      case 'min_wlc_downlink':
        this.rangeText_wlc_downlink = 'Minimum';
        break;
      case 'max_wlc_downlink':
        this.rangeText_wlc_downlink = 'Maximum';
        break;

    }
    if (from === 'wlc_cpu') {
      this.rangeVal_wlc_cpu = range;
    }
    if (from === 'wlc_downlink') {
      this.rangeVal_wlc_downlink = range;
    }
    if (from === 'wlc_downlink') {
      this.rangeVal_wlc_downlink = range;
    }
  }

  setPanelView(data: string) {
    if (data === 'graph') {
      this.templateViewText = 'Graph View';
      this.isTabularViewSelected = false;
      this.isGraphViewSelected = true;
    } else {
      this.templateViewText = 'Tabular View';
      this.isGraphViewSelected = false;
      this.isTabularViewSelected = true;
    }
  }


}
