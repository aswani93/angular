import {AfterContentChecked, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataTable, SortEvent} from 'angular2-datatable';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {NotificationService, commonMessages} from '../../../../services/notificationService/NotificationService';


@Component({
  selector: 'app-access-general',
  templateUrl: './access-general.component.html',
  styleUrls: ['./access-general.component.css']
})
export class AccessGeneralComponent implements OnInit, AfterViewInit, AfterViewInit {
  tabType: any = 'group';
  gpCount: number = 0;
  apCount: number = 0;
  coloumsGroupObjects: any = [];
  coloumsAPObjects: any = [];
  isGroupSelected: boolean = false;
  isApSelected: boolean = false;
  _sortBy: any;
  _sortOrder: any;
  grp_data: any;
  ap_data: any;
  filterOption: boolean = true;
  rowsOnPage = 20;
  group_details: any;
  AP_details: any;
  searchVal: any;
  selector_name: any;
  apiVal: string = 'group-search';
;
  searchKey: string = 'Search Group\'s here..';

  showingto = 0;
  showingfrom = 0;
  pageModulus = 0;
  currentPage;
  dataLength;
  showingto2 = 0;
  showingfrom2 = 0;
  dataLength2;
  @ViewChild('mf')
  private grp_dataTable: DataTable;
  @ViewChild('mf2')
  private ap_dataTable: DataTable;

  /* pagination declaration variable*/
  page: number = 1;
  Math: any = Math;
  firstarrowStatus: boolean = true;
  lastarrowStatus: boolean = false;

  /*pagination declaration variable end */
  constructor(private _service: WebserviceService, private notifyPopup: NotificationService) {
  }

  ngOnInit() {
    this.loadData();
    this.loadGroupColumnData();
    this.loadAPColumnsData();
  }

