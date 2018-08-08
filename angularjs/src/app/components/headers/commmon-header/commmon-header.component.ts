import {Component, OnInit, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {commonUrl} from '../../../services/urls/common-url';
import * as io from 'socket.io-client';
import {AlertService} from 'ngx-alerts';
import {Http} from '@angular/http';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {WebserviceService} from '../../../services/commonServices/webservice.service';
import { NotificationService } from '../../../services/notificationService/NotificationService';
import { WebSocketService } from '../../../services/commonServices/web-socket.service';

@Component({
  selector: 'app-commmon-header',
  templateUrl: './commmon-header.component.html',
  styleUrls: ['./commmon-header.component.css'],
  providers: [WebSocketService]
})
export class CommmonHeaderComponent implements OnInit {
  private url = commonUrl.dynamicsocket;
  private socket;
  public alertPopUp;
  public data;
  public initialCount;
  highestNotifydata = [];
;
  mediumNotifydata = [];
  lowestNotifydata = [];
  highestNotifydataCount;
  mediumNotifydataCount;
  lowestNotifydataCount;
  notificationStatus;
  totalunread;
  low_count;
  med_count;
  high_count;
  web_wrl_bool_status:boolean = false;
  subscriber;
  constructor(private router: Router, 
              private alertService: AlertService, 
              private http: Http, 
              private _service: WebserviceService, 
              private spinnerService: Ng4LoadingSpinnerService,
              private notifyPopup:NotificationService, 
              private _wsService: WebSocketService,
              private eleRef:ElementRef) {
   // this.socket = io(this.url);
    let web_url = (document.URL).split('/');
    let web_url_name = web_url[web_url.length - 1];
  if(web_url_name == "dashboard"){
     this.web_wrl_bool_status = true;
  }else{
    this.web_wrl_bool_status = false;
  }

  }

  ngOnInit() {

    this.loadData();
   //this.creatSocketConnection();

  }
  onMouse() {
    console.log('hovering');
  }
  creatSocketConnection() {
    this.url = 'ws://192.168.236.224:8000/ws/events?subscribe-broadcast';

    this.subscriber = this._wsService.createObservableSocket(this.url).subscribe((data: any) => {
      console.log(data);
      this.callNotificationList();
    },
      err => {

        console.log(err);
        setTimeout(() => {

          this.creatSocketConnection();
        }, 20000);
      }
      ,
      () => {
        console.dir("Observable Completed");
        //clearInterval(this.intervalClear);
        setTimeout(() => {
          //this.intervalClear = setInterval(this.creatSocketConnection('true'), 5000);
          this.creatSocketConnection();
        }, 20000);
      }
    )
  }
  callNotificationList() {
    this._service.getWeb('events/notify-list/', '', '').then(_result => {
      if (_result) {
        this.highestNotifydata = _result.highest;
        this.highestNotifydataCount = _result.high_count;
        this.mediumNotifydata = _result.medium;
        this.mediumNotifydataCount = _result.med_count;
        this.lowestNotifydata = _result.lowest;        // here is the point
        this.lowestNotifydataCount = _result.low_count;
        this.initialCount = 0;
        this.notificationStatus = false;
        this.low_count = _result.low_count;
        this.med_count = _result.med_count;
        this.high_count = _result.high_count;


      }

    });

  }

  loadData() {
    this._service.getWeb('events/notify-count/', '', '').then(_result => {
      if (_result) {
        this.data = _result;
        this.initialCount = this.data.count;
        if (this.data.count == 0) {
          this.notificationStatus = false;
        } else {
          this.notificationStatus = true;
        }
      }
    });

    //this.socket.emit('notify');
  /* this.socket.on('message', (data) => {
      this.notificationStatus = true;
      this.alertPopUp = this.alertService.info(data.message);
     // this.notifyPopup.info(data.message);
      this.initialCount = this.initialCount + 1;
    });*/
  }

  onClicklogout() {
    sessionStorage.setItem('token', '');
    sessionStorage.removeItem('vrrp_configured');
    this.router.navigate(['/login']);
    document.cookie = 'session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
  gotoAlaramPage(){
    this.eleRef.nativeElement.querySelector("#alarmPopup").classList.remove('open');
    this.router.navigate(['/monitor/system/alarm']);    
 }
  ngAfterViewInit() {
    $('.notification-dropdown-wrap').on('click', function (event) {
       event.stopPropagation();
    });
    $(document).ready(function () {
      jQuery('.notification-tabs .tab-link a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');

        // Show/Hide Tabs
        $('.notification-tabs ' + currentAttrValue).show().siblings().hide();

        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');

        e.preventDefault();
      });
    });
  }
  
}
