import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {Http} from '@angular/http';
import {commonMessages, NotificationService} from '../../../../services/notificationService/NotificationService';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {DataTable, SortEvent} from 'angular2-datatable';

@Component({
  selector: 'app-vm',
  templateUrl: './vm.component.html',
  styleUrls: ['./vm.component.css']
})

export class VmComponent implements OnInit, OnDestroy, AfterViewInit {
  percentage = '';
  unit = '';
  degree = '';
  rpm = '';
  volt = '';
  disk = '';

  vm_mock = {
    'cpu': '-',
    'fan': '-',
    'mem': '-',
    'rx': '-',
    'disk': '-',
    'client': '-',
    'amp_temp': '-',
    'ap_count': '-',
    'group_count': '-',
    'client_count': '-',
    'power_supply': '-',
    'cores_count': '-',
    'tx': '-'
  };

  vm = {
    'cpu': '-',
    'fan': '-',
    'mem': '-',
    'rx': '-',
    'disk': '-',
    'client': '-',
    'amp_temp': '-',
    'ap_count': '-',
    'group_count': '-',
    'client_count': '-',
    'power_supply': '-',
    'cores_count': '-',
    'tx': '-'
  };

  isGraphDrawn = false;
  listedVMTable = true;
  isGraphViewSelected = false;
  isTabularViewSelected = false;

  vmTableData: VM;
  selected_vm_name = 'VM Details';

  templateViewText = 'Graph View';

  set_vm_host_machine = 'DBVM';

  scaleText_vm_downlink = 'Live data';
  scaleText_vm_cpu = 'Live data';

  rangeText_vm_cpu = 'Average';
  rangeText_vm_downlink = 'Average';

  scaleVal_vm_cpu_live = 'live';
  rangeVal_vm_cpu = 'avg';
  scaleVal_vm_cpu = 'hour';

  scaleVal_vm_downlink_live = 'live';
  scaleVal_vm_downlink = 'hour';
  rangeVal_vm_downlink = 'avg';

  ifLiveNetworkGraphSelected = true;
  ifHourNetworkGraphSelected = false;

  ifLiveCPUGraphSelected = true;
  ifHourCPUGraphSelected = false;

  ifLiveSelectedFromCPU = false;
  ifLiveSelectedFromNetwork = false;

  tabular_ping_interval;
  loadVMTableTimer;

  _sortBy;
  _sortOrder;
  @ViewChild('mf') vmDataTable: DataTable;

  constructor(private elRef: ElementRef,
              private http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private notifyPopup: NotificationService) {
  }

