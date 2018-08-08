import {Component, OnInit, ElementRef, ViewChild, OnDestroy,Input,Output,EventEmitter} from '@angular/core';
import {WebserviceService} from '../../../../../services/commonServices/webservice.service';
import {SerachbarComponent} from '../../../../serachbar/serachbar.component';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {Http} from '@angular/http';

import {NotificationService, commonMessages} from '../../../../../services/notificationService/NotificationService';
import 'rxjs/add/operator/catch'; 
@Component({
  selector: 'app-connected-client-details',
  templateUrl: './connected-client-details.component.html',
  styleUrls: ['./connected-client-details.component.css']
})
export class ConnectedClientDetailsComponent implements OnInit {

  public interval_details;
  public data = [];
  public intialLoad = false;
  public isClientSelected = false;
  public clientDetails;
  @Input() selectedClient: string;
  @Output() emitEve = new EventEmitter();
  constructor(private elRef: ElementRef,
              private http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private notifyPopup: NotificationService) {
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
    clearInterval(this.interval_details);
  }

 

  loadData() {
    this._service.getWeb('statistics/client-stats-detail/?client_mac=' + this.selectedClient, '', '').then(data => {
      this.clientDetails = data.result;
      this.interval_details = setTimeout(() => {
        this.loadData();
      }, 5000);
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
   
  }


  

  goback(tab) {
    this.emitEve.emit();
    clearInterval(this.interval_details);
  }
 

  

}
