import { Component, OnInit,AfterViewInit, TemplateRef, ElementRef,ViewChild} from '@angular/core';
import { Http } from '@angular/http'
import { DataService } from '../../../../services/dataService/data.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DataTable,SortEvent } from 'angular2-datatable';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { NoColonPipe } from '../../../../services/filters/nocolon';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as io from 'socket.io-client';
import { AlertService } from 'ngx-alerts';
import { commonUrl } from '../../../../services/urls/common-url';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService,commonMessages} from '../../../../services/notificationService/NotificationService';
import 'rxjs/add/operator/catch'; 

@Component({
  selector: 'app-unregistered-ap',
  templateUrl: './unregistered-ap.component.html',
  styleUrls: ['./unregistered-ap.component.css']
})
export class UnregisteredApComponent implements OnInit, AfterViewInit {
  public selectedRow;
  public selectedGroup = '';
  public selectedGrpId;
  public apLocation: string;
  public gpErrFlg:boolean = false;
  public registerBtnDisable:boolean = true;
  public data;
  public groups;
  public totalRows;
  public currentPage;
  public btnArray : any =[];
  public finalpostData;
  public filterQuery = "";
  public rowsOnPage = 20;
  public totalPages;
  public dataLength;
  public clickCount = 0;
  public selectedDataArray : any=[];
  public sucessArr : any=[];
  random_id: string;
  private url = commonUrl.dynamicsocket;
  private socket; 
  private modalHeader;
  public alertPopUp;
  public hasData : boolean = false;
  public errorMsg : string;
  public interval;
  public selectallCheck : boolean = false;
  public _sortBy;
  public _sortOrder;
  coloumsObjects:any = [];
  count:number = 0;
  showLoaderBoolStatus:boolean = true;
  hideLoaderBoolStatus:boolean = false;
 
