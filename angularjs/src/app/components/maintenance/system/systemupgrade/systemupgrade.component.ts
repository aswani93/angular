import { Component, OnInit, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { NotificationService, commonMessages } from '../../../../services/notificationService/NotificationService';
import { FormControl, FormGroupName, Validators, FormGroup } from '@angular/forms';
import { TooltipService } from '../../../../services/tooltip/tooltip.service';


@Component({
  selector: 'app-systemupgrade',
  templateUrl: './systemupgrade.component.html',
  styleUrls: ['./systemupgrade.component.css']
})
export class SystemupgradeComponent implements OnInit {
  systemupgradeForm: FormGroup;
  public data;
  public filelist: FileList;
  public alertPopUp;
  public filename;
  wcm_success;
  public uploadbuttondisabled = true;
  public upgradebuttondisabled = true;
  selectedfirmwarename;
  selecteduploadedby;
  typestatus = false;
  interval;
  isText;
  ftpname;
  upgradeType;
  upgrade_uploadby;
  ftpnamevaluestatus = false;
  iperrorStatus = false;
  private pattern = /^[-a-zA-Z0-9-()]+([_@./#&+]+[-a-zA-Z0-9-()]+)*$/;
  IPpattern = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;

  constructor(private http: Http,
    private elRef: ElementRef,
    private _service: WebserviceService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    private notifyPopup: NotificationService,
    private tooltipService: TooltipService
  ) { }

  ngOnInit() {
    this.notifyPopup.confirmationOk().subscribe((page) => {
      if (page == 'systemUpgrade') {
        this.firmwareUpgrade();
      }
    });
    this.loadData();
    // this.spinnerService.show();
    this.systemupgradeForm = new FormGroup({
      'wlc_system_firmware_name': new FormControl('HFCL_WLC_test.tar.gz', [
        Validators.minLength(2),
        Validators.maxLength(32),
        
      ]),
      'wlc_system_UPgradefirmware_ip': new FormControl('192.168.98.31', [
        Validators.pattern(this.IPpattern),
      ]),
      'wlc_system_upgrade_username': new FormControl('test123456', [
        Validators.minLength(2),
        Validators.maxLength(32),
        Validators.pattern(this.pattern)
      ]),
      'wlc_system_upgrade_password': new FormControl('test123456', [
        Validators.minLength(2),
        Validators.maxLength(32),
        Validators.pattern(this.pattern)
      ]),
      'uploadStatus': new FormControl(),
      'upgradecheckbox': new FormControl()
    });
  }

  validateIP() {
    var value = this.systemupgradeForm.get('wlc_system_UPgradefirmware_ip').value;
    var result = value.split(".");
    if (result[0].length == 0) {
      this.iperrorStatus = true;
      this.uploadbuttondisabled = true;
    } else if (result[0] == "127" || result[0] == "8" || result[0] == "4" || result[3] == 255 ||  result[1] == "0") {
      this.iperrorStatus = true;
      this.uploadbuttondisabled = true;
    } else if (result[0] < 224 && result[0] >= 1 && result[3] <= 254) {
      this.iperrorStatus = false;
      this.uploadbuttondisabled = false;
    }
  }

  loadData() {
   
    let details;
    this._service.getWeb('maintenance/wlc-system-image-upload/', '', '').then(_data => {//console.log(_data);
      if (_data) {
        this.data = _data['result'];
      }
    });
  }
  callTableLsitAPI() {
    this.loadData();
  }

  showpassword() {
    if (!this.isText) {
      this.isText = true;
    } else {
      this.isText = false;
    }
  }

  ftpnamevaidation() {
    this.ftpname = this.systemupgradeForm.get('wlc_system_firmware_name').value;
    var name = this.ftpname.search('HFCL_WLC');
    var type = this.ftpname.search('.tar.gz');
    if (name != -1 && type != -1) {
      this.ftpnamevaluestatus = false;
    } else {
      this.ftpnamevaluestatus = true;
    }

  }

  fileupload(event) {
    var files = event.target.files;
    this.filelist = files;
    this.filename = this.filelist[0].name;
    this.uploadbuttondisabled = false;
    let file: File = this.filelist[0];
    var name = this.filename.search('HFCL_WLC');
    var type = this.filename.search('.tar.gz');
    if (name != -1 && type != -1 && file.size < 500000000 && file.size > 0) {
      // this.uploadfile();
      this.uploadbuttondisabled = false;
    } else {
      if (file.size > 500000000) {
        this.notifyPopup.error('Firmware size is exceeded');
        // this.spinnerService.hide();
      }
      else if (file.size < 0) {
        this.notifyPopup.error('Empty firmware file');
        // this.spinnerService.hide();
      } else {
        this.notifyPopup.error('Invalid Firmware');
        // this.spinnerService.hide();
      }
      this.reset();
    }

    // this.uploadfile();
  }

  ngOnDestroy() {
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
  }

  reset() {

    this.filename = '';
    this.uploadbuttondisabled = true;
    this.upgradebuttondisabled = true;
    this.typestatus = false;
    this.systemupgradeForm.reset();
    this.loadData();
    if (this.systemupgradeForm.valid) {      
      this.uploadbuttondisabled = true; 
         }
  }

  formReset() {
    this.systemupgradeForm.reset();
    this.loadData();
  }

  uploadfile() {
    // this.spinnerService.show();
    let uploadtype;
    let doupload;
    if (this.elRef.nativeElement.querySelector('#select-filter').value == 'local') {

      uploadtype = 2;
    } else if (this.elRef.nativeElement.querySelector('#select-filter').value == 'ftp') {
      uploadtype = 1;
    }
    if (this.systemupgradeForm.get('uploadStatus').value == null || this.systemupgradeForm.get('uploadStatus').value == false) {
      doupload = 0;
    } else if (this.systemupgradeForm.get('uploadStatus').value == true) {
      doupload = 1;
    }
    this.notifyPopup.showLoader(commonMessages.maintenance_system_update);
    this.alertService.close(this.alertPopUp);
    let formdata: FormData = new FormData();
    if (uploadtype == 2) {
      formdata.append('file', this.filelist[0]);
    } else if (uploadtype == 1) {
      formdata.append('ip_address', this.systemupgradeForm.get('wlc_system_UPgradefirmware_ip').value);
      formdata.append('username', this.systemupgradeForm.get('wlc_system_upgrade_username').value);
      formdata.append('password', this.systemupgradeForm.get('wlc_system_upgrade_password').value);
      formdata.append('name', this.systemupgradeForm.get('wlc_system_firmware_name').value);
    }

    formdata.append('upload', uploadtype);
    formdata.append('do_upgrade', doupload);
    this._service.postFiles('maintenance/wlc-system-image-upload/', formdata).then(_data => {

      // let newjson=_data.json().msg;

      this.notifyPopup.hideLoader('');
      this.wcm_success=false;
      if (_data.json().status == 0) {
        this.wcm_success=true;
        this.notifyPopup.error(_data.json().msg);
        this.formReset();
        this.reset();
        return;

      } else if (_data.json().status == 1) {
        this.wcm_success=true;
        this.loadData();
        this.notifyPopup.success('Firmware upload successfully');
        this.formReset();
        this.reset();

        return;
      }
      // this.interval = setInterval(() => {
      //   if(!this.wcm_success){
      //     this.notifyPopup.hideLoader('');
      //    // this.spinnerService.hide();
      //     // this.errorMsg = 'WCM not responding';
      //     // this.showModal();
      //     this.notifyPopup.error("Network is too slow, Try after some time");
      //     clearInterval(this.interval)
      //   }
      // }, 10000);
  

    });

  }

  confirmSystemFirmwareUpgrade() {
    this.notifyPopup.info('Are you want to upgrade this firmware ?');
  }

  firmwareUpgrade() {
    // var status = this.selectedUpgradeJSON();
    let formdata: FormData = new FormData();
    this.upgradeType = 1;
    this.upgrade_uploadby = 1;
    formdata.append('upload_type', this.upgradeType);
    formdata.append('do_upgrade', this.upgrade_uploadby);
    formdata.append('file', this.selectedfirmwarename);
    formdata.append('uploaded_by', this.selecteduploadedby);
    this.notifyPopup.showLoader(commonMessages.maintenance_AP_upgrade);
   // this.wcm_success=false;
    this._service.postFiles('maintenance/wlc-system-image-upload/', formdata).then(_data => {
      this.notifyPopup.hideLoader('');
      this.notifyPopup.success('Firmware upgrade sucessfully,It will take some time to reboot');
      //sessionStorage.clear();
      this.wcm_success=true;

    });
   
  }



  // selectedUpgradeJSON() {
  //   var chkLen = this.elRef.nativeElement.querySelectorAll('.register-check').length;
  //   var selectedvalues;
  //   for (var j = 0; j < chkLen; j++) {
  //     if (this.elRef.nativeElement.querySelectorAll('.register-check')[j]['checked'] == true) {
  //       selectedvalues = this.elRef.nativeElement.querySelectorAll('.register-check')[j].value;
  //       alert(this.elRef.nativeElement.querySelectorAll('.register-check')[j].value);
  //       selectedvalues = selectedvalues.split(",");
  //       this.selectedfirmwarename = selectedvalues[0];
  //       this.selecteduploadedby = selectedvalues[1];
  //       console.log(selectedvalues[0] +"   "+ selectedvalues[1])

  //     }
  //   }
  // }
  valuechanges(event, firmwarename, uploadedby) {
    this.selectedfirmwarename = firmwarename;
    this.selecteduploadedby = uploadedby;
    if (event.target.checked) {
      this.upgradebuttondisabled = false;
    } else {
      this.upgradebuttondisabled = true;
    }
  }

  ngAfterViewInit() {
    window.scrollTo(0, 0);
    this.systemupgradeForm.valueChanges.subscribe(() => {  
          if (this.systemupgradeForm.valid) {      
              this.uploadbuttondisabled = false; 
                 }
                   })
    $('.upgrade-tabs .tab-links a').on('click', function (e) {
      var currentAttrValue = jQuery(this).attr('href');
      // Show/Hide Tabs
      $('.upgrade-tabs ' + currentAttrValue).show().siblings().hide();
      // Change/remove current tab to active
      $(this).parent('li').addClass('active').siblings().removeClass('active');

      e.preventDefault();
    });
    $('#select-filter').change(function () {
      var selectedOption = $(this).val();

      $('.filter-content').hide();
      $('#' + selectedOption).show();
      // console.log(aa);
    });
  }
  uploadtypeChange(event) {

    if (event.target.value == 'ftp') {
      this.typestatus = true;
      this.systemupgradeForm.get('wlc_system_firmware_name').setValue("");
      this.systemupgradeForm.get('wlc_system_UPgradefirmware_ip').setValue("");
      this.systemupgradeForm.get('wlc_system_upgrade_username').setValue("");
      this.systemupgradeForm.get('wlc_system_upgrade_password').setValue("");
    } else {
      this.typestatus = false;
      this.systemupgradeForm.get('wlc_system_firmware_name').setValue("HFCL_WLC.tar.gz");
      this.systemupgradeForm.get('wlc_system_UPgradefirmware_ip').setValue("192.168.100.124");
      this.systemupgradeForm.get('wlc_system_upgrade_username').setValue("test123456789");
      this.systemupgradeForm.get('wlc_system_upgrade_password').setValue("tesr123456789");
    }
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }
}
