import {Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import {DataTable, SortEvent} from 'angular2-datatable';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {NotificationService, commonMessages} from '../../../../services/notificationService/NotificationService';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit, OnDestroy, AfterViewInit {
  public _sortBy;
  public _sortOrder;
  public data;
  public interval;
  public initialLoad = false;

  @ViewChild('mf')
  private dataTable: DataTable;
  @ViewChild('mf2')
  private dataTable1: DataTable;
  @ViewChild('mf3')
  private dataTable2: DataTable;
  @ViewChild('mf4')
  private dataTable3: DataTable;

  constructor(
    private notifyPopup: NotificationService,
    private _service: WebserviceService,
    private elRef: ElementRef) {
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  loadData() {
    this._service.getWeb('statistics/wlc-system-general/', '', '').then(_data => {
      if (_data) {
        this.initialLoad = true;
        this.data = _data;
        this.interval = setTimeout(() => {
          this.loadData();
        }, 10000);
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });

  }

  ngAfterViewInit() {

    this.dataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
    this.dataTable2.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
    this.dataTable3.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
  }
}
