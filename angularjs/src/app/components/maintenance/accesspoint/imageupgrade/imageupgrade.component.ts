import {Component, OnInit, ElementRef, ViewChild,} from '@angular/core';
import {Http} from '@angular/http';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {WebserviceService} from '../../../../services/commonServices/webservice.service';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {AlertService} from 'ngx-alerts';
import {NotificationService, commonMessages} from '../../../../services/notificationService/NotificationService';
import {TooltipService} from '../../../../services/tooltip/tooltip.service';

@Component({
  selector: 'app-imageupgrade',
  templateUrl: './imageupgrade.component.html',
  styleUrls: ['./imageupgrade.component.css']
})
export class ImageupgradeComponent implements OnInit {
  mailForm: FormGroup;
  public data;
  public groups;
  private groups_upgrade;
  public filelist: FileList;
  public alertPopUp;
  public gpErrFlg = true;
  public filename = '';
  public uploadbuttondisabled = true;
  firmwareFileName: any;
  apModel: any;
  upgradeTime: any;
  inputType: any = 'password';
  apModelStr: any = 'Please select';
  groupName = '-1';
  uploadType: any = 'local';
  upgrade_type: any = 'upgrade_group';
  upgrade_time: any = 'Please select';
  IPv6_radio_disabled: boolean = true;
  ip_address: any;
  userName: any;
  password: any;
  checkStatus: any = 0;
  apModelVal: any;
  groudId: any;
  uploadTypeVal: any;
  checkBool: boolean = false;
  firmplaceholder = '';
  IPplaceholder = '';
  userplaceholder = '';
  passplaceholder = '';
  upgradeGroupName = '-1';
  upgradeApModel: any = 'Please select';
  upgradeTableStatus: any = false;
  UpgradeModelList: any = [];
  APModelList: any = [];
  all_particular_apis: any = 'allApis';
  selectedAPArray: any = [];
  upgradeTableData: any = [];
  firmwareselectedAPArray: any;
  image_name: any;
  mac_address_list: any;
  iperrorStatus = false;
  upgrade_boolStatus: boolean = false;
  errorMsgShow: boolean = false;
  Ap_model_bool_status: boolean = false;
  toogleDiv_bool: boolean = false;
  ap_type_id: any = 'ap_name';
  btnName:any= "Upload";
  checkboxVisibility:boolean = false;
  uploadTableStatus:boolean = false;
  tableStatus:any;
  errorMsgStatus:boolean= false;
  saveBtnStatus:boolean = false;
  @ViewChild('ftp') ftp: ElementRef;
  @ViewChild('local') local: ElementRef;
  @ViewChild('gp') gp: ElementRef;
  @ViewChild('ap') ap: ElementRef;
  @ViewChild('triggerEle') triggerEle: ElementRef;
  @ViewChild('overLay') overLay: ElementRef;

  constructor(private http: Http,
              private _service: WebserviceService,
              private spinnerService: Ng4LoadingSpinnerService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private notifyPopup: NotificationService,
              private elRef: ElementRef,
              private tooltipService: TooltipService
  ) {
  }

  ngOnInit() {
    this.loadData();
    // this.spinnerService.show();

  }

  validateIP() {
    var value = this.mailForm.get('IPaddress').value;
    var result = value.split('.');
   if (result[0].length == 0) {
      this.iperrorStatus = true;
    } else if (result[0] == "127" || result[0] == "8" || result[0] == "4" ||  result[3] == 255 || result[1] == 0) {
      this.iperrorStatus = true;
    } else if (result[0] < 224 && result[0] >= 1 && result[3] <= 254) {
      this.iperrorStatus = false;
    }

  }

