import {DataTable, SortEvent} from 'angular2-datatable';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Chart} from 'angular-highcharts';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {SerachbarComponent} from '../../../serachbar/serachbar.component';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {Http} from '@angular/http';
import 'rxjs/add/operator/catch'; 
import { NotificationService,commonMessages} from '../../../../services/notificationService/NotificationService';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  coloumsAPObjects: any = [];
  coloumsGroupObjects: any = [];
  coloumsVapObjects:any =[];
  apCount: number = 0;
  gpCount: number = 0;
  public vapCount : number = 0;
  vap_data;
  selectedVapname;
  vapId;
  isSsidSelected : boolean = false;
  public filterOption = true;
  public ifGraphforGroup: boolean = true;
  public ifGraphforAP: boolean = false;
  public ifGraphforSSID: boolean = false;
  public ifGraphforClient: boolean = false;
  public isGroup: boolean = false;
  public isAP: boolean = false;
  public isSSID: boolean = false;
  public isClient: boolean = false;
  public apiVal: string;
  public searchKey: string;
  public searchVal: string;
  public apMac: string;
  public selectedMac: string;
  public isApSelected: boolean = false;
  public isGroupSelected: boolean = false;
  public selectedApname = '';
  public selectedGpname = '';
  public macId;
  public grpId;
  public data;
  public ap_data;
  public grp_data;
  public rowsOnPage = 20;
  public methodName;
  public interval;
  public tabularData: any = [];
  public tabularData_unit = '';
  public _sortBy;
  public _sortOrder;
  public scaleVal_cpu: string;
  public scaleText_cpu: string = 'Live data';
  public scaleVal_ap_downlink: string;
  public scaleText_ap_downlink: string = 'Live data';
  public scaleVal_downlink: string;
  public scaleVal_open_ap: string;
  public scaleVal_downlink_2: string;
  public scaleVal_downlink_5: string;
  public scaleText_downlink: string = 'Last 1 hour';
  public scaleText_downlink_ssid_2: string = 'Last 1 hour';
  public scaleText_downlink_ssid_5: string = 'Last 1 hour';
  public scaleText_open_ap: string = 'Last 1 hour';
  public iscpuoptionOpen = false;
  public isapdownoptionOpen = false;
  public isdownoptionOpen = false;
  public isdown2optionOpen = false;
  public isdown5optionOpen = false;
  public isgroupSelected = false;
  public isdown2rangOptionOpen = false;
  public isdown5rangOptionOpen = false;
  isdownGroupOptionOpen = false;
  rangeVal_ssid_2;
  rangeVal_ssid_5;
  rangeVal_open_ap;
  rangeVal_down_group;
  rangeText_downlink_ssid_2 = 'Total';
  rangeText_downlink_ssid_5 = 'Total';
  rangeText_down_group = 'Total';
  rangeText_open_ap= 'Total';

  /* pagination declaration variable*/
   page: number = 1;
  Math:any = Math;
  firstarrowStatus:boolean = true;
  lastarrowStatus:boolean = false;

  showingto = 0;
  showingfrom = 0;
  pageModulus = 0;
  currentPage;
  dataLength;
    /*pagination declaration variable end */
  constructor(private elRef: ElementRef,
              private http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private notifyPopup : NotificationService
            ) {
  }

  ngOnInit() {
    this.setView('group', 'init');
    //this.spinnerService.show();
    this.loadData();
    this.loadAPColumnsData();
    this.loadGroupColumnData();
    this.loadVapColumnData();
  }

  ngOnDestroy() {
    //if (this.spinnerService) {
    //  this.spinnerService.hide();
    // }
    clearInterval(this.interval);
  }

  @ViewChild('mf')
  private grp_dataTable: DataTable;
  @ViewChild('mf2')
  private ap_dataTable: DataTable;

  ngAfterViewInit() {

    this.grp_dataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
    $('.upgrade-tabs .tab-links a').on('click', function (e) {
      var currentAttrValue = jQuery(this).attr('href');

      // Show/Hide Tabs
      $('.upgrade-tabs ' + currentAttrValue).show().siblings().hide();

      // Change/remove current tab to active
      $(this).parent('li').addClass('active').siblings().removeClass('active');

      e.preventDefault();
    });

  }
  loadAPColumnsData() {
    this.coloumsAPObjects = [
      {name: 'AP Name', checked: true},
      {name: 'IP Address', checked: true},
      {name: 'MAC Address', checked: true},
      {name: 'Group Name', checked: true},
      {name: 'No. of Clients', checked: true},
      {name: 'AP Model', checked: true},
      {name: 'Status', checked: true}

    ];
  }
  loadGroupColumnData() {
    this.coloumsGroupObjects = [
      {name: 'Group Name', checked: true},
      {name: 'No. of SSID', checked: true},
      {name: 'No. of AP', checked: true},
      {name: 'No. Connected Clients', checked: true}
    ];
  }
  loadVapColumnData() {
    this.coloumsVapObjects = [
      { name:'SSID Name', checked: true},
      { name:'Group', checked: true},
      { name:'Associated AP', checked: true},
      { name:'Connected Clients',  checked: true},
      { name:'Security',  checked: true}
    ];
  }



  loadData() {
    this._service.getWeb('configurations/group-configurations/', '', '').then(_data => {
      if (_data.status == 1) {
        this.grp_data = _data.result;

      } else {

      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
    this._service.getWeb('configurations/registered-ap/', '', '').then(_data => {
      if (_data.status == 1) {
        this.ap_data = _data.result['Registered_aps'];
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });

  }
  loadVapData(){
    this._service.getWeb('configurations/vap-configurations/', '', '').then(_data => {
      if (_data.status == 1) {
        this.vap_data = _data.result;

      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }
  public drawn: boolean = false;
  public selectedtab;
  public selectedVal;
  public selectedGrpVapId;
  public selectedGrpVapname;
  drawgraphs(obj, name, tab,event) {
    this.filterOption = false;
    this.rangeVal_open_ap = 'total';
    this.rangeVal_down_group = 'total';
    this.rangeVal_ssid_5 = 'total';
    this.rangeVal_ssid_2 = 'total';
    this.scaleVal_cpu = 'live';
    this.scaleVal_ap_downlink = 'live';
    this.scaleVal_downlink = 'hour';
    this.scaleVal_open_ap = 'hour';
    this.scaleVal_downlink_2 = 'hour';
    this.scaleVal_downlink_5 = 'hour';
    this.scaleText_downlink = 'Last 1 hour';
    this.scaleText_downlink_ssid_2 = 'Last 1 hour';
    this.scaleText_downlink_ssid_5 = 'Last 1 hour';
    this.scaleText_open_ap = 'Last 1 hour';
    this.scaleText_cpu = 'Live data';
    this.scaleText_ap_downlink = 'Live data';
    this.rangeText_downlink_ssid_2 = 'Total';
    this.rangeText_downlink_ssid_5 = 'Total';
    this.rangeText_down_group = 'Total';
    this.rangeText_open_ap= 'Total';
    this.filterOption = false;
    this.drawn = true;
    this.iscpuoptionOpen = false;
    this.isapdownoptionOpen = false;
    this.isdownoptionOpen = false;
    this.isdown2optionOpen = false;
    this.isdown5optionOpen = false;
    this.isgroupSelected = false;
    this.isdown2rangOptionOpen = false;
    this.isdown5rangOptionOpen = false;
    this.selectedMac = obj;
    this.apMac = obj;
    this.selectedtab = tab;
    this.selectedVal = name;
    if (tab == 'ap') {
      this.isApSelected = true;
      this.selectedApname = name;
      this.macId = this.apMac;
    }
    if (tab == 'gp') {
      this.isGroupSelected = true;
      this.selectedGpname = name;
      this.grpId = this.apMac;
    }
    if (tab == 'ssid') {
      this.isSsidSelected = true;
      this.selectedVapname = name;
      this.vapId = this.apMac;
      if(event!=undefined){
        this.selectedGrpVapId = event.target.value;
        this.selectedGrpVapname = event.target.selectedOptions["0"].innerText;
        if(this.selectedGrpVapId!='-1'){
          this.isgroupSelected = true;
        }else{
          this.isgroupSelected = false;
        }
      }else{
        this.getGroupsofVap();
        window.scrollTo(0,0);


      }
    }

  }
  public vapGroupdata = [];
  getGroupsofVap(){
    this._service.getWeb('utils/list-groups-per-vap/?vap='+this.vapId+'', '', '').then(_data => {
     //  console.log(_data);
      if (_data.status == 1) {
        this.vapGroupdata = _data.result;
        this.selectedGrpVapId =this.vapGroupdata[0][0];
        this.selectedGrpVapname =this.vapGroupdata[0][1];
        //console.log(this.selectedGrpVapname);
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }
  goback(tab) {
    this.drawn = false;
    this.filterOption = true;
    if (tab == 'gp') {
      this.isGroupSelected = false;
      this.selectedGpname = '';
      this.grpId = '';
      this.ifGraphforGroup = true;
    }
    if (tab == 'ap') {
      this.isApSelected = false;
      this.selectedApname = '';
      this.macId = '';
      this.ifGraphforAP = true;
    }
    if (tab == 'ssid') {
      this.isSsidSelected = false;
      this.selectedVapname = '';
      this.vapId = '';
      this.ifGraphforSSID = true;
      this.isgroupSelected = false;
    }
  }

  emitMac(obj) {
    let str = obj.split('|');
    this.selectedMac = str[0];
    this.apMac = str[0];
    if (str[2] == 'ap') {
      this.isApSelected = true;
      this.selectedApname = str[1];
      this.macId = this.apMac;

    }
    if (str[2] == 'gp') {
      this.isGroupSelected = true;
      this.selectedGpname = str[1];
      this.grpId = this.apMac;
    }
    if (str[2] == 'ssid') {
      this.isSsidSelected = true;
      this.selectedVapname = str[1];
      this.vapId = this.apMac;
    }


  }

  emitNextGraph() {
   // console.log('emitNextGraph');
  }

  public breadcrumbVal;

  setView(obj, from) {

   // console.log('here set');
    this.searchVal = '';
    clearInterval(this.interval);
    this.drawn = false;
    this.isGroup = false;
    this.isAP = false;
    this.isSSID = false;
    this.isClient = false;
    this.emitResult('');
    if (obj == 'group') {
      this.selectedMac = this.grpId;
      this.apMac = this.grpId;
      this.isGroup = true;
      this.apiVal = 'group-search';
      this.searchKey = 'Search Group\'s here..';
      this.breadcrumbVal = 'Group';
      this.goback('gp');
    }
    if (obj == 'ap') {
      this.ifGraphforAP = true; // as of now by default the graph will render
      this.selectedMac = this.macId;
      this.apMac = this.macId;
      this.isAP = true;
      this.apiVal = 'ap-search';
      this.searchKey = 'Search AP\'s here..';
      this.breadcrumbVal = 'AP';
      setTimeout(() => {
      this.ap_dataTable.onPageChange.subscribe((x) => {
      this.currentPage = x.activePage;
      this.dataLength = x.dataLength; 
      this.pageModulus = this.dataLength % x.rowsOnPage;
          if (x.rowsOnPage * this.currentPage > x.dataLength) {
        this.showingto = (x.rowsOnPage * (this.currentPage - 1)) + this.pageModulus;
            this.showingfrom = (this.showingto - this.pageModulus) + 1;
      } else {
        this.showingto = x.rowsOnPage * this.currentPage;
        this.showingfrom = (this.showingto - x.rowsOnPage) + 1;
      }
    });
    this.ap_dataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
    },50);
      this.goback('ap');
    }
    if (obj == 'ssid') {
      this.ifGraphforSSID = true; // as of now by default the graph will render
      this.selectedMac = this.vapId
      this.isSSID = true;
      this.apiVal = 'ssid-search';
      this.searchKey = 'Search SSID\'s here..';
      this.breadcrumbVal = 'SSID';
      this.loadVapData()
    }
    if (obj == 'client') {
      this.isClient = true;
      this.apiVal = 'client-search';
      this.searchKey = 'Search Client\'s here..';
      //this.elRef.nativeElement.querySelector('#search-input').value = '';
      this.breadcrumbVal = 'Client';

    }

  }

  changeView(obj, tab) {
    clearInterval(this.interval);
    if (obj == 'graph') {
      if (tab == 'group') {
        this.ifGraphforGroup = true;
      }
      if (tab == 'ap') {
        this.ifGraphforAP = true;
      }
      if (tab == 'ssid') {
        this.ifGraphforSSID = true;
      }
      if (tab == 'client') {
        this.ifGraphforClient = true;
      }

    } else {
      if (tab == 'group') {
        this.ifGraphforGroup = false;
        this.methodName = '';
        this.methodName = 'group-stats-table/?group=' + this.selectedMac;
      }
      if (tab == 'ap') {
        this.ifGraphforAP = false;
        this.methodName = 'ap-stats-table/?ap=' + this.selectedMac;
      }
      if (tab == 'ssid') {
        this.ifGraphforSSID = false;
        this.methodName = 'ssid-stats-table/?vap='+this.selectedMac+'&group='+ this.selectedGrpVapId;
      }
      if (tab == 'client') {
        this.ifGraphforClient = false;
        this.methodName = '';
      }
      this.loadTableData();
    }
  }

  loadTableData() {
    this._service.getWeb('statistics/' + this.methodName, '', '').then(data => {
      if (data) {
        this.tabularData = data.result;
        this.tabularData_unit = data.unit;
        this.interval = setTimeout(() => {
          this.loadTableData();
        }, 5000);
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  emitResult(obj) {
    this.searchVal = obj;
    if (this.apiVal != 'client-search') {
      let api;
      if (this.apiVal == 'ap-search') {
        api = 'utils/ap-search/?query=' + obj;
      }
      if (this.apiVal == 'group-search') {
        api = 'configurations/group-configurations/?name=' + obj;
      }
      if (this.apiVal == 'ssid-search') {
        api = 'configurations/vap-configurations/?name=' + obj;
      }

      if (obj.length > 2) {
        this._service.getWeb(api, '', '').then(_data => {
          if (_data) {
            if (_data.result.length != 0) {
              if (this.apiVal == 'ap-search') {
                this.ap_data = _data.result;
              }
              if (this.apiVal == 'group-search') {
                this.grp_data = _data.result;
              }
              if (this.apiVal == 'ssid-search') {
                this.vap_data = _data.result;
              }

            } else {
              this.ap_data = '';
              this.grp_data = '';
            }

          }
        }).catch((error) => {
          this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        });
      } else if (obj.length == 0) {
        this.loadData();
      }
    }
  }

  setScale(from, scale) {

   // console.log(scale);
    switch (scale + '_' + from) {
      case 'live_cup':
        this.scaleText_cpu = 'Live data';
        break;
      case 'hour_cpu':
        this.scaleText_cpu = 'Last 1 hour';
        break;
      case 'day_cpu':
        this.scaleText_cpu = 'Last 1 day';
        break;
      case 'live_ap_downlink':
        this.scaleText_ap_downlink = 'Live data';
        break;
      case 'hour_ap_downlink':
        this.scaleText_ap_downlink = 'Last 1 hour';
        break;
      case 'day_ap_downlink':
        this.scaleText_ap_downlink = 'Last 1 day';
        break;
      case 'live_downlink':
        this.scaleText_downlink = 'Live data';
        break;
      case 'hour_downlink':
        this.scaleText_downlink = 'Last 1 hour';
        break;
      case 'day_downlink':
        this.scaleText_downlink = 'Last  1 day';
        break;
      case 'live_open_ap':
        this.scaleText_open_ap = 'Live data';
        break;
      case 'hour_open_ap':
        this.scaleText_open_ap = 'Last 1 hour';
        break;
      case 'day_open_ap':
        this.scaleText_open_ap = 'Last  1 day';
        break;
      case 'hour_downlink_ssid_2':
        this.scaleText_downlink_ssid_2 = 'Last 1 hour';
        break;
      case 'day_downlink_ssid_2':
        this.scaleText_downlink_ssid_2 = 'Last  1 day';
        break;
      case 'hour_downlink_ssid_5':
        this.scaleText_downlink_ssid_5 = 'Last 1 hour';
        break;
      case 'day_downlink_ssid_5':
        this.scaleText_downlink_ssid_5 = 'Last 1 day';
        break;

    }
    if (from == 'cpu') {
      this.removeClass('cpu_options');
      this.iscpuoptionOpen = false;
      this.scaleVal_cpu = scale;
    }
    if (from == 'ap_downlink') {
      this.removeClass('ap_downlink_options');
      this.isapdownoptionOpen = false;
      this.scaleVal_ap_downlink = scale;
    }
    if (from == 'downlink') {
      this.removeClass('downlink_options');
      this.isdownoptionOpen = false;
      this.scaleVal_downlink = scale;
    }
    if (from == 'open_ap') {
      this.removeClass('open_ap_options');
      this.isopenApoptionOpen = false;
      this.scaleVal_open_ap = scale;
    }
    if (from == 'downlink_ssid_2') {
      this.removeClass('downlink_ssid_2_options');
      this.isdown2optionOpen = false;
      this.scaleVal_downlink_2 = scale;
    }
    if (from == 'downlink_ssid_5') {
      this.removeClass('downlink_ssid_5_options');
      this.isdown5optionOpen = false;
      this.scaleVal_downlink_5 = scale;
    }


  }

  setRange(from, range) {
    switch (range + '_' + from) {
      case 'total_downlink_ssid_2':
        this.rangeText_downlink_ssid_2 = 'Total';
        break;
      case 'avg_downlink_ssid_2':
        this.rangeText_downlink_ssid_2 = 'Average';
        break;
      case 'min_downlink_ssid_2':
        this.rangeText_downlink_ssid_2 = 'Minimum';
        break;
      case 'max_downlink_ssid_2':
        this.rangeText_downlink_ssid_2 = 'Maximum';
        break;
      case 'total_downlink_ssid_5':
        this.rangeText_downlink_ssid_5 = 'Total';
        break;
      case 'avg_downlink_ssid_5':
        this.rangeText_downlink_ssid_5 = 'Average';
        break;
      case 'min_downlink_ssid_5':
        this.rangeText_downlink_ssid_5 = 'Minimum';
        break;
      case 'max_downlink_ssid_5':
        this.rangeText_downlink_ssid_5 = 'Maximum';
        break;
      case 'total_down_group':
        this.rangeText_down_group = 'Total';
        break;
      case 'avg_down_group':
        this.rangeText_down_group = 'Average';
        break;
      case 'min_down_group':
        this.rangeText_down_group = 'Minimum';
        break;
      case 'max_down_group':
        this.rangeText_down_group = 'Maximum';
        break;
      case 'total_open_ap':
        this.rangeText_open_ap = 'Total';
        break;
      case 'avg_open_ap':
        this.rangeText_open_ap = 'Average';
        break;
      case 'min_open_ap':
        this.rangeText_open_ap = 'Minimum';
        break;
      case 'max_open_ap':
        this.rangeText_open_ap = 'Maximum';
        break;
    }
    if (from == 'downlink_ssid_2') {
      this.removeClass('downlink_ssid_2_options_range');
      this.isdown2rangOptionOpen = false;
      this.rangeVal_ssid_2 = range;
    }
    if (from == 'downlink_ssid_5') {
      this.removeClass('downlink_ssid_5_options_range');
      this.isdown5rangOptionOpen = false;
      this.rangeVal_ssid_5 = range;
    }
    if (from == 'down_group') {
      this.removeClass('down_group_options_range');
      this.isdownGroupOptionOpen = false;
      this.rangeVal_down_group = range;
    }
    if (from == 'open_ap') {
      this.removeClass('open_ap_options_range');
      this.isopenApoptionOpen = false;
      this.rangeVal_open_ap = range;
    }
  }
  isopenApoptionOpen = false;
  isopenApRangeoptionOpen = false;
  openOptions(from, event) {

   // console.log(from);
    if (!this.iscpuoptionOpen && from == 'cpu') {
      this.addClass('cpu_options');
      this.iscpuoptionOpen = true;
    } else if (this.iscpuoptionOpen) {
      this.removeClass('cpu_options');
      this.iscpuoptionOpen = false;
    }
    if (!this.isapdownoptionOpen && from == 'ap_downlink') {
      this.addClass('ap_downlink_options');
      this.isapdownoptionOpen = true;
    } else if (this.isapdownoptionOpen) {
      this.removeClass('ap_downlink_options');
      this.isapdownoptionOpen = false;
    }
    if (!this.isdownoptionOpen && from == 'downlink') {
      this.addClass('downlink_options');
      this.isdownoptionOpen = true;
    } else if (this.isdownoptionOpen) {
      this.removeClass('downlink_options');
      this.isdownoptionOpen = false;
    }
    if (!this.isopenApoptionOpen && from == 'open_ap') {
      this.addClass('open_ap_options');
      this.isopenApoptionOpen = true;
    } else if (this.isopenApoptionOpen) {
      this.removeClass('open_ap_options');
      this.isopenApoptionOpen = false;
    }
    if (!this.isdown2optionOpen && from == 'ssid_downlink_2') {
      this.addClass('downlink_ssid_2_options');
      this.isdown2optionOpen = true;
    } else if (this.isdown2optionOpen) {
      this.removeClass('downlink_ssid_2_options');
      this.isdown2optionOpen = false;
    }
    if (!this.isdown5optionOpen && from == 'ssid_downlink_5') {
      this.addClass('downlink_ssid_5_options');
      this.isdown5optionOpen = true;
    } else if (this.isdown5optionOpen) {
      this.removeClass('downlink_ssid_5_options');
      this.isdown5optionOpen = false;
    }
    if (!this.isdown2rangOptionOpen && from == 'ssid_downlink_2_range') {
      this.addClass('downlink_ssid_2_options_range');
      this.isdown2rangOptionOpen = true;
    } else if (this.isdown2rangOptionOpen) {
      this.removeClass('downlink_ssid_2_options_range');
      this.isdown2rangOptionOpen = false;
    }
    if (!this.isdown5rangOptionOpen && from == 'ssid_downlink_5_range') {
      this.addClass('downlink_ssid_5_options_range');
      this.isdown5rangOptionOpen = true;
    } else if (this.isdown5rangOptionOpen) {
      this.removeClass('downlink_ssid_5_options_range');
      this.isdown5rangOptionOpen = false;
    }
    if (!this.isdownGroupOptionOpen && from == 'down_group_range') {
      this.addClass('down_group_options_range');
      this.isdownGroupOptionOpen = true;
    } else if (this.isdownGroupOptionOpen) {
      this.removeClass('down_group_options_range');
      this.isdownGroupOptionOpen = false;
    }
    if (!this.isopenApRangeoptionOpen && from == 'open_ap_range') {
      this.addClass('open_ap_options_range');
      this.isopenApRangeoptionOpen = true;
    } else if (this.isopenApRangeoptionOpen) {
      this.removeClass('open_ap_options_range');
      this.isopenApRangeoptionOpen = false;
    }

  }

  addClass(className) {
    this.elRef.nativeElement.querySelector('.' + className).classList.add('open');
  }

  removeClass(className) {
    this.elRef.nativeElement.querySelector('.' + className).classList.remove('open');
  }

  selectAPColoums(event, index) {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.checked == false)
      this.apCount = this.apCount + 1;
    else {
      this.apCount = this.apCount - 1;
    }
    if (this.apCount <= 4) {
      this.coloumsAPObjects[index].checked = event.target.checked;
    } else
      this.coloumsAPObjects[index].checked = true;
  }

  selectGroupColoums(event, index) {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.checked == false)
      this.gpCount = this.gpCount + 1;
    else {
      this.gpCount = this.gpCount - 1;
    }
    if (this.gpCount <= 4) {
      this.coloumsGroupObjects[index].checked = event.target.checked;
    } else
      this.coloumsGroupObjects[index].checked = true;
  }

  selectVapColoums(event, index) {
    event.stopPropagation();
    event.preventDefault();
    if (event.target.checked == false)
      this.vapCount = this.vapCount + 1;
    else {
      this.vapCount = this.vapCount - 1;
    }
    if (this.vapCount <= 3) {
      this.coloumsVapObjects[index].checked = event.target.checked;
    } else
      this.coloumsVapObjects[index].checked = true;
  }



  holdPopup(event) {
    event.stopPropagation();
  }

   /* pagination method here*/
   getNext(page){
         this.page = page;
      if(this.page == 1){
        this.firstarrowStatus = true;
        this.lastarrowStatus = false; 
      }else if(this.page == this.Math.ceil(this.ap_data.length/this.rowsOnPage))
        { 
          this.lastarrowStatus = true;
           this.firstarrowStatus = false; 
        }
           else{
            this.firstarrowStatus = false;
             this.lastarrowStatus = false;
           }}
    goToPage(num){
      this.getNext(num);
    }
      /* pagination method here end*/
  
}