  /* pagination declaration variable*/
   page: number = 1;
  Math:any = Math;
  firstarrowStatus:boolean = true;
  lastarrowStatus:boolean = false;
    /*pagination declaration variable end */
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  isModalShown: boolean = false;
  constructor(private http: Http, private _service : WebserviceService, private modalService: BsModalService,private elRef: ElementRef, private spinnerService: Ng4LoadingSpinnerService,private alertService: AlertService,private notifyPopup:NotificationService) {
   // this.socket = io(this.url);
  }
  ngOnInit(): void {
    this.loadData(); 
  }
  loadData(){
     this.coloumsObjects=[
      { name:'AP Name', checked: true},
      { name:'IP Address', checked: true},
      { name:'MAC Address', checked: true},
      { name:'AP Model',  checked: true}
      
    ];
    let details;
     this.showLoaderBoolStatus = true;
      this.hideLoaderBoolStatus = false;
  setTimeout(() => {
    if(this.showLoaderBoolStatus == true){
       this.hideLoaderBoolStatus = true;
       this.notifyPopup.showLoader(commonMessages.unregisterShowData);

          }
      },500);
         this._service.getWeb('configurations/get-unregistered-ap/','','').then(_data =>{
      if(_data.status == 1){ 
        this.errorMsg ='';
        //this.spinnerService.show();
        this.data = _data.result['unregistered_aps'];
        this.groups = _data.result['groups'];
       
        if(_data['unregistered_aps']!= undefined){
          this.totalRows = _data['unregistered_aps'].length;
         // console.log(this.totalRows,'rows');
          this.hasData = true;
          if(this.totalRows%this.rowsOnPage > 1){
           this.totalPages = Math.trunc(this.totalRows/this.rowsOnPage)+1;
          }else{
            this.totalPages = Math.trunc(this.totalRows/this.rowsOnPage);
          }
        } 
         this.showLoaderBoolStatus = false;
         if(this.hideLoaderBoolStatus)
       this.notifyPopup.hideLoader('');
       //this.spinnerService.hide();
     }else{
      this.data = '';
       if(this.hideLoaderBoolStatus)
       this.notifyPopup.hideLoader('');
     // this.spinnerService.hide();
      this.errorMsg =_data.msg;
      this.showModal();
     }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  showErrorpopup(error){

  }
  selectAll(ev){
     for(let i of this.dataTable.data){
       i.checked = this.selectallCheck;
       if(ev){
        if(ev.target.checked){
          this.clickCount++;
         }else{
          this.clickCount--;
         }
       }else{
        this.clickCount = 0;
       }
       
     }
     this.enableDisablebtn('');
   }
   enableDisablebtn(ev){
    if(ev!=''){
      if(ev.target.checked){
        this.clickCount++;;
      }
      else{
        this.clickCount--;
      }
    }
    if(this.clickCount>0){
      this.elRef.nativeElement.querySelector('#register-btn').classList.remove('disabled');
    }else{
      this.elRef.nativeElement.querySelector('#register-btn').classList.add('disabled');
    }
   }
   changeVal(obj){
    let str = obj.value;
    if(str!=''){
    this.selectedGroup = str.split(',')[0];
    this.selectedGrpId = str.split(',')[1];
    this.registerBtnDisable = false;
    this.gpErrFlg = false;
   }else{
    this.selectedGroup = '';
    this.selectedGrpId = '';
    this.registerBtnDisable = true;
    this.gpErrFlg = true;
   }
  }
  clearModal(template){
    this.modalRef = this.modalService.show(template);
    this.elRef.nativeElement.ownerDocument.body.style.padding = 0;
    this.gpErrFlg = false;
  }
  public macArray : any = [];
  
  registerap(data){
    this.registerBtnDisable = true;
    if(this.selectedGroup==''){
      this.gpErrFlg = true;
    }else{
      this.modalService.hide(1);
      document.querySelector('.bodyscroll').classList.remove('modal-open');
      this.gpErrFlg = false;
      this.finalpostData = [];
      this.macArray = [];
      let checkedVal = this.getSelectedValues();
      for(let i =0;i<checkedVal.length;i++){
        //this.finalpostData.push({ap_mac:checkedVal[i].ap_mac,ap_group_id:this.selectedGrpId});
        this.macArray.push(checkedVal[i].ap_mac);
      }
      this.finalpostData = {
        ap_mac:this.macArray,
        group_id:this.selectedGrpId,
        group_name:this.selectedGroup,
        ap_location:this.apLocation};
      let dataLength = this.finalpostData.length
       this.notifyPopup.showLoader(commonMessages.registerAP);
      this._service.postJson('configurations/registered-ap/',this.finalpostData).then((sucess)=>{
        if(sucess.status=='1'){
          this.notifyPopup.hideLoader('');
          this.notifyPopup.success(commonMessages.AP_register);
          setTimeout(() => {
          this.loadData();
          },1000); 
     

         

        }else{
         
          this.notifyPopup.hideLoader('');
           this.notifyPopup.error('Some thing went wrong');
           setTimeout(() => {
            this.loadData();
            },1500);
        }
       },(error)=>{
         
       }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    }
  }
  getSelectedValues(){
    return this.data.filter((item)=>{
      return item.checked?true:false;
    })
  }
  @ViewChild('mf') 
  public dataTable: DataTable; 
  public showingto = 1;
  public showingfrom = 0;
  public pageModulus = 0;
  ngAfterViewInit() {
    this.dataTable.onPageChange.subscribe((x) =>{
    this.clickCount = 0;
    this.selectallCheck = false;
    this.selectAll(false);
    this.currentPage = x.activePage;
    this.dataLength = x.dataLength;
    this.pageModulus = this.dataLength % x.rowsOnPage;
    if(x.rowsOnPage * this.currentPage > x.dataLength){
    this.showingto = (x.rowsOnPage * (this.currentPage-1))+ this.pageModulus;
    this.showingfrom = (this.showingto - this.pageModulus) + 1;
    }else{
    this.showingto = x.rowsOnPage * this.currentPage;
    this.showingfrom = (this.showingto - x.rowsOnPage) + 1;
    }
    });

    this.dataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
  }
  ngOnDestroy() {
    if(this.notifyPopup){
      this.notifyPopup.hideLoader('');
    }

    if(this.modalRef)
    {
      this.modalRef.hide();
    }
    
  }
  search(event){
    let val = event.target.value;
    if(val.length>2){
      this._service.getWeb('utils/un-reg-ap-search/?query='+val+'','','').then(_data =>{ console.log(_data);
        if(_data){
          if(_data.result.length!=0){
            this.data =_data.result;
          }else{ 
            this.data = '';
            
          }
              
       }
      }).catch((error) => {
        this.notifyPopup.logoutpop(commonMessages.InternalserverError);
      });
    }else if(val.length == 0){
      this.loadData(); 
    }
    
  }
  showModal(): void {
    this.isModalShown = true;
  }
 
  hideModal(): void {
    this.autoShownModal.hide();
  }
 
  onHidden(): void {
    this.isModalShown = false;
  }
  modalRef: BsModalRef;
  openModal(template: TemplateRef<any>) {``
    this.modalRef = this.modalService.show(template);
    this.elRef.nativeElement.ownerDocument.body.style.padding = 0;

  }

  selectColoums(event,index){
    event.stopPropagation();
     event.preventDefault(); 
     if(event.target.checked == false)
     this.count = this.count + 1;
     else{
      this.count = this.count - 1; 
     }
    if(this.count <= 2 ){
     this.coloumsObjects[index].checked = event.target.checked;
    }else
     this.coloumsObjects[index].checked =true;
   }
  
  holdPopup(event){
    event.stopPropagation();
  }

   /* pagination method here*/
   getNext(page){
         this.page = page;
      if(this.page == 1){
        this.firstarrowStatus = true;
        this.lastarrowStatus = false; 
      }else if(this.page == this.Math.ceil(this.data.length/this.rowsOnPage))
        { 
          this.lastarrowStatus = true;
           this.firstarrowStatus = false; 
        }
           else{
            this.firstarrowStatus = false;
             this.lastarrowStatus = false;
           }}
    goToPage(num){
      this.getNext(num);
    }
      /* pagination method here end*/
  

}
