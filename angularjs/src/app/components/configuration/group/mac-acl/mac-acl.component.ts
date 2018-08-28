import {NotificationService, commonMessages} from './../../../../services/notificationService/NotificationService';
import {TooltipService} from './../../../../services/tooltip/tooltip.service';
import {WebserviceService} from './../../../../services/commonServices/webservice.service';
import {Component, OnInit, ViewChild, AfterViewInit, SimpleChanges, ElementRef} from '@angular/core';
import {DataTable, SortEvent} from 'angular2-datatable';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {element} from 'protractor';
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';

@Component({
  selector: 'app-mac-acl',
  templateUrl: './mac-acl.component.html',
  styleUrls: ['./mac-acl.component.css']
})
export class MacAclComponent implements OnInit, AfterViewInit {

  public Data: MacProfile[];
  public OrginalData: MacProfile[];
  public ConnectDeviceReturn: any[];
  public ConnectedDeviceList: MacList[];
  public MacFileReturn: string[];
  public DeleteMacFileReturn: string[];
  public CLientMacList: MacList[];
  public coloumsObjects: any[];
  public selectedProfiles: MacProfile[];
  public MacEditList: EditMacList;
  public rowsOnPage = 20;
  public currentPage;
  public _sortBy: any;
  public _sortOrder: any;
  public macForm: FormGroup;
  public addProduct: boolean = true;
  public Isnew: boolean = true;
  public filelist: FileList;
  public isEditName: string;
  public isEditId: string;
  public isAllMacSelected: boolean;
  public isAllClientSelected: boolean;
  public isAllMacProfileSelected: boolean;
  public currentDeleteSelection: string;
  public isEdit: boolean;
  public isNewEnable: boolean;
  public isDuplicate: boolean;
  public dataLength;
  private showingto = 0;
  private showingfrom = 0;
  public isEditEnable = true;
  private isEditResetData: any;
  public groupdetailArr: any[];
  /* pagination declaration variable*/
  page: number = 1;
  Math: any = Math;
  firstarrowStatus: boolean = true;
  lastarrowStatus: boolean = false;
  /*pagination declaration variable end */
  private namepattern = /^[-a-zA-Z0-9-()_=,^;:"'~`@./#&+*!%]/;
  @ViewChild('mf')
  private macalcdataTable: DataTable;

  /*   public connectedClient = [
      {ap_mac: '34:17:eb:93:00:b2'},
      {ap_mac: '34:07:eb:93:00:b2'},
      {ap_mac: '34:27:eb:93:00:b2'},
      {ap_mac: '34:87:eb:93:00:b2'},
      {ap_mac: '04:87:eb:93:00:b2'},
      {ap_mac: '24:87:eb:93:00:b2'},
      {ap_mac: '14:87:eb:93:00:b2'},
      {ap_mac: '54:87:eb:93:00:b2'},
      {ap_mac: '64:87:eb:93:00:b2'}
    ]; */


  constructor(private _service: WebserviceService, private tooltipService: TooltipService, private notifyPopup: NotificationService,
              private spinnerService: Ng4LoadingSpinnerService, private elRef: ElementRef) {
  }

  ngOnInit() {
    this.loadData();
    this.coloumsObjects = [
      {name: 'Portal Name', checked: true},
      {name: 'Redirect URL', checked: true},
      {name: 'No. of Associated Groups', checked: true},
      {name: 'Preview', checked: true}
    ];
    this.generateForm();
    this.CLientMacList = [];
    this.MacFileReturn = [];
    this.isAllMacSelected = false;
    this.isAllMacProfileSelected = false;
    this.isNewEnable = false;
    this.selectedProfiles = [];
    this.ConnectedDeviceList = [];
    this.MacEditList = <EditMacList>{};
    this.MacEditList.add_trusted_mac = [];
    this.MacEditList.delete_trusted_mac = [];
    this.isDuplicate = false;
    this.MacEditList.add_trusted_mac.push('val');
    this.MacEditList.delete_trusted_mac.push('val');
    this.MacEditList.add_trusted_mac.pop();
    this.MacEditList.delete_trusted_mac.pop();
    this.isAllClientSelected = false;
    this.isEditEnable = false;
    this.groupdetailArr = [];
    this.notifyPopup.confirmationOk().subscribe((page) => {
      if (page == 'macAclConfiguration') {
        this.deleteCommon();
      }
    });
    this.notifyPopup.showing().subscribe((page) => {
      if (page == 'macAclConfiguration') {
        this.showGroupnames();
      }
    });
  }

  loadData() {

    this._service.getWeb('configurations/mac-acl-group/', '', '').then(_result => {
      if (_result) {
        this.Data = _result.result;
        this.OrginalData = Object.assign([], this.Data);
      }
    });
    this._service.getWeb('statistics/connected-clients/', '', '').then(info => {
      if (info) {
        this.ConnectDeviceReturn = info.result;
        // this.ConnectDeviceReturn = this.connectedClient;
        this.ConnectDeviceReturn.forEach(elem => {
          this.ConnectedDeviceList.push({IsSelect: false, MacId: elem.client_mac});
        });
      }
    }).catch((error) => {
      this.notifyPopup.logoutpop(commonMessages.InternalserverError);
    });
  }

  ngAfterViewInit() {
    this.macalcdataTable.onSortChange.subscribe((event: SortEvent) => {
      this._sortBy = event.sortBy;
      this._sortOrder = event.sortOrder;
    });
  }

  showGroupnames() {
    this.notifyPopup.details(this.groupdetailArr);
    return false;
  }

  showAddProfile() {
    this.addProduct = false;
    this.Isnew = true;
    this.isEdit = false;
    this.isAllClientSelected = false;
    this.MacEditList.delete_trusted_mac = [];
    this.MacEditList.add_trusted_mac = [];
    this.MacFileReturn = [];
    this.CLientMacList = [];
    this.macForm.get('mac_acl_profile_name').reset();
    this.macForm.get('new_mac').reset();
    this.macForm.get('fileBrowse').reset();
  }

  selectAllMac() {
    this.isAllMacSelected = this.isAllMacSelected ? false : true;
  }

  selectAllMacProfile() {
    this.isAllMacProfileSelected = this.isAllMacProfileSelected ? false : true;
  }

  selectAllClientSelected() {
    this.isAllClientSelected = this.isAllClientSelected ? false : true;
  }

  search(event) {
    if (event.target.value.length > 0) {
      setTimeout(() => {
        this.Data = [];
        this.OrginalData.forEach(elem => {
          if (elem.mac_acl_profile_name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1) {
            this.Data.push(elem);
          }
        });
        this.selectedProfiles = [];
      }, 500);
    } else {
      setTimeout(() => {
        this.Data = Object.assign([], this.OrginalData);
      }, 500);
    }
  }

  ProfilecheckboxClick(e, val, indexVal = false) {
    if (e.target.checked) {
      this.selectedProfiles.push(val);
    } else {
      const index = this.selectedProfiles.indexOf(val);
      if (index > -1) {
        this.selectedProfiles.splice(index, 1);
      }
    }
    if (indexVal) {
      this.selectedProfiles.push(val);
    }
    if (this.selectedProfiles.length === 0) {
      this.isNewEnable = false;
    } else {
      this.isNewEnable = true;
    }
  }

  setValue(val, item) {
    item.IsSelect = val.target.checked;
  }

  EditChangeName() {
    if (this.isEdit) {
      let isChange = false;
      if (this.DeleteMacFileReturn.length == this.MacFileReturn.length) {
        this.DeleteMacFileReturn.forEach(elem => {
          const index = this.MacFileReturn.indexOf(elem);
          if (index < 0) {
            isChange = true;
          }
        });
      } else {
        isChange = true;
      }
      if (this.macForm.get('mac_acl_profile_name').value != this.isEditName || isChange) {
        if (this.macForm.get('mac_acl_profile_name').status != 'INVALID') {
          this.isEditEnable = true;
        } else {
          this.isEditEnable = false;
        }
      } else {
        this.isEditEnable = false;
      }
    }
  }

  editMacAclProfile() {
    if (this.selectedProfiles.length === 1) {
      this.addProduct = true;
      this.isEdit = true;
      this.Isnew = false;
      this.DeleteMacFileReturn = [];
      this.MacFileReturn = [];
      this.CLientMacList = [];
      this.isAllMacSelected = false;
      this.isAllClientSelected = false;
      this.isEditResetData = this.selectedProfiles[0];
      this.isEditId = this.selectedProfiles[0].mac_acl_profile_id;
      this.isEditName = this.selectedProfiles[0].mac_acl_profile_name;
      this.macForm.get('new_mac').reset();
      this.macForm.get('fileBrowse').reset();
      this.macForm.get('mac_acl_profile_name').setValue(this.selectedProfiles[0].mac_acl_profile_name);
      this.macForm.get('policy').setValue(this.selectedProfiles[0].policy);
      this.selectedProfiles[0].trus_macs.forEach(elem => {
        const isindex = this.MacFileReturn.findIndex(item => item.toLowerCase() === elem.toLowerCase());
        if (isindex <= -1) {
          this.MacFileReturn.push(elem);
          this.CLientMacList.push({MacId: elem, IsSelect: false});
        }
      });
      this.DeleteMacFileReturn = Object.assign([], this.MacFileReturn);
      this.setConnectedClientList();
      setTimeout(() => {
        this.addProduct = false;
      }, 10);
    } else {
      this.notifyPopup.error('Please select one');
    }
  }

  generateForm() {
    this.macForm = new FormGroup({
      'mac_acl_profile_name': new FormControl('',
        [Validators.required, Validators.minLength(2), Validators.maxLength(25), this.noEmoji,
          Validators.pattern(this.namepattern), this.noSpaceatend]),
      'merge': new FormControl('merge'),
      'fileBrowse': new FormControl([
        // Validators.required

      ]),
      'policy': new FormControl('allow', Validators.required),
      'new_mac': new FormControl('', this.checkMacFormat),
      'isAllMac': new FormControl('')
    });
  }

  FileChange(event) {
    const files = event.target.files;
    this.filelist = files;
    const formdata: FormData = new FormData();
    formdata.append('file', this.filelist[0]);
    this._service.postFiles('configurations/upload-mac-list/', formdata).then(_data => {
      if (_data.json().status == 1) {
        if (this.macForm.get('merge').value == 'add') {
          this.MacFileReturn.forEach(elem => {
            this.pushToDelete(elem);
          });
          this.MacFileReturn = [];
          this.MacFileReturn = JSON.parse(_data._body).results;
          this.MacFileReturn = this.MacFileReturn.splice(0, 200);
          this.CLientMacList = [];
          this.MacFileReturn.forEach(elem => {
            if (this.CLientMacList.length >= 200) {
              this.notifyPopup.error('Limit exceeds 200');
              return false;
            }
            this.CLientMacList.push({IsSelect: false, MacId: elem});
            if (this.isEdit) {
              this.pustToCreate(elem);
              this.EditChangeName();
            }
          });
        }
        if (this.macForm.get('merge').value == 'merge') {
          const temp = JSON.parse(_data._body).results;
          temp.forEach(elem => {
            if (this.CLientMacList.length >= 200) {
              this.notifyPopup.error('Limit exceeds 200');
              return false;
            }
            const isindex = this.MacFileReturn.findIndex(item => item.toLowerCase() === elem.toLocaleLowerCase());
            if (isindex <= -1) {
              this.MacFileReturn.push(elem);
              this.CLientMacList.push({IsSelect: false, MacId: elem});
              if (this.isEdit) {
                this.pustToCreate(elem);
                this.EditChangeName();
              }
            }
          });
        }
        this.macForm.get('fileBrowse').reset();
      } else {
        this.notifyPopup.error('Error in mac format');
        this.macForm.get('fileBrowse').reset();
      }
    });
  }

  getToolTipText(fieldId: string) {
    return this.tooltipService.fetchTooltip(fieldId);
  }

  deleteTrustMac() {
    const num =  this.CLientMacList.filter( elem => elem.IsSelect == true);
    if (num.length > 0 || this.macForm.get('isAllMac').value) {
    this.notifyPopup.info('Do you want to delete seletecd mac?');
    this.currentDeleteSelection = 'Mac';
    } else {
      this.notifyPopup.error('Please select one');
    }
  }

  ProfileMac() {
    if (this.selectedProfiles.length > 0 || (this.isAllMacProfileSelected)) {
    this.notifyPopup.info('Do you want to delete seletecd profile?');
    this.currentDeleteSelection = 'Profile';
    } else {
      this.notifyPopup.error('Please select one');
    }
  }

  deleteCommon() {
    if (this.currentDeleteSelection === 'Mac') {
      if (this.macForm.get('isAllMac').value === true) {
        if (this.isEdit) {
          this.MacFileReturn.forEach(elem => {
            this.pushToDelete(elem);
          });
        }
        this.MacFileReturn = [];
        this.CLientMacList = [];
        if (this.isEdit) {
          this.EditChangeName();
        }
        this.macForm.get('isAllMac').setValue(false);
        this.isAllMacSelected = false;
        this.elRef.nativeElement.querySelectorAll('.mac-checkk')['checked'] = false;
      } else {
        this.CLientMacList.forEach(elem => {
          const index = this.MacFileReturn.findIndex(item => item.toLowerCase() === elem.MacId.toLocaleLowerCase());
          if (index >= 0) {
            if (elem.IsSelect) {
              if (this.isEdit) {
                this.pushToDelete(elem.MacId);
              }
              this.MacFileReturn.splice(index, 1);
              if (this.isEdit) {
                this.EditChangeName();
              }
            }
          }
        });
      }
      this.resetTrustApi();
      this.setConnectedClientList();
      this.notifyPopup.hideLoader('');
    }
    if (this.currentDeleteSelection === 'Profile') {
      const EditData = <DeleteList>{};
      EditData.mac_acl_profile_id = [];
      EditData.mac_acl_profile_name = [];
      if (!this.isAllMacProfileSelected) {
        if (this.selectedProfiles.length > 0) {
          this.selectedProfiles.forEach(elem => {
            EditData.mac_acl_profile_id.push(elem.mac_acl_profile_id);
            EditData.mac_acl_profile_name.push(elem.mac_acl_profile_name);
          });
          this._service.postJson('configurations/delete-mac-acl/', EditData).then(_result => {
            if (_result.status == 1) {
              this.addProduct = true;
              this.CLientMacList = [];
              this.ConnectedDeviceList = [];
              this.selectedProfiles = [];
              this.MacEditList.add_trusted_mac = [];
              this.MacEditList.delete_trusted_mac = [];
              this.loadData();
              this.groupdetailArr = [];
              setTimeout(() => {
                this.notifyPopup.hideLoader('');
                if (_result.undeleted_macs) {
                  if (_result.undeleted_macs.length > 0) {
                    _result.undeleted_macs.forEach(elem => {
                      let str = {'ssidname': elem, 'groups': elem};
                      this.groupdetailArr.push(str);
                    });
                    //this.groupdetailArr = _result.undeleted_macs;
                  } else {
                    this.notifyPopup.success('Selected profile deleted');
                  }
                } else {
                  if (_result.msg != null) {
                    this.notifyPopup.success(_result.msg);
                  } else {
                    this.notifyPopup.error('Something went wrong,Please try again...');
                  }
                }
              }, 800);
            } else {
              if (_result.msg != null) {
                this.notifyPopup.success(_result.msg);
              } else {
                this.notifyPopup.error('Something went wrong,Please try again...');
              }
            }
          });
        } else {
          this.notifyPopup.error('Please select one');
        }
      } else {
        this.Data.forEach(elem => {
          EditData.mac_acl_profile_id.push(elem.mac_acl_profile_id);
          EditData.mac_acl_profile_name.push(elem.mac_acl_profile_name);
        });
        this._service.postJson('configurations/delete-mac-acl/', EditData).then(_result => {
          if (_result.status == 1) {
            this.notifyPopup.success('Selected profile deleted');
            this.addProduct = true;
            this.CLientMacList = [];
            this.ConnectedDeviceList = [];
            this.selectedProfiles = [];
            this.MacEditList.add_trusted_mac = [];
            this.MacEditList.delete_trusted_mac = [];
            this.loadData();
          } else {
            this.notifyPopup.error('Something went wrong,Please try again...');
          }
        });
      }
    }
  }

  resetTrustApi() {
    this.CLientMacList = [];
    this.MacFileReturn.forEach(elem => {
      this.CLientMacList.push({MacId: elem, IsSelect: false});
    });
  }

  pushToDelete(val: any) {
    let index = this.MacEditList.add_trusted_mac.findIndex(item => item.toLowerCase() === val.toLowerCase());
    if (index >= 0) {
      this.MacEditList.add_trusted_mac.splice(index, 1);
    }
    index = this.MacEditList.delete_trusted_mac.findIndex(item => item.toLowerCase() === val.toLowerCase());
    if (index == -1) {
      this.MacEditList.delete_trusted_mac.push(val);
    }
  }

  pustToCreate(val: any) {
    let index = this.MacEditList.delete_trusted_mac.findIndex(item => item.toLowerCase() === val.toLowerCase());
    if (index >= 0) {
      this.MacEditList.delete_trusted_mac.splice(index, 1);
    }
    index = this.MacEditList.add_trusted_mac.findIndex(item => item.toLowerCase() === val.toLowerCase());
    if (index == -1) {
      this.MacEditList.add_trusted_mac.push(val);
    }
  }

  public checkMacFormat(control: FormControl) {
    let isMac = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}?)+$/.test(control.value);
    let isValid = isMac;
    return isValid ? null : {'invalidmac': true};
  }

  public noSpaceatend(control: FormControl) {
    if( control.value) {
    let isWhitespace = control.value.charAt(control.value.length - 1) === ' ';
    let isValid = !isWhitespace;
    return isValid ? null : {'spaceatend': true};
    } else {
      return null;
    }
  }

  public checkProfileName(control: string) {
    let exist: boolean = false;
    if (this.OrginalData.length > 0) {
      this.OrginalData.forEach(elem => {
        if (elem.mac_acl_profile_name === control) {
          exist = true;
        }
      });
      return exist;
    }
    exist ? this.isDuplicate = true : this.isDuplicate = false;
  }

  public noEmoji(control: FormControl) {
    let isEmoji = /(?:[\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|(?:\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6]|\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0]))/.test(control.value);
    let isValid = !isEmoji;
    return isValid ? null : {'emoji': true};
  }

  addNewMac() {
    if (this.macForm.controls.new_mac.status == 'VALID') {
      const isindex = this.MacFileReturn.findIndex(item => item.toLowerCase() === this.macForm.controls.new_mac.value.toLocaleLowerCase());
      if (isindex <= -1) {
        if (this.CLientMacList.length < 200) {
          this.MacFileReturn.push(this.macForm.controls.new_mac.value);
          this.CLientMacList.push({MacId: this.macForm.controls.new_mac.value, IsSelect: false});
          if (this.isEdit) {
            this.pustToCreate(this.macForm.controls.new_mac.value);
            this.EditChangeName();
          }
          this.macForm.get('new_mac').reset();
          this.macForm.get('new_mac').markAsUntouched();
        } else {
          this.notifyPopup.error('Limit exceeds 200');
        }
      } else {
        this.notifyPopup.error('Already present');
      }
    }
  }

  double_click_event($event, item, activeIndex) {
    this.isAllMacProfileSelected = false;
    this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    const chkLen = this.elRef.nativeElement.querySelectorAll('.mac-check').length;
    this.selectedProfiles = [];
    for (let i = 0; i < chkLen; i++) {
      this.elRef.nativeElement.querySelectorAll('.mac-check')[i]['checked'] = false;
    }
    this.ProfilecheckboxClick($event, item, true);
    this.editMacAclProfile();
    this.addProduct = false;
    setTimeout(() => {
      this.elRef.nativeElement.querySelectorAll('.mac-check')[activeIndex]['checked'] = true;
    }, 200);
  }

  MoveClientMacs() {
    let duplicate = false;
    if (this.isAllClientSelected) {
      this.ConnectedDeviceList.forEach(elem => {
        const isindex = this.MacFileReturn.findIndex(item => item.toLowerCase() === elem.MacId.toLocaleLowerCase());
        if (isindex <= -1) {
          if (this.CLientMacList.length < 200) {
            this.MacFileReturn.push(elem.MacId);
            this.CLientMacList.push({MacId: elem.MacId, IsSelect: false});
            if (this.isEdit) {
              this.pustToCreate(elem.MacId);
              this.EditChangeName();
            }
          } else {
            this.notifyPopup.error('Limit exceeds 200');
          }
        } else {
          duplicate = true;
        }
      });
      if (duplicate) {
        this.notifyPopup.error('Duplicate mac address not added');
      }
      this.setConnectedClientList();
    } else {
      this.ConnectedDeviceList.forEach(elem => {
        if (elem.IsSelect == true) {
          const isindex = this.MacFileReturn.findIndex(item => item.toLowerCase() === elem.MacId.toLocaleLowerCase());
          if (isindex <= -1) {
            if (this.CLientMacList.length < 200) {
              this.MacFileReturn.push(elem.MacId);
              this.CLientMacList.push({MacId: elem.MacId, IsSelect: false});
              if (this.isEdit) {
                this.pustToCreate(elem.MacId);
                this.EditChangeName();
              }
              elem.IsSelect = false;
            } else {
              this.notifyPopup.error('Limit exceeds 200');
            }
          } else {
            elem.IsSelect = false;
            duplicate = true;
          }
        }
      });
      if (duplicate) {
        this.notifyPopup.error('Duplicate mac address not added');
      }
    }
    this.setConnectedClientList();
  }

  setConnectedClientList() {
    //this.ConnectDeviceReturn = info.result;
    // this.ConnectDeviceReturn = this.connectedClient;
    this.ConnectedDeviceList = [];
    this.ConnectDeviceReturn.forEach(elem => {
      const index = this.MacFileReturn.findIndex(item => item.toLowerCase() === elem.client_mac.toLocaleLowerCase());
      if (index == -1) {
        this.ConnectedDeviceList.push({IsSelect: false, MacId: elem.client_mac});
      }
    });
  }

  SaveProfile() {
    //console.log(this.macForm.value);
    let EditData;
    let IsNamepresent = false;
    const formData = {
      'mac_acl_profile_name': this.macForm.get('mac_acl_profile_name').value,
      'trusted_mac': this.MacFileReturn
    };
    // if (this.isEditName !== this.macForm.get('mac_acl_profile_name').value ) {
    EditData = {
      'add_trusted_mac': this.MacEditList.add_trusted_mac,
      'delete_trusted_mac': this.MacEditList.delete_trusted_mac,
      'mac_acl_profile_name': this.macForm.get('mac_acl_profile_name').value,
      'mac_acl_profile_id': this.isEditId
    };
    // } else {
    //   EditData = {
    //    'add_trusted_mac': this.MacEditList.add_trusted_mac,
    //    'delete_trusted_mac': this.MacEditList.delete_trusted_mac,
    //    'mac_acl_profile_id' : this.isEditId
    //   };
    // }
    if (!this.isEdit) {
      IsNamepresent = this.checkProfileName(this.macForm.get('mac_acl_profile_name').value);
    } else {
      if (this.isEditName !== this.macForm.get('mac_acl_profile_name').value) {
        IsNamepresent = this.checkProfileName(this.macForm.get('mac_acl_profile_name').value);
      }
    }
    const IsLength = this.MacFileReturn.length > 0 ? true : false;
    if (!IsNamepresent) {
      if (IsLength) {
        if (!this.isEdit) {
          this._service.postJson('configurations/mac-acl-group/', formData).then(_result => {
            if (_result.status == 1) {
              this.notifyPopup.success('Saved successfully');
              this.isDuplicate = false;
              this.addProduct = true;
              this.CLientMacList = [];
              this.ConnectedDeviceList = [];
              this.selectedProfiles = [];
              this.MacEditList.add_trusted_mac = [];
              this.MacEditList.delete_trusted_mac = [];
              this.loadData();
            } else {
              this.notifyPopup.error('Something went wrong,Please try again...');
            }
          });
        } else {
          let temp: string[];
          temp = [];
          if (EditData.delete_trusted_mac.length > 0) {
            this.DeleteMacFileReturn.forEach(elem => {
              let index = EditData.delete_trusted_mac.findIndex(item => item.toLowerCase() === elem.toLocaleLowerCase());
              if (index > -1) {
                temp.push(elem);
              }
            });
            EditData.delete_trusted_mac = temp;
          }
          this._service.putJson('configurations/mac-acl-group/', EditData).then(_result => {
            if (_result.status == 1) {
              this.notifyPopup.success('Updated successfully');
              this.isDuplicate = false;
              this.addProduct = true;
              this.CLientMacList = [];
              this.ConnectedDeviceList = [];
              this.selectedProfiles = [];
              this.MacEditList.add_trusted_mac = [];
              this.MacEditList.delete_trusted_mac = [];
              this.loadData();
            } else {
              this.notifyPopup.error('Something went wrong,Please try again...');
            }
          });
        }
      } else {
        this.notifyPopup.error('Atleast one client mac address needed');
      }
    } else {
      this.notifyPopup.error('Name already present');
    }
  }

  resetAddProfile() {
    if (!this.isEdit) {
      setTimeout(() => {
        this.addProduct = true;
      }, 100);
      this.Isnew = true;
      this.isEdit = false;
      this.isAllClientSelected = false;
      this.MacEditList.delete_trusted_mac = [];
      this.MacEditList.add_trusted_mac = [];
      this.MacFileReturn = [];
      this.CLientMacList = [];
      this.macForm.get('mac_acl_profile_name').setValue('');
      this.macForm.get('new_mac').reset();
      this.macForm.get('fileBrowse').reset();
      const chkLen = this.elRef.nativeElement.querySelectorAll('.mac-check').length;
      for (let i = 0; i < chkLen; i++) {
        this.elRef.nativeElement.querySelectorAll('.mac-check')[i]['checked'] = false;
      }
      this.isAllMacProfileSelected = false;
      this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
    } else {
      if (!(this.isEditEnable)) {
        this.addProduct = true;
      } else {
        this.editMacAclProfile();
        this.EditChangeName();
      }

    }
    this.addProduct = true;
  }

  /* pagination method here*/
  getNext(page) {
    this.page = page;
    if (this.page == 1) {
      this.firstarrowStatus = true;
      this.lastarrowStatus = false;
    } else if (this.page == this.Math.ceil(this.Data.length / this.rowsOnPage)) {
      this.lastarrowStatus = true;
      this.firstarrowStatus = false;
    } else {
      this.firstarrowStatus = false;
      this.lastarrowStatus = false;
    }
  }

  goToPage(num) {
    this.getNext(num);
  }

  /* pagination method here end*/

}

interface MacList {
  IsSelect: boolean;
  MacId: string;
}

interface MacProfile {
  associated_ap: number;
  mac_acl_profile_id: string;
  mac_acl_profile_name: string;
  no_of_ssid: number;
  policy: string;
  trus_macs: string[];
}

interface MacListAll {
  IsSelect: boolean;
  Macacl: MacProfile;
}

interface EditMacList {
  add_trusted_mac: string[];
  delete_trusted_mac: string[];
}

interface DeleteList {
  mac_acl_profile_id: string[];
  mac_acl_profile_name: string[];
}