  loadData() {

    this.notifyPopup.confirmationOk().subscribe((page) => {
      if (page == 'imageupgrade') {
        if (this.upgrade_boolStatus)
          this.save_image_upgrade();
        else
          this.upgradeFiles();
      }
    });

    this.apModel = [
      {value: 'Please select'},
      {value: '52'}
    ];

    this.upgradeTime = [
      {value: 'Please select'},
      {value: 'Upgrade Now'},
      // { value:'Schedule'}
    ];

    this.mailForm = this.fb.group({
      'firmware': ['', [
        Validators.required,
        Validators.pattern('.*\.(tgz$)|(tar\.gz$)')
      ]
      ],
      'IPaddress': ['', [
        Validators.required,
        Validators.pattern(/^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/)
      ]
      ]
      ,
      'password': ['', [
        Validators.required

      ]
      ],
      'userName': ['', [
        Validators.required
      ]
      ]

    });

    let details;
    this._service.getWeb('configurations/get-unregistered-ap/', '', '').then(_data => {//console.log(_data);
      if (_data) {
        this.data = _data.result['unregistered_aps'];
        //  console.log("Rama" + JSON.stringify(this.data));
        //   this.groups = _data.result['groups'];
        //    this.groups.unshift({group_id:"-1",group_name:"Select Group"})
        //this.notifyPopup.hideLoader('');
        //this.spinnerService.hide();
      }
    });

    this._service.getWeb('configurations/group-configurations/', '', '').then(_data => {//console.log(_data);
      if (_data) {
      //  console.log("Rama" + JSON.stringify(this.data));
     this.groups_upgrade =  _data.result.filter(item => item.contains_ap  == true);
       // this.groups = _data.result;
        this.groups_upgrade.unshift({group_id:"-1",group_name:"Select group"})
        this.notifyPopup.hideLoader('');
        //this.spinnerService.hide();
      }
    });

    this._service.getWeb('utils/ap-model-search/', '', '').then(_data => {//console.log(_data);
      if (_data.status == 1) {
      //  console.log("Rama" + JSON.stringify(this.data));
     this.apModel =  _data.result;
        this.apModel.unshift("Please select");
        this.notifyPopup.hideLoader('');
        //this.spinnerService.hide();
      }
    });

  }


  passwordToggle(passType) {
    if (passType == 'password')
      this.inputType = 'text';
    else
      this.inputType = 'password';
  }

  checkStringName() {
    var str = this.firmwareFileName;
    var n = str.search('hfci_apdv.outdoor');
    var m = str.search('hfci_apdv.indoor');
    var type = str.search('.tar.gz');
    console.log(n);
    if (n >= 0 && type >= 0)
      this.errorMsgShow = false;
    else if (m >= 0 && type >= 0)
      this.errorMsgShow = false;
    else if (n == -1 || type == -1)
      this.errorMsgShow = true;
  }

  onChangeModel(event,tabname) {
    console.log(event);
    this.saveBtnStatus = false;
    this.apModelVal = event;
    if(tabname == 'upload'){
     this.checkboxVisibility = false;
     this.uploadTableStatus =  true;
     this.tableStatus =  this.uploadTableStatus;
     this.errorMsgStatus = false;
     this.imageList();
    }
  }

  OnChangeGroupId(event) {
    this.saveBtnStatus = false;
    this.groudId = event;
  }

  upgradeTypeFun(){
    this.saveBtnStatus = false;
  }

  onChangeGroupType(event) {
    this.upgrade_type = event;
    this.upgradeApModel = 'Please select';
    this.upgrade_time = 'Please select';
    this.upgradeGroupName = '-1';
    this.UpgradeModelList = [];
    this.APModelList = [];
    this.upgradeTableData = [];
    this.image_name = '';
    this.upgradeTableStatus = false;
    this.saveBtnStatus = false;
  }

  OnChangeUpgradeGroupId(event) {
    this.saveBtnStatus = false;
    if (event != -1) {
      this.upgradeApModel = 'Please select';
      this.groudId = event;
      this._service.getWeb('utils/group-model-search/?group_id=' + event, '', '').then(_data => {
        console.log(_data);
        if (_data.status == 1) {
          this.UpgradeModelList = _data.result;
          this.UpgradeModelList.unshift('Please select');
        } else {
          this.notifyPopup.error(commonMessages.serverError);
        }
      });
    }
  }

