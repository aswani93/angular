import {Component, OnInit, SimpleChange, ViewChild} from '@angular/core';
import {WebserviceService} from '../../services/commonServices/webservice.service';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ModalDirective} from 'ngx-bootstrap';
import {commonMessages, NotificationService} from '../../services/notificationService/NotificationService';
import {TooltipService} from '../../services/tooltip/tooltip.service';
import {WidgetServiceService} from '../../services/widget/widget-service.service';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  apStatus_bool = false;
  alarm_bool = false;
  accessPoint_bool = false;
  clientTop_bool = false;
  apTraffic_bool = false;
  groupTraffic_bool = false;
  cpuUtilizationTop_bool = false;
  memoryUtilizationTop_bool = false;
  clientsGroup_bool = false;
  clientssid_bool = false;
  wlcInfo_bool = false;
  groupsTop_bool = false;
  apiErrorMessage = '';

  //  for VRRP modal.
  @ViewChild('f') vrrpFormt: NgForm;
  @ViewChild('staticModal') staticModal: ModalDirective;
  vrrpForm: FormGroup;
  vrrp_configured: boolean;
  wlc_ip: string;
  netmask_wlc: string;
  netmask_vrrp: string;
  payLoad = {};
  loading = false;
  apiError = false;
  btnDisable = true;
  apStatusData: any;
  wlcCPUData: any;
  wlcMemory: any;
  clientGroupData: any;
  clientSSIDData: any;
  wlcNetworkData: any;
  alarmData: any;
  wlcInfoData: any;
  dataResult: any;
  arrayBackup: any = [];
  ipValdationRegex = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;

  constructor(private _service: WebserviceService,
              private notifyPopup: NotificationService,
              private tooltipService: TooltipService,
              private widgetService: WidgetServiceService) {

  }

  ngOnInit() {
    this.cloneNodeList();
    this.generateForm();
    this.checkVRRPStatus();
    this.loadDashData();
    this.widgetService.updatePositionWidget().subscribe((list) => {
      console.log('update list ' + list);
      this.updateWidgetSetting(list.list);
    });
    let that = this;
    $(window).scroll(function () {
      if (that.isInView($('.apStatus')) && !that.apStatus_bool) {
        // console.log('enter into apStatus......');
        that.apStatus_bool = true;
      }
      if (that.isInView($('.alarm')) && !that.alarm_bool) {
        // console.log('enter into alarm......');
        that.alarm_bool = true;
      }
      if (that.isInView($('.accessPoint')) && !that.accessPoint_bool) {
        // console.log('enter into accessPoint......');
        that.accessPoint_bool = true;
      }
      if (that.isInView($('.clientTop')) && !that.clientTop_bool) {
        // console.log('enter into clientTop......');
        that.clientTop_bool = true;
      }
      if (that.isInView($('.apTraffic')) && !that.apTraffic_bool) {
        // console.log('enter into apTraffic......');
        that.apTraffic_bool = true;
      }
      if (that.isInView($('.groupTraffic')) && !that.groupTraffic_bool) {
        // console.log("enter into groupTraffic......");
        that.groupTraffic_bool = true;
      }
      if (that.isInView($('.cpuUtilizationTop')) && !that.cpuUtilizationTop_bool) {
        // console.log('enter into cpuUtilizationTop......');
        that.cpuUtilizationTop_bool = true;
      }
      if (that.isInView($('.memoryUtilizationTop')) && !that.memoryUtilizationTop_bool) {
        //  console.log('enter into memoryUtilizationTop......');
        that.memoryUtilizationTop_bool = true;
      }

      if (that.isInView($('.clientsGroup')) && !that.clientsGroup_bool) {
        // console.log('enter into clientsGroup......');
        that.clientsGroup_bool = true;
      }
      if (that.isInView($('.clientssid')) && !that.clientssid_bool) {
        // console.log('enter into clientssid......');
        that.clientssid_bool = true;
      }
      if (that.isInView($('.wlcInfo')) && !that.wlcInfo_bool) {
        // console.log('enter into wlcInfo......');
        that.wlcInfo_bool = true;
      }
      if (that.isInView($('.groupsTop')) && !that.groupsTop_bool) {
        // console.log('enter into groupsTop......');
        that.groupsTop_bool = true;
      }
    });

  }

  generateForm() {
    this.vrrpForm = new FormGroup({
      'vrrp_ip': new FormControl('', [
        Validators.required,
        Validators.pattern(this.ipValdationRegex),
        this.restrictedIP
      ]),
    });
  }


  public restrictedIP(control: FormControl) {
    //  console.log(control.value);
    const value = control.value;
    const result = value.split('.');
    const isValid = (result[0] == '192' && result[1] == '0' && result[2] == '2') || (result[3] == '255' || result[0] == '224' || result[0] == '0' || result[0] == '4' || result[0] == '8' || result[0] == '127' || result[0] == '5' || result[0] == '255' || result[0] == '00' || result[0] == '000');
    //  console.log(isValid);
    return isValid ? {'restrictedIP': true} : null;
  }

  public allowedRange(control: FormControl) {
    //  const wlc_ip =  this.wlc_ip.split('.');
    const wlc_ip = sessionStorage.getItem('wlc_ip').split('.');
    console.log(wlc_ip);
    const value = control.value;
    const result = value.split('.');
    const isValid = (result[0] == wlc_ip[0] && result[1] == wlc_ip[1] && result[2] >= 0 && result[3] < 255);
    console.log(isValid);
    return isValid ? null : {'notInRange': true};
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log(changes);
  }

  isInView(elem) {
    var nav = $(elem);
    if (nav.length) {
      return $(elem).offset().top - $(window).scrollTop() - 200 < $(elem).height();
    }
  }

  cloneNodeList() {
    var obj;
    var parent = document.getElementById('main');
    var children = parent.getElementsByClassName('widget_pos');
    for (var i = 0; i < 12; i++) {
      obj = {};
      obj.element = children[i];
       // console.log(obj.element);
        this.arrayBackup.push(obj);
   }
    

  }


  loadDashData() {

    this._service.getWeb('dashboard/widget-settings/', '', '').then(result => {
      // var result = { "status": "1", "result": { "widget_position": [11,1,2,3,4,5,6,7,8,9], "ap_online_status": { "refresh_interval": 60000, "online_colour": "#1219e8", "offline_colour": "#121229" },"alarm_status": { "refresh_interval": 60000},"wlc_info": { "refresh_interval": 60000}, "wlc_cpu": { "graph_period": 'live', "vm_host":'HOST', "colour_options": ["#AF39DD","#FFCF0B"] }, "wlc_memory":{ "graph_period": 'live', "vm_host":'HOST', "colour_options": ["#AF39DD","#FFCF0B"] }, "wlc_network": { "graph_period": 'live', "vm_host": 'HOST', "colour_options": ["#AF39DD","#FFCF0B"] }, "clients_group": { "refresh_interval": 60000, "colour_options":["#F95577","#B8CE69","#AF39DD","#FFCF0B","#09C4D3","#E51919","#54CC19","#ff9141","#95a2a9","#1f2939"], "graph_type": 1, "custom_items": [] }, "clients_ssid": { "refresh_interval":60000, "colour_options":["#F95577","#B8CE69","#AF39DD","#FFCF0B","#09C4D3","#E51919","#54CC19","#ff9141","#95a2a9","#1f2939"], "graph_type": 1, "custom_items": [] } } }

      if (result.status == '1') {
        this.dataResult = result.result.widget_position;
        this.widgetService.addWidgetdetails(this.dataResult);
       // console.log(">>>>>current array is"+this.dataResult);
        var parent = document.getElementById("main");
       for (i = 0; i < 12; i++) {
         parent.appendChild(this.arrayBackup[i].element);
    } 
      var children = parent.getElementsByClassName("widget_pos");
       var ids = [], obj, i, len;
    for (i = 0, len = result.result.widget_position.length; i < len; i++) {
        obj = {};
         if(i<4){
        //console.log(children[result.result.widget_position[i]]);
        if(result.result.widget_position[i] == 0){
         this.apStatus_bool = true;

        }
        
        else if(result.result.widget_position[i] == 1){
           this.alarm_bool = true; 
        }
      
        else if(result.result.widget_position[i] == 2){
          this.accessPoint_bool = true;
        }
        
        else if(result.result.widget_position[i] == 3){
          this.clientTop_bool = true;
        }
        
         else if(result.result.widget_position[i] == 4){
          this.apTraffic_bool = true;
        }
        
        else if(result.result.widget_position[i] == 5){
          this.groupTraffic_bool = true;
        }
        
         else if(result.result.widget_position[i] == 6){
          this.cpuUtilizationTop_bool = true;
        }
        
         else if(result.result.widget_position[i] == 7){
          this.memoryUtilizationTop_bool = true;
        }
        
        else if(result.result.widget_position[i] == 8){
          this.clientsGroup_bool = true;
        }
        
         else if(result.result.widget_position[i] == 9){
          this.clientssid_bool = true;
         }
        
          }
        obj.element = children[result.result.widget_position[i]];
        obj.idNum = result.result.widget_position[i];
        //console.log(obj.element);
        ids.push(obj);
       
    }
     parent.innerHTML = '';
    for (i = 0; i < ids.length; i++) {
         parent.appendChild(ids[i].element);
    }
    this.apStatusData = result.result.ap_online_status;
    this.alarmData =  result.result.alarm_status;
    this.wlcCPUData = result.result.wlc_cpu;
    this.wlcMemory = result.result.wlc_memory;
    this.clientGroupData  = result.result.clients_group;
    this.clientSSIDData =  result.result.clients_ssid;
    this.wlcNetworkData =  result.result.wlc_network;
    this.wlcInfoData =  result.result.wlc_info;
    
      } 
      else{
        //this.notifyPopup.error(result.result);
      }
    });


  }


  allowDrop(ev) {
    ev.preventDefault();
    //   console.log('xxxxxxxxxxxxx');
  }

  drag(ev) {
    ev.dataTransfer.setData('src', ev.target.id);
  }

  drop(ev) {
    ev.preventDefault();
    var src = document.getElementById(ev.dataTransfer.getData('src'));
    var srcParent = src.parentNode;
    var tgt = ev.currentTarget.firstElementChild;
    // console.log(ev.dataTransfer.getData('src')+'hihihihhihi'+ev.currentTarget.firstElementChild.id);
    var split_src = (ev.dataTransfer.getData('src')).split('drag')[1];
    var split_tgt = (ev.currentTarget.firstElementChild.id).split('drag')[1];
    ev.currentTarget.replaceChild(src, tgt);
    srcParent.appendChild(tgt);

    var a, b;
    for (var i = 0; i < this.dataResult.length; i++) {
      if (split_src == this.dataResult[i]) {
        this.dataResult[i] = parseInt(split_tgt);
        //  console.log(split_src +"// // /"+this.dataResult[i]+"at src position"+ split_tgt)
      }
      else if (split_tgt == this.dataResult[i]) {
        this.dataResult[i] = parseInt(split_src);
        //  console.log(split_src +"// // /"+this.dataResult[i]+"at tgt position"+ split_tgt)
      }
    }
    this.updateWidgetSetting(this.dataResult);


  }

  updateWidgetSetting(result) {
    var updatedVal = {'widget_position': result};
    // console.log(">>>>>array will be"+this.dataResult);
    // this.notifyPopup.showLoader(commonMessages.AP_updating_msg);
    this._service.postJson('dashboard/widget-settings/', updatedVal).then(
      _data => {
        if (_data) {
          console.log('>>>>>>>>' + _data);
          this.loadDashData();
          this.widgetService.addWidgetdetails(this.dataResult);
        }
      }).catch((error) => {
      //  this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  deleteWidget(event) {
    var index = this.dataResult.indexOf(event.id);
    if (index > -1) {
      this.dataResult.splice(index, 1);
    }
    this.updateWidgetSetting(this.dataResult);

  }

  private checkVRRPStatus() {
    this.vrrp_configured = sessionStorage.getItem('vrrp_configured') === 'true' ? true : false;
    // this.vrrp_configured = true;
    this.wlc_ip = sessionStorage.getItem('wlc_ip');
    this.netmask_wlc = sessionStorage.getItem('netmask_wlc');
    this.netmask_vrrp = sessionStorage.getItem('netmask_vrrp');
    if (!this.vrrp_configured) {
      setTimeout(() => {
        this.staticModal.show();
      }, 500);
    } else {
      this.staticModal.hide();
    }
  }


  onReset() {
    this.vrrpForm.setValue({vrrp_ip: ''});
  }

  onSubmit() {
    this.staticModal.hide();
    this.payLoad = this.createFormData();

    this.notifyPopup.showLoader('Please wait...');

    this._service.postJson('configurations/wlc-vrrp-info/', this.payLoad).then(_result => {
      if (_result.status === '1') {
        this.notifyPopup.success('VRRP IP Added successfully');
        // this.notifyPopup.hideLoader('');

        sessionStorage.setItem('vrrp_configured', 'true');
        setTimeout(() => {
          this.loading = false;
        }, 2000);
        this.staticModal.hide();
      } else {
        this.apiErrorMessage = _result.msg;
        setTimeout(() => {
          this.staticModal.show();
        }, 300);
        this.apiError = true;
        //  this.btnDisable = true;
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }


  private createFormData() {
    const vrrp_ip = this.vrrpForm.value.vrrp_ip;
    const netmask = sessionStorage.getItem('netmask_vrrp');

    const payLoad = {
      vrrp_ip: vrrp_ip,
      netmask: netmask
    };
    return payLoad;
  }

  checkButtonInput() {
    this.apiError = false;
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }


  //  checkVrrpIP(vrrpIP, event) {
  //    let i, l;
  //    for (i = l = 0; i < vrrpIP.length; i++) {
  //      if (vrrpIP[i] === '.') {
  //        l++;
  //      }
  //      if (l >= 3 && event.keyCode !== 8 && event.keyCode !== 46) {
  //        const vrrp_ip = vrrpIP;
  //        const netmask = sessionStorage.getItem('netmask_vrrp');
  //        const payLoad = {
  //          vrrp_ip: vrrp_ip,
  //          netmask: netmask
  //        };
  //        this._service.postJson('accounts/wlc-vrrp-info/', payLoad).then(_result => {
  //          if (_result.status === '1') {
  //            //   sessionStorage.setItem('vrrp_configured', 'true');
  //            this.apiError = false;
  //            this.btnDisable = false;
  //          } else {
  //            console.log('else');
  //            //  this.apiErrorMsg = _result.msg[0];
  //            this.apiError = true;
  //            this.btnDisable = true;
  //            setTimeout(() => {
  //              this.apiError = false;
  //            }, 60000);
  //          }
  //        });
  //      }
  //    }
  //  }


}
