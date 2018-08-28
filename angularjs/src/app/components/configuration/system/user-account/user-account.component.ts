import { Component, OnInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Http } from '@angular/http';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { NotificationService, commonMessages } from '../../../../services/notificationService/NotificationService';
import { TooltipService } from '../../../../services/tooltip/tooltip.service';
import * as _ from 'lodash';
import { ScrollHelper } from '../../../../../app/helpers/scroll-helper/scrollHelper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {
  public userAccountForm: FormGroup;
  loginedInusername;
  private pattern = /^[-a-zA-Z0-9-()]+([_@./#&+]+[-a-zA-Z0-9-()]+)*$/;
  isText;
  addUserStatus = false;
  focused = false;
  private scrollHelper: ScrollHelper = new ScrollHelper();
  data;
  editUsername;
  editData;
  updateJSON;
  userID;
  confirmPasswordStatus = true;
  newJson;
  savebuttonstatus = true;
  updateButtonStatus = false;
  addbuttondisabled = true;
  btnDisabled;
  updatebtnDisabled = true;
  focusInterval;

  passwordmismatch;
  constructor(private elRef: ElementRef, private http: Http,
    private _service: WebserviceService,
    private notifyPopup: NotificationService,
    private tooltipService: TooltipService, private renderer: Renderer, private router: Router) {
  }
  loadData() {
    window.scrollTo(0, 0);
    this.addUserStatus = false;
    this.notifyPopup.showLoader('Please wait..');
    this._service.getWeb('accounts/user-list/', '', '').then(_result => {
      if (_result) {
        // this.data['user_name'] = _result.result[0].user_name;
        // this.data['password'] = _result.result[0].password;
        // this.data['confirmPassword'] = _result.result[0].password;
        // this.data['user_type'] = _result.result[0].user_type;
        this.data = _result.result;
        this.notifyPopup.hideLoader('');
        //  let idx = this.data.indexOf(sessionStorage.getItem('username'));
        //   this.data.splice(idx, 1);
        //   console.log(this.data)
        //  this.userAccountForm.setValue(this.data);
      }
    });
  }

  ngOnInit() {
    this.loginedInusername = sessionStorage.getItem('username');
    this.loadData();
    this.userAccountForm = new FormGroup({

      'user_name': new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
        Validators.pattern(this.pattern)
      ]),
      'password': new FormControl(),
      'confirmPassword': new FormControl(),
      'user_type': new FormControl('0', [])

    })
  }

  editUseraccount(userID) {
    this.addbuttondisabled = false;
    this.userID = userID;
    this.savebuttonstatus = false;
    this.updateButtonStatus = true;
    this.userAccountForm.get('password').setValidators([
      Validators.minLength(8),
      Validators.maxLength(32),
      Validators.pattern(this.pattern)]);
    this.userAccountForm.get('confirmPassword').clearValidators();
    this._service.getWeb('accounts/user-list/' + userID, '', '').then(_result => {
      this.addUserStatus = true;
      this.editData = _result.result;
      this.updateJSON = _result.result;
      this.userAccountForm.get('user_name').setValue(this.editData.user_name);
      this.userAccountForm.get('user_type').setValue(this.editData.user_type);
      this.editUsername = this.editData.user_email;
      this.userAccountForm.get('password').setValidators([
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern(this.pattern)]);
      this.userAccountForm.get('confirmPassword').clearValidators();
      this.confirmPasswordStatus = false;
      this.setFocus();
    });
  }
  update() {
    let json = {};
    if (this.editData['user_name'] != this.userAccountForm.get('user_name').value) {
      json['user_name'] = this.userAccountForm.get('user_name').value;
    }
    if (this.editData['user_type'] != this.userAccountForm.get('user_type').value) {
      json['user_type'] = this.userAccountForm.get('user_type').value;
    }

    this.notifyPopup.showLoader(commonMessages.save_systemConfig)
    json['user_email'] = this.editData['user_email'];
    if (this.userAccountForm.get('password').value != null) {
      json['password'] = this.userAccountForm.get('password').value;
    }
    this._service.putJson('accounts/user-list/' + this.userID, json).then(_result => {

      if (_result.status == '1') {

        this.notifyPopup.hideLoader('');
        this.notifyPopup.success(commonMessages.useraccount_update_success);

        setTimeout(() => {
          this.reset();
          if (this.editUsername == this.loginedInusername) {
            sessionStorage.setItem('token', '');
            sessionStorage.setItem('vrrp_configured', '-');
            sessionStorage.setItem('netmask_vrrp', '-');
            sessionStorage.setItem('netmask_wlc', '-');
            sessionStorage.setItem('wlc_ip', '-');
            sessionStorage.setItem('vrrp_configured', '-');
            this.router.navigate(['/login']);
            document.cookie = 'session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          }
        }, 3000);
      } else {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.InternalserverError);
        setTimeout(() => {
          this.reset();
        }, 3000);
      }
    }).catch(() => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      this.reset();
    });

  }
  delete(userID, useremail) {
    this.notifyPopup.showLoader("Please wait...");
    this._service.deleteWeb('accounts/user-list/' + userID + '?user_email=' + useremail, '').then(_result => {
      if (_result.status == '1') {
        this.notifyPopup.success(commonMessages.useraccount_delete);
        setTimeout(() => {
          this.reset();
        }, 3000);
      } else {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error(commonMessages.InternalserverError);
        setTimeout(() => {
          this.reset();
        }, 3000);
      }
    }).catch(() => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }
  validateconfirmpassword() {

    if (this.userAccountForm.get('password').value != this.userAccountForm.get('confirmPassword').value) {
      this.passwordmismatch = true;
      this.btnDisabled = true;
    } else {
      this.passwordmismatch = false;
      this.btnDisabled = false;

    }

  }

  ngAfterViewInit() {
    if (!this.focused) {
      this.scrollHelper.doScroll();
    }

    this.userAccountForm.valueChanges.subscribe(() => {
      this.checkAnyUpdate();
    });
  }

  OpenEditModel() {
    this.addUserStatus = true;
    this.savebuttonstatus = true;
    this.updateButtonStatus = false;
    this.addbuttondisabled = false;
    this.setFocus();
    this.userAccountForm.get('user_type').setValue('0');
    this.userAccountForm.get('password').setValidators([
      Validators.minLength(8),
      Validators.maxLength(32),
      Validators.pattern(this.pattern)]);

    this.userAccountForm.get('confirmPassword').setValidators([
      Validators.minLength(8),
      Validators.maxLength(32),
      Validators.pattern(this.pattern)]);


  }

  onSubmit() {
    let t = this;
    let data = this.userAccountForm.value;
    let searchArray2 = this.data.find(function (searchArray2) { return searchArray2.user_name === t.userAccountForm.get('user_name').value });
    if (searchArray2) {
      this.notifyPopup.error("User name already exist");
      this.btnDisabled = true;
      this.reset();
      return false;
    }
    this.notifyPopup.showLoader(commonMessages.ems_snmp_load_data);
    this._service.postJson('accounts/user-list/', data).then(_result => {
      if (_result.status == "1") {

        this.notifyPopup.hideLoader('');
        this.notifyPopup.success('Settings Saved successfully');
        this.userAccountForm.get('password').clearValidators();
        this.userAccountForm.get('confirmPassword').clearValidators();

        setTimeout(() => {

          this.reset();
        }, 2000);

      } else {
        this.notifyPopup.hideLoader('');
        this.notifyPopup.error('Internal Error,try after some time.');
        this.addUserStatus = false;

      }
      // this.elRef.nativeElement.querySelector('#ssidinput').value = '';

    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  checkAnyUpdate() {
    let data = this.userAccountForm.value;
    this.newJson = {};

    // this.setFocus();
    for (let key in data) {
      if (data[key] != this.data[key]) {
        this.newJson[key] = data[key];
      }
    }
    if (this.updateButtonStatus) {
      if (this.editData.user_name == this.userAccountForm.get('user_name').value && this.editData.user_type == this.userAccountForm.get('user_type').value && this.userAccountForm.get('password').value == null) {
        this.updatebtnDisabled = true;
        // alert("fff")
      }
      else {
        // alert("ff")
        this.updatebtnDisabled = false;
      }
    }

    let count = Object.keys(this.newJson).length;

    if (count > 0) {
      this.btnDisabled = false;
    } else {
      this.btnDisabled = true;
    }
    if (this.userAccountForm.get('password').value != this.userAccountForm.get('confirmPassword').value) {
      this.btnDisabled = true;
    }

  }

  setFocus() {
    this.scrollHelper.scrollToFirst("detailArea");
    this.focusInterval = setTimeout(() => {
      this.focused = true;
      //console.log(2);form-group row
    }, 500);

    //$('#group_name').focus();
  }
  reset() {
    this.addbuttondisabled = true;
    this.addUserStatus = false;
    this.btnDisabled = true;
    this.loadData();
    this.updatebtnDisabled = true;
    this.userAccountForm.reset();
    this.savebuttonstatus = true;
    this.updateButtonStatus = false;
    this.confirmPasswordStatus = true;

  }
  ngOnDestroy() {
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
  }
  showpassword() {
    if (!this.isText) {
      this.isText = true;
    } else {
      this.isText = false;
    }
  }

}
