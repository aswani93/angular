import { Component, OnInit, ElementRef,ViewChild, Input, Output,EventEmitter} from '@angular/core';
import { WebserviceService } from '../../services/commonServices/webservice.service';

@Component({
  selector: 'app-serachbar',
  templateUrl: './serachbar.component.html',
  styleUrls: ['./serachbar.component.css']
})
export class SerachbarComponent implements OnInit {
  @Input() apiVal: string;
  @Input() searchKey: string;
  @Input() searchVal: string;

  @Output() emitMac = new EventEmitter();
  @Output() emitResult = new EventEmitter();
  
  public showResArea:boolean = false;
  public showLoader:boolean = false;
  public html = '';
  public optData;
  public apOption = false;
  public gpOption = false;
  searchText:any;
  constructor(private _service: WebserviceService,private elRef : ElementRef) { }
 // @ViewChild('resArea') d1:ElementRef;

  ngOnInit() {
   
  }
  onKey(event){
    this.html = '';
    this.emitResult.emit(event.target.value);
  }
  
  getSuggestions(val){
    this.apOption = false;
    this.gpOption = false;
    if(val.length>2){
      this.showLoader = true;
      this._service.getWeb('utils/'+this.apiVal+'/?query='+val+'','','').then(_data =>{
      this.optData = _data.result;
      this.showLoader = false;
      this.showResArea = true;
      if(this.apiVal == 'ap-search'){
        this.apOption = true
      }
      if(this.apiVal == 'group-search'){
        this.gpOption = true
      }
      
    });
  }else{
    this.showLoader = false;
    this.showResArea = false;
  }
  
  }
  setMac(obj,name,tab){
    this.emitMac.emit(obj+'|'+name+'|'+tab);
    this.elRef.nativeElement.querySelector('#search-input').value = name;
    this.showResArea = false;
  
  }
 
} 

