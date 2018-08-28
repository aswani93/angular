import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { NotificationService, commonMessages } from '../../../../services/notificationService/NotificationService';
import { DataTable, SortEvent } from 'angular2-datatable';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { ScrollHelper } from '../../../../helpers/scroll-helper/scrollHelper';


@Component({
  selector: 'app-rogue-ap',
  templateUrl: './rogue-ap.component.html',
  styleUrls: ['./rogue-ap.component.css']
})
export class RogueApComponent implements OnInit {

  constructor(private _service: WebserviceService, private notifyPopup: NotificationService, private elRef: ElementRef) { }
  public showUpdatedAPnames = [];
  public rogue_2dot4g_aps = [];
  public rogue_5g_aps = [];
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
  public offlineAPs = [];
  private scrollHelper: ScrollHelper = new ScrollHelper();
  focused = false;

  ngOnInit() {
    this.rogueAPForm = new FormGroup({
      'rogue_ap_2dot4_policy': new FormControl("5", []),
      'is_rogue_ap_2dot4_enabled': new FormControl(false, []),
      'rogue_ap_5_policy': new FormControl("5", []),
      'is_rogue_ap_5_enabled': new FormControl(false, [])
    })
    this.loadData();
    this.notifyPopup.confirmationOk().subscribe((page) => {
      this.submitDataToServer();
    });
    this.notifyPopup.showing().subscribe(() =>{
      this.showUpdatedRogueAPs();
    });
    this.rogueAPForm.get('is_rogue_ap_2dot4_enabled').valueChanges.subscribe(val => {    
        if(val){
          this.rogueAPForm.get('rogue_ap_2dot4_policy').enable();
        } else { 
          this.rogueAPForm.get('rogue_ap_2dot4_policy').disable();
          if(this.Editdata['rogue_ap_2dot4_policy'] == "0" || this.Editdata['rogue_ap_2dot4_policy'] == undefined)
            this.rogueAPForm.patchValue({'rogue_ap_2dot4_policy': "5"});
          else
            this.rogueAPForm.patchValue({'rogue_ap_2dot4_policy': this.Editdata['rogue_ap_2dot4_policy']});
        }        
    });
    this.rogueAPForm.get('is_rogue_ap_5_enabled').valueChanges.subscribe(val => {
      if(val){
        this.rogueAPForm.get('rogue_ap_5_policy').enable();
      } else {
        // console.log(this.Editdata);
        this.rogueAPForm.get('rogue_ap_5_policy').disable();
        if(this.Editdata['rogue_ap_5_policy'] == "0" || this.Editdata['rogue_ap_5_policy'] == undefined)
         this.rogueAPForm.patchValue({'rogue_ap_5_policy':"5"});
        else
         this.rogueAPForm.patchValue({'rogue_ap_5_policy':this.Editdata['rogue_ap_5_policy']});
      }
    })
  }

  showUpdatedRogueAPs(){
    let updatedRogueAPs = [];
    for(let i=0;i<this.showUpdatedAPnames.length;i++){
      updatedRogueAPs.push({
        ap_mac_name: this.showUpdatedAPnames[i],
        ap_macs_2dot4g: this.rogue_2dot4g_aps[i],
        ap_macs_5g: this.rogue_5g_aps[i]
      });
    }
   this.notifyPopup.rogueap_success_detials(updatedRogueAPs);
  }

  reset() {
    this.rogueAPForm.reset();
    this.focused = false;
    this.selectedAPArray = [];
    this.selectAllFlag = false;
    this.roghAPConfigStatus = false;
    this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    this.fetchDataFromServer();
    

  }