  onChangeUpgradeModel(event) {
    this.saveBtnStatus = false;
    if (event != 'Please select') {
      this.upgradeGroupName = '-1';
      this.apModelVal = event;
      this._service.getWeb('utils/group-model-search/?ap_model=' + event, '', '').then(_data => {
        console.log(_data);
        if (_data.status == 1) {
          this.UpgradeModelList = _data.result;
          this.UpgradeModelList.unshift({group_id: '-1', group_name: 'Please select'});
        }
      });
    }
  }

  checkboxEvent(event, radBtn) {
    event.preventDefault();
    this.selectedAPArray = [];
     this.saveBtnStatus = false;
    console.log(event.target.checked, radBtn);
    if (radBtn == 'particularApi') {
      this.all_particular_apis = 'particularApis';
      this.callingApi(radBtn);
    }

  }

  callingApi(radBtn) {
    if (this.upgradeGroupName != '-1' && this.upgradeApModel != 'Please select') {
      this._service.getWeb('utils/ap-mac-search/?ap_model=' + this.upgradeApModel + '&group_id=' + this.upgradeGroupName, '', '').then(_data => {
        console.log(_data);
        this.APModelList = [];
        if (_data.status == 1) {
          this.APModelList = _data.result;
          //  let el: HTMLElement = this.triggerEle.nativeElement as HTMLElement;
          //   el.click();
          this.Ap_model_bool_status = true;
          this.overLay.nativeElement.style.display = 'block';
        }
      });

    } else {

      setTimeout(() => {
        this.all_particular_apis = 'allApis';
        console.log(this.all_particular_apis);
        this.notifyPopup.error(commonMessages.imgUpgrade);
      }, 500);
    }


  }

  upgradecheckboxClick(event) {
    if (event.target.checked) {
      // this.clickCount++;
      this.selectedAPArray.push(event.target.value);
    } else {
      //this.clickCount--;
      let idx = this.selectedAPArray.indexOf(event.target.value);
      this.selectedAPArray.splice(idx, 1);
    }
  }

  upgradeFirmwareCheckboxClick(event) {
    if (event.target.checked) {
      this.firmwareselectedAPArray.push(event.target.value);
    } else {
      let idx = this.firmwareselectedAPArray.indexOf(event.target.value);
      this.firmwareselectedAPArray.splice(idx, 1);
    }
  }

  upgradefirmwareName(event, f_name) {
    this.image_name = f_name;
  }

  selectAll(event) {
    this.selectedAPArray = [];
    var chkLen = this.elRef.nativeElement.querySelectorAll('.upgrade-check').length;
    if (event.target.checked) {
      for (var i = 0; i < chkLen; i++) {
        this.elRef.nativeElement.querySelectorAll('.upgrade-check')[i]['checked'] = true;
      }
      for (let ap of this.APModelList) {
        this.selectedAPArray.push(ap.ap_mac);
      }
    } else {
      for (var i = 0; i < chkLen; i++) {
        this.elRef.nativeElement.querySelectorAll('.upgrade-check')[i]['checked'] = false;
      }
      this.selectedAPArray = [];
    }
  }

  selectFirmwareAll(event) {
    var chkLen = this.elRef.nativeElement.querySelectorAll('.upgrade-firmware-check').length;
    if (event.target.checked) {
      for (var i = 0; i < chkLen; i++) {
        this.elRef.nativeElement.querySelectorAll('.upgrade-firmware-check')[i]['checked'] = true;
      }
      for (let ap of this.APModelList) {
        this.firmwareselectedAPArray.push(ap.ap_mac);
      }
    } else {
      for (var i = 0; i < chkLen; i++) {
        this.elRef.nativeElement.querySelectorAll('.upgrade-firmware-check')[i]['checked'] = false;
      }
      this.firmwareselectedAPArray = [];
    }
  }


