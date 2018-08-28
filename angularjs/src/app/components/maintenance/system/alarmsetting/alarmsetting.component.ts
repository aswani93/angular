import { Component, OnInit, ViewChild , AfterViewInit, SimpleChanges } from '@angular/core';
import {DataTable, SortEvent} from 'angular2-datatable';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-alarmsetting',
  templateUrl: './alarmsetting.component.html',
  styleUrls: ['./alarmsetting.component.css']
})
export class AlarmsettingComponent implements OnInit, AfterViewInit {
  public sampleData =  {
    'enable': true ,
    'description': 'Description 123',
    'priority': 'major',
    'source': 'Switch',
    'type': 'Audit',
    'percentage': 74
  };
  public sampleDataAP =  {
    'enable': false ,
    'description': 'Description test',
    'priority': 'critical',
    'source': 'AP',
    'type': 'Audit',
    'percentage': 7
  };
  public sampleDataWCL =  {
    'enable': true ,
    'description': 'Description 321',
    'priority': 'minor',
    'source': 'wlc',
    'type': 'Audit',
    'percentage': 34
  };
  public coloumsObjects = [{checked: true, name: 'Switch'}, {checked: true, name: 'AP'}, {checked: true, name: 'wlc'}];

  public Data: any[];
  public OrignalData: any[];
  @ViewChild('mf')
  private macalcdataTable: DataTable;
  constructor() { }

  ngOnInit() {
    this.Data = [];
    this.Data.push(this.sampleData);
    this.Data.push(this.sampleDataWCL);
    this.Data.push(this.sampleDataAP);
    this.OrignalData = this.Data;

  }
  ngAfterViewInit() {}

  changePriorty($event, item) {
    item.priority = $event.target.value;
  }

  holdPopup(event) {
    event.stopPropagation();
  }
  selectColoums($event, index) {
    this.Data = [];
    if ( this.coloumsObjects[0].checked) {
      this.Data.push(...this.OrignalData.filter(o => o.source == 'Switch'));
    }
     if ( this.coloumsObjects[1].checked) {
      this.Data.push(...this.OrignalData.filter(o => o.source == 'AP'));
    }
     if ( this.coloumsObjects[2].checked) {
      this.Data.push(...this.OrignalData.filter(o => o.source == 'wlc'));
    }
  }
}
