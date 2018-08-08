import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { NotificationService, commonMessages } from '../../../../services/notificationService/NotificationService';
import { DataTable, SortEvent } from 'angular2-datatable';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as _ from 'lodash';


@Component({
  selector: 'app-rogue-ap',
  templateUrl: './rogue-ap.component.html',
  styleUrls: ['./rogue-ap.component.css']
})
export class RogueApComponent implements OnInit {

  constructor(private _service: WebserviceService, private notifyPopup: NotificationService, private elRef: ElementRef) { }
  public data;
  public interval_details;
  public Editdata;
  btnDisable = false;
  public rogueAPForm: FormGroup;
  public selectedAPArray: any = [];
  selectAllFlag = false;
  filelist;
  filename;
  clickactive;
  public _sortBy;
  public _sortOrder;
  @ViewChild('mf') private rogueAPTable: DataTable;
  invalid = [];
  roghAPConfigStatus = false;
  private socket;
  public selectedVlanArray = [];
  newJson;

  ap_mac;
  AP_name
  public rowsOnPage = 20;
  private showingfrom = 0;
  private showingto = 0;
  private pageModulus = 0;
  public currentPage;
  public dataLength;
  coloumsObjects;
  ngOnInit() {
    this.rogueAPForm = new FormGroup({
      'rogue_ap_2dot4_policy': new FormControl("1", []),
      'is_rogue_ap_2dot4_enabled': new FormControl(false, []),
      'rogue_ap_5_policy': new FormControl("10", []),
      'is_rogue_ap_5_enabled': new FormControl(false, [])
    })
    this.loadData();

    if (this.rogueAPForm.get('is_rogue_ap_2dot4_enabled').value) {

    }

  }

  reset() {
    this.rogueAPForm.reset();
    this.selectedAPArray = [];
    this.selectAllFlag = false;
    this.roghAPConfigStatus = false;
    this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    this.loadData();
  }





  double_click_event(event, vap, index) {
    this.reset();
    //this.selectedVapArray = [];
    this.clickactive = -1;
    //this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    var chkLen = this.elRef.nativeElement.querySelectorAll('.register-table-check').length;
    for (var i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = false;
    }
    this.selectedAPArray.push(vap.ap_mac);
    if (this.selectedAPArray.length == 1) {
      // this.selectedAPArray.push(vap.ap_mac);
      this.clickactive = index;
      this.elRef.nativeElement.querySelectorAll('.register-table-check')[index]['checked'] = true;

    } else {
      this.selectedAPArray = null;
    }
    this.EditAp();
  }

  selectAll(e) {
    this.selectedAPArray = [];
    var count = Object.keys(this.data).length;
    if (e.target.checked) {
      this.selectAllFlag = true;


      for (var i = 0; i < count; i++) {
        this.selectedAPArray.push(this.data[i].ap_mac);
      }

      // this.elRef.nativeElement.querySelector('#movebutton').classList.remove('disabled');
      // if (count == 0) {
      //   this.elRef.nativeElement.querySelector('#movebutton').classList.add('disabled');
      // }
    } else {
      this.unchekAll();
      this.selectAllFlag = false;
      this.selectedAPArray = [];
    }
  }

  unchekAll() {
    var chkLen = this.elRef.nativeElement.querySelectorAll('.ssid-check').length;
    for (var i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.ssid-check')[i]['checked'] = false;
    }
  }
  submitData() {
    this.newJson = this.rogueAPForm.value;
    if(this.rogueAPForm.get('is_rogue_ap_2dot4_enabled').value==null){
      this.rogueAPForm.get('is_rogue_ap_2dot4_enabled').setValue(false);
    }else  if(this.rogueAPForm.get('is_rogue_ap_5_enabled').value==null){
      this.rogueAPForm.get('is_rogue_ap_5_enabled').setValue(false);
    }
    this.newJson['ap_mac'] = this.selectedAPArray;
    this._service.putJson('configurations/rogue-ap-info/', this.newJson).then(_result => {
      if (_result.status == 1) {


        this.notifyPopup.success("Settings applied successfully.")
        setTimeout(() => {
          this.loadData();
          this.reset();
        }, 3000);

      } else {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        this.reset();
        setTimeout(() => {
          this.loadData();
        }, 2000);
      }


    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      this.reset();
      this.loadData();
    });



  }

  ngOnDestroy() {
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
    clearInterval(this.interval_details);
  }