  double_click_event(event, vap, index) {
    this.rogueAPForm.reset();
    this.selectedAPArray = [];
    this.selectAllFlag = false;
    this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;

    // //this.selectedVapArray = [];
    // this.clickactive = -1;
    // //this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    // var chkLen = this.elRef.nativeElement.querySelectorAll('.register-table-check').length;
    // for (var i = 0; i < chkLen; i++) {
    //   this.elRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = false;
    // }
    // this.selectedAPArray.push(vap);
    // if (this.selectedAPArray.length == 1) {
    //   // this.selectedAPArray.push(vap.ap_mac);
    //   this.clickactive = index;
    //   this.elRef.nativeElement.querySelectorAll('.register-table-check')[index]['checked'] = true;

    // } else {
    //   this.selectedAPArray = null;
    // }
    // this.EditAp();

    let chkLen = this.elRef.nativeElement.querySelectorAll('.register-table-check').length;
    for (let i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.register-table-check')[i]['checked'] = false;
    }
    this.selectedAPArray.push(vap);
    // this.elRef.nativeElement.querySelectorAll('.register-table-check')[index]['checked'] = true;
    this.elRef.nativeElement.querySelectorAll('.register-table-check')[index]['checked'] = true;
    this.EditAp();
    
  }

  selectAll(e) {
    this.selectedAPArray = [];
    var count = Object.keys(this.data).length;
    if (e.target.checked) {
      this.selectAllFlag = true;


      for (var i = 0; i < count; i++) {
        this.selectedAPArray.push(this.data[i]);
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

    this.showUpdatedAPnames = [];
    this.rogue_2dot4g_aps = [];
    this.rogue_5g_aps = [];

    if(this.rogueAPForm.get('is_rogue_ap_2dot4_enabled').value==null){
      this.rogueAPForm.get('is_rogue_ap_2dot4_enabled').setValue(false);
    }else  if(this.rogueAPForm.get('is_rogue_ap_5_enabled').value==null){
      this.rogueAPForm.get('is_rogue_ap_5_enabled').setValue(false);
    }
   
    this.newJson = this.rogueAPForm.value;
    this.newJson['ap_mac'] = [];


    for( let ap of this.selectedAPArray){
      this.showUpdatedAPnames.push(ap.ap_name);
      if(this.offlineAPs.indexOf(ap.ap_mac) != -1){
        this.rogue_2dot4g_aps.push(0);
        this.rogue_5g_aps.push(0);
      } else {
        this.newJson['ap_mac'].push(ap.ap_mac);
        let channel2dot4g = (this.newJson.is_rogue_ap_2dot4_enabled == true)?1:0;
        let channel5g = (this.newJson.is_rogue_ap_5_enabled == true)?1:0;
        this.rogue_2dot4g_aps.push(channel2dot4g);
        this.rogue_5g_aps.push(channel5g);
      }
    }

    if(this.newJson['ap_mac'].length > 0) {
      let status2dot4g = (this.newJson.is_rogue_ap_2dot4_enabled == false)?'2.4G':'';
      let status5g = (this.newJson.is_rogue_ap_5_enabled == false)?
                      (status2dot4g != '')?' and 5G':'5G':'';
      let alertMessage = "Auto RF setting will be disabled for "+status2dot4g+status5g+" since Rogue AP setting have been disabled."
      
      if(status2dot4g != '' || status5g !=''){
        this.notifyPopup.info(alertMessage);
      }
      else{
        this.submitDataToServer();
    }
    } else {
      this.notifyPopup.error(commonMessages.offlineAutoRFUpdateError);
    }
    
  }

  submitDataToServer(){
    this.focused = false;
    this._service.putJson('configurations/rogue-ap-info/', this.newJson).then(_result => {
      if (_result.status == 1) {
        this.scrollHelper.scrollTo(document.getElementsByClassName('apList')[0]);
        this.notifyPopup.success_details("Settings applied successfully.");
        this.rogueAPForm.reset();
        this.focused = false;
        this.selectedAPArray = [];
        this.selectAllFlag = false;
        this.roghAPConfigStatus = false;
        this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
        this.unchekAll();
        // setTimeout(() => {
        //   this.reset();
        // }, 30000);

      } else {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        
      }


    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval_details);
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
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
    this.fetchDataFromServer();
    this.interval_details = setInterval(() => {
      this.fetchDataFromServer();
      }, 50000);

    
  }

  fetchDataFromServer(){
    this.notifyPopup.showLoader('Loading Rogue AP Data ...');
    this._service.getWeb('configurations/registered-ap/', '', '').then(_data => {
      if (_data.status == '1') {
        this.offlineAPs = [];
        this.data = _data.result['Registered_aps'];
        for(let ap of this.data){
          if(ap.status != 1){
            this.offlineAPs.push(ap.ap_mac);
          }
        }
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

      this.selectedAPArray.push(ap);
      if (this.selectedAPArray.length == 1) {
        this.ap_mac = ap.ap_mac;
        this.AP_name = ap.ap_name;
      } else {
        this.ap_mac = null;
      }

    } else {
      let currentData = this.selectedAPArray.find(function (arr) {
        return arr.group_id == ap.group_id;
      });
      let idx = this.selectedAPArray.indexOf(currentData);
      this.selectedAPArray.splice(idx, 1);
      if (this.selectedAPArray.length == 1) {
        this.AP_name = this.selectedAPArray[0].ap_name;
      }
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
            this.fetchDataFromServer();
          }, 2000);

          //sessionStorage.clear();
        } else {
          this.notifyPopup.hideLoader('');
          this.notifyPopup.error(commonMessages.InternalserverError)
          setTimeout(() => {
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
    
    if (this.selectedAPArray.length == 1) {
      var mac = this.selectedAPArray[0].ap_mac;
      this.roghAPConfigStatus = true;
      this._service.getWeb('configurations/rogue-ap-info/?ap_mac=' + mac + '', '', '').then(_data => {

        if (_data.status == '1') {
          this.Editdata = _data['result'];
          // if radio disabled set default value as 5 min
          if (!this.Editdata.is_rogue_ap_2dot4_enabled || this.Editdata['rogue_ap_2dot4_policy'] == '0') {
            this.Editdata.rogue_ap_2dot4_policy = '5'
          }
          if (!this.Editdata.is_rogue_ap_5_enabled || this.Editdata['rogue_ap_5_policy'] == '0') {
            this.Editdata.rogue_ap_5_policy = '5'
          }
          this.rogueAPForm.setValue(this.Editdata);
          this.notifyPopup.hideLoader('');
        }

      });

    } else if (this.selectedAPArray.length == 0) {
      this.notifyPopup.error(commonMessages.AP_edit_select);
      return false;
    } else {
      this.roghAPConfigStatus = true;
      this.rogueAPForm.patchValue({'rogue_ap_2dot4_policy': '5'});
      this.rogueAPForm.patchValue({'rogue_ap_5_policy':'5'});
      this.Editdata=this.rogueAPForm.value;
      // console.log(JSON.stringify(this.Editdata))
    }
    this.setFocus();
  }
  checkAnyUpdate() {
    let fileObject = this.rogueAPForm.getRawValue();
    this.Editdata  = (this.Editdata == undefined)?{}:this.Editdata;
    // console.log(this.Editdata);
    // console.log(fileObject);
    if (_.isEqual(this.Editdata, fileObject)) {
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

  ngAfterViewChecked(){
    
    if(!this.focused){
      this.scrollHelper.doScroll();
    }

  }

  setFocus() {
    this.scrollHelper.scrollToFirst("regApList");
    setTimeout(() => {
      this.focused = true;
    },500);

  }

  search(event){
    let val = event.target.value;
    if(val.length > 2){
      this.selectedAPArray = [];
      clearInterval(this.interval_details);
      this._service.getWeb('utils/rogue-ap-search/?query=' + val +'&search_from=rogue'+'', '', '').then(_data => {
        if(_data){
          if(_data.result.length != 0){
            this.data = _data.result;
            this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
            this.unchekAll();
          }else {
            this.data = '';
          }
        }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);;
    });
  }else if(val.length == 0) {
    this.fetchDataFromServer();
    }
  }

}
