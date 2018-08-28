import {Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {commonUrl} from '../../../services/urls/common-url';
import * as io from 'socket.io-client';
import {AlertService} from 'ngx-alerts';
import {Http} from '@angular/http';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {WebserviceService} from '../../../services/commonServices/webservice.service';
import { NotificationService } from '../../../services/notificationService/NotificationService';
import { WebSocketService } from '../../../services/commonServices/web-socket.service';
import { WidgetServiceService } from '../../../services/widget/widget-service.service';


@Component({
  selector: 'app-commmon-header',
  templateUrl: './commmon-header.component.html',
  styleUrls: ['./commmon-header.component.css'],
  providers: [WebSocketService]
})
export class CommmonHeaderComponent implements OnInit, AfterViewInit {
  private url = commonUrl.dynamicsocket;
  private socket;
  public alertPopUp;
  public data;
  public initialCount;
  username;
  highestNotifydata = [];
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
  web_wrl_bool_status: boolean = false;
  subscriber;
  arrayObj = [];
  list:any = [];
  constructor(private router: Router,
              private alertService: AlertService,
              private http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private notifyPopup: NotificationService,
              private _wsService: WebSocketService,
              private eleRef:ElementRef,
              private widgetService:WidgetServiceService) {
   // this.socket = io(this.url);
    let web_url = (document.URL).split('/');
    let web_url_name = web_url[web_url.length - 1];
    if (web_url_name == 'dashboard') {
      this.web_wrl_bool_status = true;
    } else {
      this.web_wrl_bool_status = false;
    }


  }

  ngOnInit() {
    this.username = sessionStorage.getItem('username');
    this.initialCount = 0;
    this.loadData();
    this.creatSocketConnection();
    this.arrayObj=[
      { name:'AP Status',value:0, checked: false},
      { name:'Alarms',value:1, checked: false},
      { name:'Access Points (Top 5)',value:2, checked: false},
      { name:'Clients (Top 5)',value:3,  checked: false},
      { name:'AP Traffic Usage',value:4,  checked: false},
      { name:'Group Traffic Usage',value:5, checked: false},
      { name:'WLC CPU Utilization (Top 5)',value:6,checked: false},
      { name:'WLC Memory Utilization (Top 5)',value:7,checked: false},
      { name:'Clients (Group wise)',value:8,checked: false},
      { name:'Clients (SSID wise)',value:9,checked: false},
      { name:'WLC Info',value:10,checked: false},
      { name:'WLC Uplink Downlink Traffic',value:11,checked: false}


    ];
    this.widgetService.addWidget().subscribe((list) => {

          this.list = list;
          for(var j=0 ; j< this.arrayObj.length;j++){
            if(list.indexOf(this.arrayObj[j].value) > -1){

              this.arrayObj[j].checked = true;
              //console.log( this.arrayObj[j].checked +"List "+this.arrayObj[j].value);
            }else{
              this.arrayObj[j].checked = false;
            }
          }

    });
  }

  selectColoums(event, index) {
    event.stopPropagation();
    event.preventDefault();

    if (event.target.checked == false)
     {
         var item = this.list.indexOf(index);
       if (index > -1) {
        this.list.splice(item, 1);
       }
       }
    else {
      this.list.push(index);
    }
      this.widgetService.updatePositionWidgetdetails({index:index,list:this.list});
  }

    holdPopup(event) {
    event.stopPropagation();
  }

  onMouse() {
    console.log('hovering');
  }

  creatSocketConnection() {
    this.url = commonUrl.webSocket;
    // this.url = 'ws://192.168.104.221:8000/ws/events?subscribe-broadcast';
    this.url = this.url + 'ws/events?subscribe-broadcast';
    this.subscriber = this._wsService.createObservableSocket(this.url).subscribe((data: any) => {
        this.alertService.info(data);
        this.initialCount = this.initialCount + 1;
        this.notificationStatus = true;
         setTimeout(() => {
         $('#alarmNotification').addClass('hvr-buzz');
         this.clearAlarmBellAnimation();
        },10);
        
      },
      err => {

        console.log(err);
        setTimeout(() => {

          this.creatSocketConnection();
        }, 20000);
      }
      ,
      () => {
        console.dir('Observable Completed');
        // clearInterval(this.intervalClear);
        setTimeout(() => {
          // this.intervalClear = setInterval(this.creatSocketConnection('true'), 5000);
          this.creatSocketConnection();
        }, 20000);
      }
    );
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
         setTimeout(() => {
      $('#alarmNotification').addClass('hvr-buzz');
       this.clearAlarmBellAnimation();
        },10);
        }

      }
    });

    // this.socket.emit('notify');
    /* this.socket.on('message', (data) => {
        this.notificationStatus = true;
        this.alertPopUp = this.alertService.info(data.message);
       // this.notifyPopup.info(data.message);
        this.initialCount = this.initialCount + 1;
      });*/
  }

  clearAlarmBellAnimation(){
        setTimeout(() => {   
       $('#alarmNotification').removeClass('hvr-buzz');
    }, 2000);
  }

  onClicklogout() {
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('vrrp_configured', '-');
    sessionStorage.setItem('netmask_vrrp', '-');
    sessionStorage.setItem('netmask_wlc', '-');
    sessionStorage.setItem('wlc_ip', '-');
    sessionStorage.setItem('vrrp_configured', '-');
    this.router.navigate(['/login']);
    document.cookie = 'session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  gotoAlaramPage() {
    this.eleRef.nativeElement.querySelector('#alarmPopup').classList.remove('open');
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