  loadData() {
   // this.selectedAPArray = [];
   // this.notifyPopup.showLoader('Please Wait...')
    this.coloumsObjects = [
      { name: 'AP Name', checked: true },
      { name: 'IP Address', checked: true },
      { name: 'MAC Address', checked: true },
      { name: 'Group Name', checked: true },
      { name: 'No. of Clients', checked: true },
      { name: 'AP Model', checked: true },
      { name: 'Status', checked: true }

    ];



    this._service.getWeb('configurations/registered-ap/', '', '').then(_data => {
      if (_data.status == '1') {

        this.data = _data.result['Registered_aps'];
        this.notifyPopup.hideLoader('');
        this.interval_details = setInterval(() => {
        this.loadData();
        }, 300000);


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

      var macValue = event.target.value;
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

  fileupload(event) {
    var files = event.target.files;
    this.filelist = files;
    this.filename = this.filelist[0].name;
    let file: File = this.filelist[0];
    var name = this.filename.search('known_ap_2_4_list');
    var name1 = this.filename.search('known_ap_5_list');

    let formdata: FormData = new FormData();
    if ((name != -1 || name1 != -1) && file.size > 0) {
      formdata.append('file', file);
      this._service.postFiles('statistics/rouge-file/', formdata).then(_data => {
        if (_data.json().status == '1') {
          this.notifyPopup.hideLoader('');
          this.notifyPopup.success('File uplaoded sucessfully');
          setTimeout(() => {
            this.loadData();
          }, 2000);

          //sessionStorage.clear();
        } else {
          this.notifyPopup.hideLoader('');
          this.notifyPopup.error(commonMessages.InternalserverError)
          setTimeout(() => {
            this.loadData();
            this.reset();
          }, 2000);
        }
      });
    } else {
      if (file.size === 0) {
        this.notifyPopup.error('Empty file');
        // this.spinnerService.hide();
      } else {
        this.notifyPopup.error('Invalid file');
        // this.spinnerService.hide();
      }
    }

    // this.uploadfile();
    event.target.value = '';
  }

  EditAp() {

    if (Object.keys(this.selectedAPArray).length == 1) {
      var mac = this.selectedAPArray;
      this.roghAPConfigStatus = true;
      this._service.getWeb('configurations/rogue-ap-info/?ap_mac=' + mac + '', '', '').then(_data => {

        if (_data.status == '1') {
          this.Editdata = _data['result'];
          // if radio disabled set default value as 5 min
          if (!this.Editdata.is_rogue_ap_2dot4_enabled) {
            this.Editdata.rogue_ap_2dot4_policy = '5'
          }
          if (!this.Editdata.is_rogue_ap_5_enabled) {
            this.Editdata.rogue_ap_5_policy = '5'
          }
          this.rogueAPForm.setValue(this.Editdata);
          this.notifyPopup.hideLoader('');
        }

      });

    } else if (Object.keys(this.selectedAPArray).length == 0) {
      this.notifyPopup.error("Select one Rogue AP");
      return false;
    } else {
      this.roghAPConfigStatus = true;
      this.rogueAPForm.get('rogue_ap_2dot4_policy').setValue('10');
      this.rogueAPForm.get('rogue_ap_5_policy').setValue('10');
      this.Editdata=this.rogueAPForm.value;
      // console.log(JSON.stringify(this.Editdata))
    }

  }
  checkAnyUpdate() {
    let jsonArry = this.rogueAPForm.value;
    // console.log(JSON.stringify(jsonArry)+ " dd "+JSON.stringify(this.Editdata))
    if (_.isEqual(this.Editdata, jsonArry)) {
      this.btnDisable = true;
    } else {
      this.btnDisable = false;
    }

    

  }
  ngAfterViewInit() {
    this.rogueAPTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });

    this.rogueAPForm.valueChanges.subscribe(() => {
      this.checkAnyUpdate();
      if (this.rogueAPForm.get('is_rogue_ap_2dot4_enabled').value == true) {
        this.rogueAPForm.get('rogue_ap_2dot4_policy').setValidators([Validators.required])
      } else {
        this.rogueAPForm.get('rogue_ap_2dot4_policy').clearValidators();
      }
      if (this.rogueAPForm.get('is_rogue_ap_5_enabled').value == true) {
        this.rogueAPForm.get('rogue_ap_5_policy').setValidators([Validators.required])
      } else {
        this.rogueAPForm.get('rogue_ap_5_policy').clearValidators();
      }
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

}