  ngAfterViewInit() {
    // this.grp_dataTable.onPageChange.subscribe((x) => {
    //   this.currentPage = x.activePage;
    //   this.dataLength = x.dataLength;
    //   this.pageModulus = this.dataLength % x.rowsOnPage;
    //   if (x.rowsOnPage * this.currentPage > x.dataLength) {
    //     this.showingto = (x.rowsOnPage * (this.currentPage - 1)) + this.pageModulus;
    //     this.showingfrom = (this.showingto - this.pageModulus) + 1;
    //   } else {
    //     this.showingto = x.rowsOnPage * this.currentPage;
    //     this.showingfrom = (this.showingto - x.rowsOnPage) + 1;
    //   }
    // });


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


  loadData() {
    this.notifyPopup.showLoader('Loading Group Data');
    this._service.getWeb('configurations/group-configurations/', '', '').then(_data => {
      if (_data.status == 1) {
        this.grp_data = _data.result;
        this.notifyPopup.hideLoader('');
      } else {

      }
    });
    this._service.getWeb('configurations/registered-ap/', '', '').then(_data => {
      if (_data.status == 1) {
        this.ap_data = _data.result['Registered_aps'];
        // console.log('' + JSON.stringify(this.ap_data));

      }
    });

  }


  loadGroupColumnData() {
    this.coloumsGroupObjects = [
      {name: 'Group Name', checked: true},
      {name: 'No. of SSID', checked: true},
      {name: 'No. of AP', checked: true},
      {name: 'No. Connected Clients', checked: true}
    ];
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

  goback(tab) {
    this.filterOption = true;
    this.selector_name = '';
    if (tab == 'gp') {
      this.isGroupSelected = false;

      // this.selectedGpname = '';
      // this.grpId = '';
      // this.ifGraphforGroup = true;
    }
    else if (tab == 'ap') {
      this.isApSelected = false;
      // this.selectedApname = '';
      // this.macId = '';
      // this.ifGraphforAP = true;
    }

  }

  holdPopup(event) {
    event.stopPropagation();
  }

  openDetailsPage(obj, tab) {
    this.filterOption = false;
    if (tab == 'group') {
      this.isGroupSelected = !this.isGroupSelected;
      this.selector_name = obj.group_name;
      this._service.getWeb('configurations/group-details/?group_id=' + obj.group_id, '', '').then(_data => {
        if (_data.status == 1) {
          this.group_details = _data.results;
          console.log('' + JSON.stringify(_data));

        }
      });
    } else {
      this.isApSelected = !this.isApSelected;
      this.selector_name = obj.ap_name;
      this._service.getWeb('configurations/ap-details/?ap_mac=' + obj.ap_mac, '', '').then(_data => {
        if (_data.status == 1) {
          this.AP_details = _data.results;
          console.log(_data.results);

        }
      });
    }
  }


  setView(obj, from) {
    if (obj == 'group') {
      this.apiVal = 'group-search';
      this.searchKey = 'Search Group\'s here..';

    }
    else if (obj == 'accessPoint') {
      this.apiVal = 'ap-search';
      this.searchKey = 'Search AP\'s here..';
      setTimeout(() => {
        this.ap_dataTable.onPageChange.subscribe((x) => {
          this.currentPage = x.activePage;
          this.dataLength2 = x.dataLength;
          this.pageModulus = this.dataLength2 % x.rowsOnPage;
          console.log(x.rowsOnPage + '////////' + this.pageModulus + '//////' + this.currentPage + '//////' + this.dataLength2);


          if (x.rowsOnPage * this.currentPage > x.dataLength) {
            this.showingto2 = (x.rowsOnPage * (this.currentPage - 1)) + this.pageModulus;
            console.log(this.showingto2 + '////////' + this.pageModulus + '//////' + this.currentPage + '//////' + this.dataLength2);

            this.showingfrom2 = (this.showingto2 - this.pageModulus) + 1;
          } else {
            this.showingto2 = x.rowsOnPage * this.currentPage;
            this.showingfrom2 = (this.showingto2 - x.rowsOnPage) + 1;
          }
        });


        this.ap_dataTable.onSortChange.subscribe((event: SortEvent) => {
          this._sortBy = event.sortBy;
          this._sortOrder = event.sortOrder;
        });

      }, 50);

    }
    this.searchLoad(this.apiVal);
  }


  emitResult(obj) {
    this.searchVal = obj;
    let api;
    if (this.apiVal == 'ap-search') {
      api = 'utils/ap-search/?query=' + obj;
    }
    if (this.apiVal == 'group-search') {
      api = 'configurations/group-configurations/?name=' + obj;
    }

    if (obj.length > 2) {
      console.log(obj);
      this._service.getWeb(api, '', '').then(_data => {
        if (_data) {
          if (_data.result.length != 0) {
            if (this.apiVal == 'ap-search') {
              this.ap_data = _data.result;
            }
            if (this.apiVal == 'group-search') {
              this.grp_data = _data.result;
            }

          } else {
            this.ap_data = '';
            this.grp_data = '';
          }

        }
      });
    } else if (obj.length == 0) {
      this.searchLoad(this.apiVal);
    }

  }

  searchLoad(val) {
    if (val == 'group-search') {
      this._service.getWeb('configurations/group-configurations/', '', '').then(_data => {
        if (_data.status == 1) {
          this.grp_data = _data.result;
        } else {

        }
      });
    } else {
      this._service.getWeb('configurations/registered-ap/', '', '').then(_data => {
        if (_data.status == 1) {
          this.ap_data = _data.result['Registered_aps'];
        }
      });
    }

  }

  /* pagination method here*/
  getNext(page) {
    this.page = page;
    if (this.page == 1) {
      this.firstarrowStatus = true;
      this.lastarrowStatus = false;
    } else if (this.page == this.Math.ceil(this.ap_data.length / this.rowsOnPage)) {
      this.lastarrowStatus = true;
      this.firstarrowStatus = false;
    }
    else {
      this.firstarrowStatus = false;
      this.lastarrowStatus = false;
    }
  }

  goToPage(num) {
    this.getNext(num);
  }

  /* pagination method here end*/

}