  changeVal(obj) {
    let str = obj.value;
    if (str == '') {
      this.gpErrFlg = true;
      $('#uploadButton').addClass('disabled');
    } else {
      this.gpErrFlg = false;
      $('#uploadButton').removeClass('disabled');
    }
  }

  fileupload(event) {
    var files = event.target.files;   
    this.filelist=files; 
    console.log("////////"+this.filelist[0].size); 
    this.filename=this.filelist[0].name;
    this.uploadbuttondisabled=false;
    let file:File=this.filelist[0];
    var name = this.filename.search("hfci_apdv.indoor");
     var sec_name = this.filename.search("hfci_apdv.outdoor");
    var type=this.filename.search(".tar.gz");
   if((sec_name != -1 || name !=-1) && type !=-1 && file.size < 52428800 && file.size > 0){
   // this.uploadfile();
   this.uploadbuttondisabled=false;
    }else{
      this.notifyPopup.hideLoader('');
      if(sec_name == -1 && name == -1){
           this.notifyPopup.error('Invalid Firmware');    
          // this.spinnerService.hide(); 
      }else if(file.size > 52428800){
       this.notifyPopup.error('Firmware size is exceeded');    
        //this.spinnerService.hide(); 
      }else if(file.size < 1){
       this.notifyPopup.error('Firmware size is 0');    
        //this.spinnerService.hide(); 
      }
      this.filename = '';
      //this.reset();
    }

    // this.uploadfile();
  }

  ngOnDestroy() {
    if (this.notifyPopup) {
      this.notifyPopup.hideLoader('');
    }
  }
  
  openModalPopup(){
    this.groupName = "-1";
    this.checkBool = false;
    this.btnName  = "Upload";
    this.checkStatus = 0;
     this._service.getWeb('utils/group-model-search/?ap_model='+this.apModelStr, '', '').then(_data => {//console.log(_data);
      if (_data.status == 1) {
        //  console.log("Rama" + JSON.stringify(this.data));
        this.groups = _data.result;
        // this.groups = _data.result;
        this.groups.unshift({group_id: '-1', group_name: 'Select group'});
       
        //this.spinnerService.hide();
      }
    });
  }

  checkedStatus(event) {
    if (event.target.checked) {
      this.checkStatus = 1;
      this.checkBool = true;
      this.btnName = "Upgrade"
    }
    else {
      this.checkStatus = 0;
      this.checkBool = false;
       this.btnName = "Upload"
    }

  }

  confirmation__upload() {
    this.upgrade_boolStatus = false;
    if (this.checkStatus == 1 && this.groupName == '-1') {
      this.notifyPopup.error(commonMessages.groupSelectionError);
      return;
    }

      if (this.checkStatus == 1)
    this.notifyPopup.info(commonMessages.upgrade_msg);
    else
    this.notifyPopup.info(commonMessages.upload_msg);
  }

  confirmation__upgrade() {
      if (!this.image_name) {
      this.notifyPopup.error(commonMessages.firmwareSelect);
      return;
    }
    this.upgrade_boolStatus = true;
    this.notifyPopup.info(commonMessages.upgrade_msg);
  }