  ngOnInit() {
    this.notifyPopup.showLoader('Loading VM Data..');
    // this.loadVMTableData();

    this._service.getWeb('statistics/wlc-host-stats-table/', '', '').then(data => {
      if (data.status === '0') {
        this.vm = this.vm_mock;
      } else {
        //  console.log(Object.keys(data.result).length);
        console.log(data.result);
        this.vmTableData = data.result;
        // this.vmTableData = Object.keys(data.result).length !== 0 ? data.result : this.vm_mock;
        console.log(this.vmTableData);
        this.percentage = '%';
        this.unit = 'kbps';
        // this.degree = data.result.amp_temp === '-' ? ' ' : '°c';
        // this.rpm = data.result.fan === '-' ? ' ' : 'rpm';
        // this.volt = data.result.power_supply === '-' ? ' ' : 'volts';
        // this.disk = data.result.disk === '-' ? ' ' : '%';
        this.notifyPopup.clear();
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });

    this.loadVMTableTimer = setInterval(() => {
      this.loadVMTableData();
    }, 180000);
  }

  setStatView(vName) {
    this.listedVMTable = false;
    this.set_vm_host_machine = vName;
    this.loadTabularData(vName);
    this.isGraphDrawn = true;
    this.isGraphViewSelected = true;
    // console.log('clicked on', vName);
  }

  loadTabularData(vName: any) {
    // statistics/wlc-host-stats-table/?vm=HOST
    this.notifyPopup.showLoader('Loading VM Data..');
    this._service.getWeb('statistics/wlc-host-stats-table/?vm=' + vName, '', '').then(data => {
      if (data) {
        this.selected_vm_name = vName;
        this.vm = data.result;
        this.vm = Object.keys(data.result).length !== 0 ? data.result : this.vm_mock;
        console.log(this.vm);
        this.percentage = '%';
        this.unit = 'kbps';
        // this.degree = data.result.amp_temp === '-' ? ' ' : '°c';
        // this.rpm = data.result.fan === '-' ? ' ' : 'rpm';
        // this.volt = data.result.power_supply === '-' ? ' ' : 'volts';
        // this.disk = data.result.disk === '-' ? ' ' : '%';
        // setTimeout(() => {
        //   this.notifyPopup.clear();
        // }, 20000);
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });

    this.reloadTabularData(vName);
  }

  reloadTabularData(vName) {
    this.tabular_ping_interval = setInterval(() => {
      this._service.getWeb('statistics/wlc-host-stats-table/?vm=' + vName, '', '').then(data => {
        if (data.status === '0') {
          this.vm = this.vm_mock;
        } else {
          this.vm = Object.keys(data.result).length !== 0 ? data.result : this.vm_mock;
          console.log(this.vm);
          this.percentage = '%';
          this.unit = 'kbps';
          //  this.degree = data.result.amp_temp === '-' ? ' ' : '°c';
          //  this.rpm = data.result.fan === '-' ? ' ' : 'rpm';
          //  this.volt = data.result.power_supply === '-' ? ' ' : 'volts';
          //  this.disk = data.result.disk === '-' ? ' ' : '%';
        }
      });
    }, 180000);
  }

  loadVMTableData() {
    this._service.getWeb('statistics/wlc-host-stats-table/', '', '').then(data => {
      if (data.status === '0') {
        this.vm = this.vm_mock;
      } else {
        //  console.log(Object.keys(data.result).length);
        console.log(data.result);
        this.vmTableData = data.result;
        // this.vmTableData = Object.keys(data.result).length !== 0 ? data.result : this.vm_mock;
        console.log(this.vmTableData);
        this.percentage = '%';
        this.unit = 'kbps';
        // this.degree = data.result.amp_temp === '-' ? ' ' : '°c';
        // this.rpm = data.result.fan === '-' ? ' ' : 'rpm';
        // this.volt = data.result.power_supply === '-' ? ' ' : 'volts';
        // this.disk = data.result.disk === '-' ? ' ' : '%';
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  // before moving to other components, the timer is cleared so the code be no longer executable.
  ngOnDestroy() {
    clearInterval(this.loadVMTableTimer);
    clearInterval(this.tabular_ping_interval);
  }

  // for setting the panel view to toggle between graph and tabular view, from drop down button.
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

  // on goBack button: setting all the flags to the default condition so that the component should be unique for each selection
  goBack() {
    this.isGraphDrawn = false;
    this.listedVMTable = true;
    this.isGraphViewSelected = false;
    this.isTabularViewSelected = false;
    this.ifLiveNetworkGraphSelected = true;
    this.ifHourNetworkGraphSelected = false;
    this.ifLiveCPUGraphSelected = true;
    this.ifHourCPUGraphSelected = false;

    this.scaleText_vm_cpu = 'Live data';
    this.ifLiveSelectedFromCPU = false;
    this.ifLiveCPUGraphSelected = true;
    this.ifHourCPUGraphSelected = false;

    this.scaleText_vm_downlink = 'Live data';
    this.ifLiveSelectedFromNetwork = false;
    this.ifLiveNetworkGraphSelected = true;
    this.ifHourNetworkGraphSelected = false;
  }

  setScale(from, scale) {
//  for the setting scale of wlc_cpu usage. eg. live, hour, day

    //  console.log(scale + 'in set scale');
    //  console.log(from + 'from  in set scale');
    switch (scale + '_' + from) {
      case 'live_vm_cpu':
        this.scaleText_vm_cpu = 'Live data';
        this.ifLiveSelectedFromCPU = false;
        this.ifLiveCPUGraphSelected = true;
        this.ifHourCPUGraphSelected = false;
        break;
      case 'hour_vm_cpu':
        this.scaleText_vm_cpu = 'Last 1 hour';
        this.ifLiveSelectedFromCPU = true;
        this.ifLiveCPUGraphSelected = false;
        this.ifHourCPUGraphSelected = true;
        break;

// for the setting scale of wlc_downlink eg. live, hour, day.

      case 'live_vm_downlink':
        this.scaleText_vm_downlink = 'Live data';
        this.ifLiveSelectedFromNetwork = false;
        this.ifLiveNetworkGraphSelected = true;
        this.ifHourNetworkGraphSelected = false;
        break;
      case 'hour_vm_downlink':
        this.scaleText_vm_downlink = 'Last 1 hour';
        this.ifLiveSelectedFromNetwork = true;
        this.ifLiveNetworkGraphSelected = false;
        this.ifHourNetworkGraphSelected = true;
        break;
    }
    if (from === 'vm_cpu') {
      this.scaleVal_vm_cpu = scale;
    }
    if (from === 'vm_downlink') {
      this.scaleVal_vm_downlink = scale;
    }
  }

  setRange(from, range) {
    switch (range + '_' + from) {

      // for the setting scale of wlc_cpu eg. Avg, Min, Max.

      case 'avg_vm_cpu':
        this.rangeText_vm_cpu = 'Average';
        break;
      case 'min_vm_cpu':
        this.rangeText_vm_cpu = 'Minimum';
        break;
      case 'max_vm_cpu':
        this.rangeText_vm_cpu = 'Maximum';
        break;

      // for the setting scale of wlc_downlink eg. Avg, Min, Max.

      case 'avg_vm_downlink':
        this.rangeText_vm_downlink = 'Average';
        break;
      case 'min_vm_downlink':
        this.rangeText_vm_downlink = 'Minimum';
        break;
      case 'max_vm_downlink':
        this.rangeText_vm_downlink = 'Maximum';
        break;

    }
    if (from === 'vm_cpu') {
      this.rangeVal_vm_cpu = range;
    }
    if (from === 'vm_downlink') {
      this.rangeVal_vm_downlink = range;
    }
    if (from === 'vm_downlink') {
      this.rangeVal_vm_downlink = range;
    }
  }

  ngAfterViewInit() {
    this.vmDataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
  }

}
