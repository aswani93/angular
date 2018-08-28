import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { Http } from '@angular/http';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DataTable, SortEvent } from 'angular2-datatable';
import { NotificationService, commonMessages } from '../../../../services/notificationService/NotificationService';

@Component({
  selector: 'app-rogue-apmonitoring',
  templateUrl: './rogue-apmonitoring.component.html',
  styleUrls: ['./rogue-apmonitoring.component.css']
})

export class RogueApmonitoringComponent implements OnInit {
  public rogueAPForm: FormGroup;
  public data;
  public unknownData;
  public detectedValuesArray;
  public UnknowndetectedValuesArray;
  public _sortBy;
  private autoRefreshTable;
  public _sortOrder;
  @ViewChild('mf')
  private rogueAPTable: DataTable;
  @ViewChild('mf2')
  private dataTable: DataTable;

  private autoRefreshTime: Number = 50000;
  public interval_details;
  selectallCheck = false;
  selectedDHCPMAC = [];
  selectedknownDHCPMAC = [];
  selectAllFlag = false;
  RadioCount_2;
  isChecked = false;
  UnknownRadioCount_2;
  UnknownRadioCount_5;
  RadioCount_5;

  roghAPConfigStatus = false;
  newJson;
  public rowsOnPage = 20;
  private showingfrom = 0;
  private showingto = 0;
  private pageModulus = 0;
  public currentPage;
  public dataLength;

  public rowsOnPage1 = 20;
  private showingfrom1 = 0;
  private showingto1 = 0;
  private pageModulus1 = 0;
  public currentPage1;
  public dataLength1;
  coloumsObjects;

