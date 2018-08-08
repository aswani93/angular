import { Component, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Http } from '@angular/http';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { NotificationService, commonMessages } from '../../../../services/notificationService/NotificationService';
import { TooltipService } from '../../../../services/tooltip/tooltip.service';
import { commonUrl } from '../../../../services/urls/common-url';
import * as io from 'socket.io-client';


@Component({
  selector: 'app-redundancy',
  templateUrl: './redundancy.component.html',
  styleUrls: ['./redundancy.component.css']
})
export class RedundancyComponent implements OnInit {

  systemRedundancy: FormGroup;
  iperrorStatus = false;
  btndisable = true;
  data;
  newJson = {};
  private url = commonUrl.dynamicsocket;
  private socket;
  IPpattern = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;
  IPv6Pattern=/^^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/;
  constructor(
    private elRef: ElementRef, private http: Http,
    private _service: WebserviceService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    private notifyPopup: NotificationService,
    private tooltipService: TooltipService
  ) { //this.socket = io(this.url); 
  }

  ngOnInit() {
    this.loadData();
    this.systemRedundancy = new FormGroup({
      "redundancy_wlc_ip": new FormControl('', [
        Validators.required,
        Validators.pattern(this.IPpattern)
      ]),
      'redundancy_enabled': new FormControl(),
     // 'redundancy_wlc_ipv6' : new FormControl('',[Validators.pattern(this.IPv6Pattern)])
    })

  }

  formReset() {
    this.systemRedundancy.reset();
    this.iperrorStatus = true;
    this.loadData();
  }

  loadData() {
    this.notifyPopup.showLoader('Please wait..');
    this._service.getWeb('configurations/redundancy-update/', '', '').then(_result => {
      if (_result) {
        this.data = _result.result;
     // this.systemRedundancy.get('redundancy_wlc_ipv6').setValue('fe80::52b:994f:e809:c660');
        this.systemRedundancy.setValue(this.data);
        
        this.notifyPopup.hideLoader('');
      }
    });
  }

  onSubmit() {
    this.notifyPopup.showLoader(commonMessages.save_systemConfig);
    // this.newJson['redundancy_wlc_ip'] = this.systemRedundancy.get('redundancy_wlc_ip').value;
    this._service.putJson('configurations/redundancy-update/', this.systemRedundancy.value).then(_result => {
   
      if (_result.status == 1) {
          this.notifyPopup.hideLoader('');
            this.notifyPopup.success("Settings applied successfully");
           
            //this.spinnerService.hide();
            setTimeout(() => {
              this.loadData();
            }, 2500);
       
      } else {
        setTimeout(() => {
          this.notifyPopup.hideLoader('');
          this.notifyPopup.error(commonMessages.serverError);
         this.loadData();
        }, 2500);

      }
    });
  }

  validateIP() {
    // alert( this.systemRedundancy.get('redundancy_ipv4').value)
    var value = this.systemRedundancy.get('redundancy_wlc_ip').value;
    var result = value.split(".");
    if (result[0].length == 0) {
      this.iperrorStatus = true;
      this.btndisable = true;
    } else if (result[0] == "127" || result[0] == "8" || result[0] == "4" ||  result[1] == "0") {
      this.iperrorStatus = true;
      this.btndisable = true;
    } else if (result[0] < 224 && result[0] >= 1 && result[3] < 255) {
      this.iperrorStatus = false;
      this.btndisable = false;
    }
    else {
      this.iperrorStatus = true;
      this.btndisable = true;
    }


  }

  checkAnyUpdate() {
    let data = this.systemRedundancy.value;
   


    // if (this.data.redundancy_wlc_ip == this.systemRedundancy.get('redundancy_wlc_ip').value) {

    //   this.btndisable = true;
    // } else {
    //   this.btndisable = false;
    //   this.iperrorStatus = false;
    // }
    this.newJson = {};
    for (let key in data) {
      if (data[key] != this.data[key]) {
        this.newJson[key] = data[key];
      }
    }

    let count = Object.keys(this.newJson).length;

    if (count > 0) {
      this.btndisable = false;
    } else {
      this.btndisable = true;
      this.iperrorStatus = false;
    }
  }
  ngAfterViewInit() {

    window.scrollTo(0, 0);
    this.systemRedundancy.valueChanges.subscribe(() => {
      this.checkAnyUpdate();
    });


    jQuery(document).ready(function () {
      $('.upgrade-tabs .tab-links a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');

        // Show/Hide Tabs
        $('.upgrade-tabs ' + currentAttrValue).show().siblings().hide();

        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');

        e.preventDefault();
      });
    });
    $('#select-filter').change(function () {
      var selectedOption = $(this).val();
      $('.filter-content').hide();
      $('#' + selectedOption).show();
      // console.log(aa);
    });
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }

}

