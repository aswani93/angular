import {Component, OnInit, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {Login} from './login.data';
import {AuthService} from '../../services/loginServices/auth.service';
import {NotificationService, commonMessages} from '../../services/notificationService/NotificationService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isError: boolean = false;
  isnameError: boolean = false;
  ispassError: boolean = false;
  login: any = {};
  errMsg: string;
  private apiResponsePost;

  constructor(private _service: AuthService, private router: Router, private elRef: ElementRef, private notifyPopup: NotificationService) {
    elRef.nativeElement.ownerDocument.body.style.background = 'url(/assets/images/login-nback.jpg) left top no-repeat ';
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.notifyPopup.hideLoader('');
  }

  model = new Login('', '');
  submitted = false;

  onSubmit(data) {
    let username = this.model.email;
    let password = this.model.password;
    if (username == '' && password == '') {
      this.isError = true;
      this.errMsg = 'Fields should not be empty';
      this.ispassError = true;
      this.isnameError = true;
    } else if (username == '') {
      this.isnameError = true;

      this.errMsg = 'Username should not be empty';
    }
    else if (password == '') {
      this.ispassError = true;
      this.isnameError = false;
      this.isError = true;
      this.errMsg = 'Password should not be empty';

    } else {
      this.isError = false;
      this.isnameError = false;
      this.ispassError = false;


      this._service.login(username, password).subscribe(
        res => {
          this.apiResponsePost = res.body;

          if (this.apiResponsePost.msg === 'ADMIN_LOGIN_SUCCESS' && this.apiResponsePost.status === '1') {
            this.isError = false;
            // this.router.navigate(['/configuration/system/basic']);
            // document.cookie = "session_key="+this.apiResponsePost.session_key+"";
            // this.cookieService.set( 'session_key', this.apiResponsePost.session_key );
            sessionStorage.setItem('vrrp_configured', this.apiResponsePost.vrrp_configured);
            sessionStorage.setItem('wlc_ip', this.apiResponsePost.wlc_ip);
            sessionStorage.setItem('netmask_wlc', this.apiResponsePost.netmask_wlc);
            sessionStorage.setItem('netmask_vrrp', this.apiResponsePost.netmask_vrrp);
            sessionStorage.setItem('username',this.apiResponsePost.username);
            this.router.navigate(['/dashboard']);
            this.elRef.nativeElement.ownerDocument.body.style.background = '';
          } else {
            this.router.navigate(['/']);
          }
        },
        error => {
          if (error.error.msg === 'ADMIN_LOGIN_INVALID_CRED') {
            this.errMsg = 'Invalid password';
            this.isError = true;
            this.ispassError = true;
          } else if (error.error.msg === 'USER_DOESNT_EXISTS') {
            this.isnameError = true;
            this.isError = true;
            this.ispassError = false;
            this.errMsg = 'Username does not exists';
          }
          if (error.status == 0) {
            this.isError = true;
            this.errMsg = 'Internal Error,Please try after some time';
          }

        },
        () => {
          // 'onCompleted' callback.
          // No errors, route to new page here
        }
      );


      /*this._service.login(username, password).subscribe((res) => { console.log(res,'result');
          this.apiResponsePost = res.body;

          if(this.apiResponsePost.msg === "ADMIN_LOGIN_INVALID_CRED"){
            this.errMsg ='Invalid password';
            this.isError = true;
            this.ispassError = true;
        //this.isnameError = true;
          }else if(this.apiResponsePost.msg ==="USER_DOESNT_EXISTS"){
            this.isnameError = true;
            this.isError = true;
            this.ispassError = false;
            this.errMsg ='Username does not exists';
          }


          if (this.apiResponsePost.msg === "ADMIN_LOGIN_SUCCESS" && this.apiResponsePost.status === '1') {
            this.isError = false;
           // this.router.navigate(['/configuration/system/basic']);
            //document.cookie = "session_key="+this.apiResponsePost.session_key+"";
            //this.cookieService.set( 'session_key', this.apiResponsePost.session_key );
            this.router.navigate(['/configuration/ap/unregisteredAP']);
            this.elRef.nativeElement.ownerDocument.body.style.background = '';
          }
          else {
            this.router.navigate(['/']);
          }
        });*/
      this.submitted = true;
    }

  }

}