  constructor(public http: Http, private _service: WebserviceService, private notifyPopup: NotificationService, private elRef: ElementRef) { }
  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {

    clearInterval(this.autoRefreshTable);
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }

  }


  loadData() {
    this.selectedDHCPMAC = [];
    this.notifyPopup.showLoader('Please wait....')
    this.coloumsObjects = [
      { name: 'AP Name', checked: true },
      { name: 'IP Address', checked: true },
      { name: 'MAC Address', checked: true },
      { name: 'Group Name', checked: true },
      { name: 'No. of Clients', checked: true },
      { name: 'AP Model', checked: true },
      { name: 'Status', checked: true }

    ];

    this._service.getWeb('statistics/known-ap-list/', '', '').then(_data => {
      if (_data.status == '1') {

        this.data = _data.result.data;
        this.RadioCount_2 = _data.result.radio_two_count;
        this.RadioCount_5 = _data.result.radio_five_count;
        this.notifyPopup.hideLoader('');
        // this.interval_details = setInterval(() => {
        //   this.loadData();
        // }, 50000);


      } else {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error('Some thing went wrong');
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
    //unknownAP APIO Call
    this._service.getWeb('statistics/unknown-ap-list/', '', '').then(_data => {
      if (_data.status == '1') {

        this.unknownData = _data.result.data;
        this.UnknownRadioCount_2 = _data.result.radio_two_count;
        this.UnknownRadioCount_5 = _data.result.radio_five_count;
        this.notifyPopup.hideLoader('');



      } else {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error('Some thing went wrong');
      }
      this.autoRefreshTable = setInterval(() => this.fetchDataFromServer(), this.autoRefreshTime);
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });


  }

  fetchDataFromServer() {

    this._service.getWeb('statistics/known-ap-list/', '', '').then(_data => {
      if (_data.status == '1') {

        this.data = _data.result.data;
        this.RadioCount_2 = _data.result.radio_two_count;
        this.RadioCount_5 = _data.result.radio_five_count;
        this.notifyPopup.hideLoader('');
        // this.interval_details = setInterval(() => {
        //   this.loadData();
        // }, 50000);

      } else {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.serverError);
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
    //unknownAP APIO Call
    this._service.getWeb('statistics/unknown-ap-list/', '', '').then(_data => {
      if (_data.status == '1') {

        this.unknownData = _data.result.data;
        this.UnknownRadioCount_2 = _data.result.radio_two_count;
        this.UnknownRadioCount_5 = _data.result.radio_five_count;
        this.notifyPopup.hideLoader('');



      } else {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error('Some thing went wrong');
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });

  }
  callDelete() {
    if (this.selectedknownDHCPMAC.length > 0) {
      this.notifyPopup.showLoader(commonMessages.delete_knownAP);
    this._service.deleteWeb('statistics/known-ap-list/?ap_mac=' + this.selectedknownDHCPMAC, '').then(_data => {
      if (_data.status == "1") {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.success(commonMessages.AP_delete_success);
        setTimeout(() => {
          this.reset();
        }, 2000);
      } else {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.InternalserverError);
        setTimeout(() => {
          this.reset();
        }, 2000);
      }
    });
    }
  }
  reset() {
    this.loadData();
    this.selectAllFlag = false;
    this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
  }

  checkboxClick(e, mac) {
    e.stopPropagation();
    if (e.target.checked) {
      this.selectedDHCPMAC.push(mac);
      this.isChecked = true;
      this.elRef.nativeElement.querySelector('#movebutton').classList.remove('disabled');
    } else {

      this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
      let currentVap = this.selectedDHCPMAC.find(function (arr) {
        return arr == mac;
      });
      let idx = this.selectedDHCPMAC.indexOf(currentVap);
      this.selectedDHCPMAC.splice(idx, 1);

      if (this.selectedDHCPMAC.length < 1) {
        this.selectAllFlag = false;
        this.selectedDHCPMAC = [];
        this.isChecked = false;
        this.elRef.nativeElement.querySelector('#movebutton').classList.add('disabled');
      }

    }
  }

  knowncheckboxClick(mac, e) {
    e.stopPropagation();
    if (e.target.checked) {
      this.selectedknownDHCPMAC.push(mac);
      this.isChecked = true;
      this.elRef.nativeElement.querySelector('#deletebtn').classList.remove('disabled');
    } else {

      this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
      let currentVap = this.selectedknownDHCPMAC.find(function (arr) {
        return arr == mac;
      });
      let idx = this.selectedknownDHCPMAC.indexOf(currentVap);
      this.selectedknownDHCPMAC.splice(idx, 1);

      if (this.selectedknownDHCPMAC.length < 1) {
        this.selectAllFlag = false;
        this.selectedknownDHCPMAC = [];
        this.isChecked = false;
        this.elRef.nativeElement.querySelector('#deletebtn').classList.add('disabled');
      }

    }
  }
  getDetectedValue(val) {
    var count = Object.keys(this.data).length;

    for (var i = 0; i < count; i++) {
      if (this.data[i]['known_ssid_mac'] == val) {
        this.detectedValuesArray = this.data[i].detected_by_info;
      }
    }
  }

  getDetectedUnknowAPValue(val) {
    var count = Object.keys(this.unknownData).length;
    for (var i = 0; i < count; i++) {
      if (this.unknownData[i]['unknown_ssid_mac'] == val) {
        this.UnknowndetectedValuesArray = this.unknownData[i].detected_by_info;
      }
    }
  }

  callMovetoKnownAPI() {
    if (this.selectedDHCPMAC.length < 1) {
      this.notifyPopup.warn("Please select atleast one AP from the list")
    } else {
      this.notifyPopup.showLoader('Processing the data');
      this._service.postJson('statistics/rougueap-move/', this.selectedDHCPMAC).then(_result => {
        if (_result.status == '1') {
          this.notifyPopup.hideLoader('')
          this.notifyPopup.success("AP moved successfully.")
          setTimeout(() => {
            this.reset();
          }, 2000);

        } else {

          this.notifyPopup.hideLoader('');
          this.notifyPopup.error(commonMessages.InternalserverError);
          setTimeout(() => {
            this.reset();
          }, 2000);

        }

      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    }
  }

  selectAll(e) {
    this.selectedDHCPMAC = [];
    var count = Object.keys(this.unknownData).length;
    if (e.target.checked) {
      this.selectAllFlag = true;


      for (var i = 0; i < count; i++) {
        this.selectedDHCPMAC.push(this.unknownData[i].unknown_ssid_mac);
      }

      this.isChecked = true;
      this.elRef.nativeElement.querySelector('#movebutton').classList.remove('disabled');
      if (count == 0) {
        this.elRef.nativeElement.querySelector('#movebutton').classList.add('disabled');
      }
    } else {
      this.unchekAll();
      this.selectAllFlag = false;
      this.selectedDHCPMAC = [];
      this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false
      this.isChecked = false;
      this.elRef.nativeElement.querySelector('#movebutton').classList.add('disabled');
    }
  }


  knownselectAll(e) {
    this.selectedknownDHCPMAC = [];
    var count = Object.keys(this.data).length;
    if (e.target.checked) {
      this.selectAllFlag = true;


      for (var i = 0; i < count; i++) {
        this.selectedknownDHCPMAC.push(this.data[i].known_ssid_mac);
      }

      this.isChecked = true;
      this.elRef.nativeElement.querySelector('#deletebtn').classList.remove('disabled');
      if (count == 0) {
        this.elRef.nativeElement.querySelector('#deletebtn').classList.add('disabled');
      }
    } else {
      this.unchekAll();
      this.selectAllFlag = false;
      this.selectedknownDHCPMAC = [];
      this.isChecked = false;
      this.elRef.nativeElement.querySelector('#deletebtn').classList.add('disabled');
    }
  }


  unchekAll() {
    var chkLen = this.elRef.nativeElement.querySelectorAll('.ssid-check').length;
    for (var i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.ssid-check')[i]['checked'] = false;
    }
  }
  ngAfterViewInit() {
    this.rogueAPTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });

    this.rogueAPTable.onPageChange.subscribe((x) => {

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


    this.dataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });

    this.dataTable.onPageChange.subscribe((x) => {

      this.currentPage1 = x.activePage;
      this.dataLength1 = x.dataLength;
      this.pageModulus1 = this.dataLength1 % x.rowsOnPage;
      if (x.rowsOnPage * this.currentPage1 > x.dataLengt1) {
        this.showingto1 = (x.rowsOnPage * (this.currentPage1 - 1)) + this.pageModulus1;
        this.showingfrom1 = (this.showingto1 - this.pageModulus1) + 1;
      } else {
        this.showingto1 = x.rowsOnPage * this.currentPage1;
        this.showingfrom1 = (this.showingto1 - x.rowsOnPage) + 1;
      }


    });



  }

}