  upgradeFiles() {
    if(this.checkStatus == 1)
    this.notifyPopup.showLoader(commonMessages.maintenance_AP_upgrade);
    else
     this.notifyPopup.showLoader(commonMessages.maintenance_AP_upload);
  
    // this.spinnerService.show();
    this.alertService.close(this.alertPopUp);

    if (this.uploadType == 'ftp') {
      this.uploadTypeVal = '1';
      this.uploadType == 'ftp';
    }
    else {
      this.uploadTypeVal = '2';
      this.uploadType == 'local';
    }
    let formdata: FormData = new FormData();
    console.log('////' + this.ip_address + '' + this.userName + '/////' + this.password);
    if (this.uploadTypeVal == '2') {
      formdata.append('file', this.filelist[0]);
      console.log(this.filelist[0].size + '///////' + this.firmwareFileName + '////' + this.ip_address + '' + this.userName + '/////' + this.password);

    }
    else {
      formdata.append('name', this.firmwareFileName);
      formdata.append('ip_address', this.ip_address);
      formdata.append('username', this.userName);
      formdata.append('password', this.password);
    }

    formdata.append('ap_model', this.apModelVal);
    formdata.append('do_upgrade', this.checkStatus);
    formdata.append('upload', this.uploadTypeVal);
    if (this.checkStatus == 1)
      formdata.append('group_id', this.groudId);
    else
      formdata.append('group_id', null);
    // console.log(formdata+"///////"+this.apModelVal+"////"+this.uploadType +""+this.checkStatus+"/////"+this.groudId);

    this._service.postFiles('maintenance/ap-image-upgrade/', formdata).then(_data => {
      console.log('///' + _data.json().msg);
      this.notifyPopup.hideLoader('');
      if (_data.json().status == 1) {
        if (this.checkStatus == 1)
          this.notifyPopup.success(commonMessages.upgrade_with_upload);
        else
          this.notifyPopup.success(commonMessages.upload_only);

        this.reset();
      } else {
        this.notifyPopup.error(_data.json().msg);

      }


    });
  }


  reset() {
    this.apModelStr = 'Please select';
    this.uploadType = 'local';
    this.filename = '';
    this.firmwareFileName = '';
    this.ip_address = '';
    this.userName = '';
    this.password = '';
    this.checkBool = false;
    this.mailForm.reset();
    this.uploadbuttondisabled=true;
    this.ftp.nativeElement.style.display = "none";
    this.local.nativeElement.style.display = "block";
    this.btnName = "Upload";
     this.uploadTableStatus =  false;
      this.tableStatus =  this.uploadTableStatus;
  } 

  upgradeReset(){
    this.upgrade_time='Please select';
     this.upgradeApModel ='Please select';
     this.apModelVal="";
     this.all_particular_apis="allApis";
     this.selectedAPArray =[];
    this.upgradeGroupName='-1';
     this.upgrade_type='upgrade_group';
     this.image_name = '';
    this.upgradeTableStatus = false;
    this.gp.nativeElement.style.display = 'block';
    this.ap.nativeElement.style.display = 'none';
    this.btnName = "Upload";
     this.tableStatus =  this.upgradeTableStatus;
     this.ap_type_id = 'ap_name';
     this.saveBtnStatus = false;
  }

  closePopup() {
    this.selectedAPArray = [];
    this.all_particular_apis = 'allApis';
    this.Ap_model_bool_status = false;
    this.overLay.nativeElement.style.display = 'none';
  }

  check_mac_name() {

    if (this.selectedAPArray.length == 0) {
      this.closePopup();
    } else {

      this.Ap_model_bool_status = false;
      this.overLay.nativeElement.style.display = 'none';
      this.all_particular_apis = 'particularApis';
    }

  }

  toogleDiv(toogle_div_bool) {
    this.toogleDiv_bool = !toogle_div_bool;
  }

  selectAPType(type) {
    this.ap_type_id = type;
    this.toogleDiv_bool = !this.toogleDiv_bool;
  }

  saveUpgrade() {
     this.image_name = '';
    if (this.upgrade_type == 'upgrade_group') {
      if (this.upgradeGroupName == '-1') {
        this.upgradeTableStatus = false;
        this.notifyPopup.error(commonMessages.groupSelectionError);
        return;
      }
      else if (this.apModelVal == 'Please select' || this.upgradeApModel == 'Please select') {
        this.upgradeTableStatus = false;
        this.notifyPopup.error(commonMessages.apModelSelectionError);
        return;
      }

    } else {
      if (this.apModelVal == 'Please select' || this.upgradeApModel == 'Please select') {
        this.upgradeTableStatus = false;
        this.notifyPopup.error(commonMessages.apModelSelectionError);
        return;
      }
      else if (this.upgradeGroupName == '-1') {
        this.upgradeTableStatus = false;
        this.notifyPopup.error(commonMessages.groupSelectionError);
        return;
      }

    }

    if (this.upgrade_time == 'Please select') {
      this.notifyPopup.error(commonMessages.upgrade_type);
      return;
    }

     this.upgradeTableStatus =  true;
      this.tableStatus =  this.upgradeTableStatus;
     this.checkboxVisibility = true;
       this.errorMsgStatus = false;
     this.imageList();
  }

