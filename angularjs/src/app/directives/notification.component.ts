import {Component, OnInit, ViewChild, AfterViewInit, ElementRef, Injectable, EventEmitter, Output} from '@angular/core';
import {} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';
import {Alert, AlertType} from '../model/alertModel';
import {NotificationService} from '../services/notificationService/NotificationService';


@Component({
  selector: 'alert',
  templateUrl: 'notification.component.html',
  styleUrls: ['./notification.component.css']
})


export class NotificationComponent implements OnInit, AfterViewInit {
  alerts: Alert[] = [];
  private subject = new Subject<Alert>();
  private keepAfterRouteChange = false;
  public ssiddelete = false;
  public vlandelete = false;
  public aaaDelete = false;
  public macprofiledelete = false;

  @ViewChild('btn') btn: ElementRef;
  @ViewChild('overLay') overLay: ElementRef;


  @Output() confirmedDelete = new EventEmitter();
  @Output() showedDetails = new EventEmitter();
  @Output() removedDetails = new EventEmitter();
  @Output() logOut = new EventEmitter();

  constructor(private router: Router, private notifyPopup: NotificationService) {

  }

  ngOnInit() {
    this.ssiddelete = false;
    this.vlandelete = false;
    this.aaaDelete = false;
    this.macprofiledelete = false;

    // var alert = {type: 0, message: "hello"};
    //  this.alerts.push(alert);
    //   let el: HTMLElement = this.btn.nativeElement as HTMLElement;
    //   el.click();
  }

  ngAfterViewInit() {
    this.notifyPopup.getAlert().subscribe((alert: Alert) => {

      if (!alert) {
        // console.log('undefined alert');
        // clear alerts when an empty alert is received
        this.alerts = [];
        this.overLay.nativeElement.style.display = 'none';
        return;
      }
      if (alert.message == '') {
        // console.log('blank alert');
        // clear alerts when an empty alert is received
        this.alerts = [];
        this.overLay.nativeElement.style.display = 'none';
        // let el: HTMLElement = this.btn.nativeElement as HTMLElement;
        //  el.click();
        return;
      }
      // console.log('alert' +alert);
      this.alerts = [];
      // add alert to array
      // console.log(alert.type+"///////////"+alert.message);
      this.overLay.nativeElement.style.display = 'block';
      // console.log(alert);
      this.alerts.push(alert);
      if (alert.type == 0) {
        setTimeout(() => {
          this.removeAlert(alert);
        }, 3000);
      }
      //  let el: HTMLElement = this.btn.nativeElement as HTMLElement;
      //  el.click();


    });
  }


  removeAlert(alert: Alert) {
    this.alerts = [];
    this.overLay.nativeElement.style.display = 'none';
  }

  removeDetails(alert: Alert) {
    this.alerts = [];
    this.overLay.nativeElement.style.display = 'none';
    this.removedDetails.emit();
  }

  showDetails(obj) {
    if (obj.message == 'VLAN assigned to SSID which have no other VLAN cant be deleted') {
      this.ssiddelete = false;
      this.vlandelete = true;
    } else if (obj.message == 'SSIDs assigned to Groups which have no other SSIDs cant be deleted') {
      this.ssiddelete = true;
      this.vlandelete = false;
    } else if (obj.message == 'AAAs assigned to SSIDs cant be deleted') {
console.log(JSON.stringify(obj))
      this.ssiddelete = false;
      this.vlandelete = false;
      this.aaaDelete = true;
    } else if (obj.message == 'Mapped mac profile not deleted') {
      this.ssiddelete = false;
      this.vlandelete = false;
      this.aaaDelete = false;
      this.macprofiledelete = true;
    }
    this.showedDetails.emit(obj);
  }

  confirmDelete(obj) {
    this.confirmedDelete.emit(obj);
  }

  logout(alert: Alert) {
    // this.router.navigate(['/dashboard']);
    this.alerts = [];
    this.overLay.nativeElement.style.display = 'none';
  }

}
