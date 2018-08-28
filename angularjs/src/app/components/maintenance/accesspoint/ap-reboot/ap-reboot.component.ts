import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {NotificationService, commonMessages} from '../../../../services/notificationService/NotificationService';
import {DataTable, SortEvent} from 'angular2-datatable';
import {FormGroup, Validators, FormControl} from '@angular/forms';


@Component({
  selector: 'app-ap-reboot',
  templateUrl: './ap-reboot.component.html',
  styleUrls: ['./ap-reboot.component.css']
})
export class ApRebootComponent implements OnInit, AfterViewInit {

  constructor(private _service: WebserviceService, private notifyPopup: NotificationService, private elRef: ElementRef) {
  }

  public data;
  public rogueAPForm: FormGroup;
  public selectedAPArray: any = [];
  selectAllFlag = false;
  public _sortBy;
  public _sortOrder;
  @ViewChild('mf') private rogueAPTable: DataTable;
  invalid = [];
  roghAPConfigStatus = false;
  newJson;

  ap_mac;
  AP_name;
  public rowsOnPage = 20;
  showingfrom = 0;
  showingto = 0;
  pageModulus = 0;
  currentPage;
  dataLength;
  coloumsObjects;

  /* pagination declaration variable*/
  page = 1;
  Math: any = Math;
  firstarrowStatus = true;
  lastarrowStatus = false;

  /*pagination declaration variable end */

  ngOnInit() {
    this.notifyPopup.confirmationOk().subscribe((page) => {
      if (page === 'apReboot') {
        this.rebootAP();
      }
    });

    this.rogueAPForm = new FormGroup({
      'rogue_ap_2dot4_policy': new FormControl('10', []),
      'is_rogue_ap_2dot4_enabled': new FormControl(false, []),
      'rogue_ap_5_policy': new FormControl('10', []),
      'is_rogue_ap_5_enabled': new FormControl(false, [])
    });
    this.loadData();
  }

  reset() {
    this.rogueAPForm.reset();
    this.selectedAPArray = [];
    this.loadData();
    this.selectAllFlag = false;
    this.roghAPConfigStatus = false;

  }

  selectAll(e) {
    console.log('SelectedAP-MAC Array in before select all', this.selectedAPArray);
    this.selectedAPArray = [];
    const count = Object.keys(this.data).length;
    if (e.target.checked) {
      this.selectAllFlag = true;
      for (let i = 0; i < count; i++) {
        this.selectedAPArray.push(this.data[i].ap_mac);
      }
      console.log('SelectedAP-MAC Array in after select all', this.selectedAPArray);
    } else {
      this.unCheckAll();
      this.selectAllFlag = false;
      this.selectedAPArray = [];
    }
  }

  unCheckAll() {
    const chkLen = this.elRef.nativeElement.querySelectorAll('.ssid-check').length;
    for (let i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.ssid-check')[i]['checked'] = false;
    }
  }

  loadData() {
    this.selectedAPArray = [];
    this.notifyPopup.showLoader('Please Wait...');
    this.coloumsObjects = [
      {name: 'AP Name', checked: true},
      {name: 'IP Address', checked: true},
      {name: 'MAC Address', checked: true},
      {name: 'Group Name', checked: true},
      {name: 'No. of Clients', checked: true},
      {name: 'AP Model', checked: true},
      {name: 'Status', checked: true}

    ];


    this._service.getWeb('configurations/registered-ap/', '', '').then(_data => {
      if (_data.status == '1') {

        this.data = _data.result['Registered_aps'];
        this.notifyPopup.hideLoader('');
      } else {
        this.notifyPopup.hideLoader('');
        // this.spinnerService.hide();
        this.notifyPopup.error(commonMessages.InternalserverError);
        // this.errorMsg = 'Some thing went wrong';
        // this.showModal();
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  checkboxClick(ap, event) {
    if (event.target.checked) {
      // this.clickCount++;

      const macValue = event.target.value;
      this.selectedAPArray.push(macValue);
      if (this.selectedAPArray.length == 1) {
        this.ap_mac = ap.ap_mac;
        this.AP_name = ap.ap_name;
      } else {
        this.ap_mac = null;
      }

    } else {
      let currentData = this.selectedAPArray.find(function (arr) {
        return arr == event.target.value;
      });
      let idx = this.selectedAPArray.indexOf(currentData);
      this.selectedAPArray.splice(idx, 1);
    }

  }


  onSubmit() {
    // console.log('clicked');
    this.notifyPopup.info('Are you sure to reboot AP?');
  }

  rebootAP() {
    console.log(this.selectedAPArray);
    this.notifyPopup.success(commonMessages.rougeAP_reboot_initiated);
    if (this.selectedAPArray.length > 0) {
      let reboot_ap_array = '';
      for (let ap of this.selectedAPArray) {
        reboot_ap_array = reboot_ap_array + ',' + ap;
      }
      // remove starting commas and appends as query params
      reboot_ap_array = reboot_ap_array.replace(/^,/, '');
      console.log(reboot_ap_array);

      this._service.postJson('maintenance/ap-reboot/', reboot_ap_array).then(_data => {
        if (_data.status == 1) {
          this.notifyPopup.hideLoader('');
          this.notifyPopup.success(commonMessages.rougeAP_reboot_success);
          setTimeout(() => {
            //  this.formReset();
            this.loadData();
          }, 1000);
        } else {
          this.notifyPopup.error(commonMessages.rougeAp_failed_Reboot);
          //  this.formReset();
          this.loadData();
        }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    } else {
      this.notifyPopup.error(commonMessages.selectoneRougeAP_Reboot);
      // return false;
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

    $(document).ready(function () {
      $('.group-config-tabs .tab-links a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');

        // Show/Hide Tabs
        $('.group-config-tabs ' + currentAttrValue).show().siblings().hide();

        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');

        e.preventDefault();
      });
    });


  }

  /* pagination method here*/
  getNext(page) {
    this.page = page;
    if (this.page == 1) {
      this.firstarrowStatus = true;
      this.lastarrowStatus = false;
    } else if (this.page == this.Math.ceil(this.data.length / this.rowsOnPage)) {
      this.lastarrowStatus = true;
      this.firstarrowStatus = false;
    } else {
      this.firstarrowStatus = false;
      this.lastarrowStatus = false;
    }
  }

  goToPage(num) {
    this.getNext(num);
  }

  /* pagination method here end*/


}