  imageList(){
       this._service.getWeb('maintenance/ap-image-upgrade/?ap_model='+this.apModelVal,"","").then(_data => {
     console.log(_data);
     if(_data.status == 1){
     this.upgradeTableData = _data.result;
     if(this.upgradeTableData.length == 0)
     this.errorMsgStatus = true;
     else
     this.saveBtnStatus = true;
      console.log(""+this.upgradeTableData);
         }
    });


  }

  save_image_upgrade() {
    this.mac_address_list = [];
      
     if(this.upgrade_type == "upgrade_group"){
      if(this.upgradeGroupName == '-1'){
        this.upgradeTableStatus = false;
        this.notifyPopup.error(commonMessages.groupSelectionError);
        return;
      }
      else if(this.apModelVal == 'Please select'  ||  this.upgradeApModel == 'Please select'){
         this.upgradeTableStatus = false;
        this.notifyPopup.error(commonMessages.apModelSelectionError);
         return;
      }

  }else {
    if(this.apModelVal == 'Please select' ||  this.upgradeApModel == 'Please select'){
         this.upgradeTableStatus = false;
        this.notifyPopup.error(commonMessages.apModelSelectionError);
         return;
      }
    else if(this.upgradeGroupName == '-1'){
        this.upgradeTableStatus = false;
        this.notifyPopup.error(commonMessages.groupSelectionError);
         return;
      }

  }

  if(this.upgrade_time == 'Please select'){
      this.notifyPopup.error(commonMessages.upgrade_type);
     return;
   }
   if(!this.image_name){
      this.notifyPopup.error(commonMessages.firmwareSelect)
      return;
   }

   if(this.upgrade_time == "Upgrade Now")
   this.upgrade_time = "0";
   else
   this.upgrade_time = "1";
   this.notifyPopup.showLoader(commonMessages.save_image_upgrade);
    if(this.all_particular_apis == 'allApis'){
      this.mac_address_list =[];
    }else {
      for(var i=0 ; i< this.selectedAPArray.length;i++){
    this.mac_address_list.push({ap_mac:this.selectedAPArray[i]});
     }
    }
    var body = {
      ap_model: this.apModelVal,
      do_upgrade: 1,
      group_id: this.groudId,
      upload_type: this.upgrade_time,
      image_name: this.image_name,
      ap_mac: this.mac_address_list
    };
    this._service.postJson('maintenance/ap-image-upgrade/', body).then(_data => {
      if (_data.status == 1) {
        this.notifyPopup.hideLoader('');
        this.upgradeTableStatus = false;
        this.upgradeReset();
        this.notifyPopup.success(_data.msg);
      }

    });

  }

  ngAfterViewInit() {
    $('.upgrade-tabs .tab-links a').on('click', function (e) {
      var currentAttrValue = jQuery(this).attr('href');

      // Show/Hide Tabs
      $('.upgrade-tabs ' + currentAttrValue).show().siblings().hide();

      // Change/remove current tab to active
      $(this).parent('li').addClass('active').siblings().removeClass('active');

      e.preventDefault();
    });

    $('#select-filter').change(function () {
      var selectedOption = $(this).val();
      $('.filter-content').hide();
      $('#' + selectedOption).show();
      // console.log(aa);
    });

    $('#select-filter-upgrade').change(function () {
      var selectedOption = $(this).val();
      console.log(selectedOption);
      $('.filter-content-upgrade').hide();
      $('#' + selectedOption).show();
      console.log($('#' + selectedOption));
    });
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }

}
