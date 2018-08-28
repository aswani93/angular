import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Http } from '@angular/http';
import { WebserviceService } from '../../../../services/commonServices/webservice.service';
import { NotificationService, commonMessages } from '../../../../services/notificationService/NotificationService';
import { TooltipService } from '../../../../services/tooltip/tooltip.service';
import * as io from 'socket.io-client';
import { DataTable, SortEvent } from 'angular2-datatable';
import { ScrollHelper } from '../../../../helpers/scroll-helper/scrollHelper';
import * as _ from 'lodash';

@Component({
    selector: 'app-dhcp',
    templateUrl: './dhcp.component.html',
    styleUrls: ['./dhcp.component.css']
})
export class DhcpComponent implements OnInit {

    public interval_details;
    public DHCPForm: FormGroup;
    autoRefreshTable;
    private autoRefreshTime: Number = 50000;
    netmaskvalue;
    prefixvalue;
    btnDisable = true;
    IpvalidateStatus = false;
    subnetMaskStatus;
    clickactive;
    dhcptypeStatus;
    private scrollHelper: ScrollHelper = new ScrollHelper();
    dhcpRelayStatus;
    addDHCPStatus = false;
    addButtonDisable = true;
    saveButton = true;
    updateButton = false;
    public _sortBy;
    startIP;
    endIP;
    selectedVlan;
    public _sortOrder;
    public data;
    public editData;
    public updateGetData;
    @ViewChild('mf') private dhcptable: DataTable;
    invalid = [];
    public selectedVlanArray = [];
    public groupdetailArr = [];
    selectAllFlag;
    newJson;
    public rowsOnPage = 20;
    private showingfrom = 0;
    private showingto = 0;
    private pageModulus = 0;
    public currentPage;
    public dataLength;
    NetworkregIPVal = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    private pattern = /^[-a-zA-Z0-9-()]+([_@/#&+]+[-a-zA-Z0-9-()]+)*$/;
    private numberPattern = /^([0-9])*$/;
    subnetmaskPatern = /^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/;
    IPpattern = /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/;
    IPv6Pattern = /^^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/;

    /* pagination declaration variable*/
    page: number = 1;
    Math: any = Math;
    firstarrowStatus: boolean = true;
    lastarrowStatus: boolean = false;
    /*pagination declaration variable end */

    constructor(private elRef: ElementRef, public http: Http, private _service: WebserviceService,
        private notifyPopup: NotificationService) { }
    ngOnInit() {

        this.notifyPopup.confirmationOk().subscribe((page) => {
            if (page == 'DHCP') {
                this.deleteDHCP();
            }
        });
        this.notifyPopup.showing().subscribe((page) => {
            if (page == 'DHCP') {
                this.showSSIDnames();
            }
        });
        // this.netmaskCalculator('31');
        window.scrollTo(0, 0);
        this.DHCPForm = new FormGroup({
            'profile_name': new FormControl('', [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(32),
                Validators.pattern(this.pattern)

            ]),
            // 'netmask': new FormControl('', [
            //     Validators.required,
            //     Validators.pattern(this.pattern),
            //     this.prefixrange

            // ]),
            'vlan_id': new FormControl('', [
                Validators.required,
                Validators.pattern(this.numberPattern),
                this.vlanValidation

            ]),
            // 'DHCPnetmask': new FormControl('', [
            //     Validators.required,
            // ]),
            // 'subnetmask': new FormControl('', [
            //     // Validators.required,
            //     Validators.pattern(this.subnetmaskPatern)

            // ]),
            // 'ipv4_addr': new FormControl('', [
            //     Validators.required,
            //     Validators.pattern(this.NetworkregIPVal),
            // ]),
            'ip_type': new FormControl('1'),
            'dhcp_type': new FormControl('0'),
            'remote_server': new FormControl(),
            // 'dns_server1': new FormControl(),
            // 'dns_server2': new FormControl(),
            // 'wins_server': new FormControl(),
            // 'gateway': new FormControl(),
            // 'end_ip': new FormControl(),
            // 'start_ip': new FormControl(),
            // 'lease_time': new FormControl(),

        });
        this.loadData();


    }

    deleteData() {
        this.groupdetailArr = [];
        if (this.selectedVlanArray.length > 0) {

            this.notifyPopup.info(commonMessages.confirm_delete_DHCP);
        } else {
            this.notifyPopup.error(commonMessages.selectoneDHCP);
        }

    }

    loadData() {
        this.selectedVlanArray = [];
        //  this.notifyPopup.showLoader('Please wait..');
        this._service.getWeb('configurations/dhcp-configurations/', '', '').then(_result => {

            if (_result) {

                this.data = _result['result'];
                //    console.log(JSON.stringify(this.data))
                this.notifyPopup.hideLoader('');
                this.DHCPForm.get('vlan_id').enable();

                // this.interval_details = setTimeout(() => {
                //     this.loadData();
                // }, 50000);
                this.autoRefreshTable = setInterval(() => this.fetchDataFromServer(), this.autoRefreshTime);
            }
        }).catch((error) => {
            // this.notifyPopup.logoutpop("Error");
        });
    }
    public prefixrange(control: FormControl) {
        let isWhitespace = control.value < 31 && control.value > 0;
        let isValid = isWhitespace;
        return isValid ? null : { 'prefixrange': true }
    }
    public vlanValidation(control: FormControl) {
        let inValidVLAN = control.value < 4095 && control.value > 1;
        let isValid = inValidVLAN;
        return isValid ? null : { 'invalidRange': true }
    }
    public leaseTime(control: FormControl) {
        let inValidVLAN = control.value > 43200 && control.value < 5;
        let isValid = !inValidVLAN;
        return isValid ? null : { 'invalidLease': true }
    }

    fetchDataFromServer() {
        this._service.getWeb('configurations/dhcp-configurations/', '', '').then(_result => {

            if (_result) {

                this.data = _result['result'];
                this.notifyPopup.hideLoader('');

            }
        }).catch((error) => {
            this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        });
    }
    public validateIPaddress(control: FormControl) {
        let value = control.value;
        let IpvalidateStatus;
        var result = value.split(".");
        if (result[0].length < 3) {
            //  this.btnDisable = true;
            IpvalidateStatus = true;
        } else if (result[0] == "225" || result[0] == "224" || result[0] == "127" || result[1] == '0') {
            // this.btnDisable = true;
            IpvalidateStatus = true;
        } else if (result[0] == "192" && result[1] == "168") {
            //  this.btnDisable = false;
            IpvalidateStatus = false;
        }
        return IpvalidateStatus ? null : { 'validateIP': true }
    }


    ngOnDestroy() {
        if (this.notifyPopup) {
            this.notifyPopup.hideLoader('');
        }
        clearInterval(this.autoRefreshTable);
    }


    updateDHCP() {
        this.newJson = this.DHCPForm.value;
        this.newJson['ip_type'] = "1";
        if (this.newJson.dhcp_type == '2') {
            this.newJson['remote_server'] = this.DHCPForm.get('remote_server').value;
        } else {
            delete this.newJson['remote_server'];
        }
        //  this.newJson['profile_name']=this.DHCPForm.get('profile_name').value;
        this.newJson['vlan_id'] = this.DHCPForm.get('vlan_id').value;
        this.notifyPopup.showLoader(commonMessages.save_systemConfig);
        this._service.putJson('configurations/dhcp-configurations/', this.newJson).then(_result => {

            if (_result.status == 1) {

                this.notifyPopup.hideLoader('');
                this.notifyPopup.success("Settings applied successfully");
                setTimeout(() => {
                    this.loadData();
                    this.reset();
                }, 2000);
                this.addButtonDisable = true;
            } else {
                this.notifyPopup.hideLoader('');
                this.notifyPopup.error(commonMessages.serverError);
                this.addButtonDisable = true;

                setTimeout(() => {
                    this.loadData();
                    this.reset();
                }, 2000);

            }
        }).catch((error) => {
            this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        });
    }

    onSubmit() {


        this.newJson = this.DHCPForm.value;
        this.newJson['ip_type'] = "1";
        if (this.newJson.dhcp_type == '2') {
            this.newJson['remote_server'] = this.DHCPForm.get('remote_server').value;
        } else {
            delete this.newJson['remote_server'];
        }
        this.notifyPopup.showLoader(commonMessages.save_systemConfig);
        this._service.postJson('configurations/dhcp-configurations/', this.newJson).then(_result => {

            if (_result.status == 1) {

                this.notifyPopup.hideLoader('');
                this.notifyPopup.success("Settings applied successfully");
                setTimeout(() => {
                    this.loadData();
                    this.reset();
                }, 3000);



            } else {



                this.notifyPopup.hideLoader('');
                this.btnDisable = true;
                this.notifyPopup.error(_result.msg);

                setTimeout(() => {
                    this.loadData();
                    this.reset();

                }, 3000);


            }
        }).catch((error) => {
            this.notifyPopup.logoutpop(commonMessages.InternalserverError);
        });
    }

    checkboxClick(e, dhcp) {
        e.stopPropagation();
        // this.formReset();
        if (e.target.checked) {
            this.selectedVlanArray.push(JSON.stringify(dhcp.vlan_id));
            if (this.selectedVlanArray.length == 1) {

                this.selectedVlan = JSON.stringify(dhcp.vlan_id);
            } else {
                this.selectedVlan = null;
            }
            // this.isChecked = true;
        } else {
            this.selectedVlan = null;
            let currentVlan = this.selectedVlanArray.find(function (arr) {
                return arr == JSON.stringify(dhcp.vlan_id);
            });

            let idx = this.selectedVlanArray.indexOf(currentVlan);
            this.selectedVlanArray.splice(idx, 1);
            if (this.selectedVlanArray.length == 1) {
                this.selectedVlan = this.selectedVlanArray[0];
            } else {
                this.selectedVlan = null;
                if (this.selectedVlanArray.length < 1) {
                    //  this.selectAllFlag = false;
                    this.selectedVlanArray = [];
                    this.selectedVlan = false;
                }
            }

        }
    }

    double_click_event(event, dhcpValue, index) {
        // this.reset();
        this.selectedVlanArray = [];
        this.clickactive = -1;
        //this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
        var chkLen = this.elRef.nativeElement.querySelectorAll('.ssid-check').length;
        for (var i = 0; i < chkLen; i++) {
            this.elRef.nativeElement.querySelectorAll('.ssid-check')[i]['checked'] = false;
        }
        this.selectedVlanArray.push(dhcpValue);
        if (this.selectedVlanArray.length == 1) {
            this.selectedVlan = dhcpValue;
            this.clickactive = index;
            this.elRef.nativeElement.querySelectorAll('.ssid-check')[index]['checked'] = true;

        } else {
            this.selectedVlanArray = [];
        }
        this.editDHCP();
    }

    deleteDHCP() {
        if (this.selectedVlanArray.includes("1")) {
            this.notifyPopup.error(commonMessages.default_vlan_error)
            this.selectAllFlag = false;
            if (this.selectedVlanArray.length == 1) {
                this.selectedVlanArray = [];
            }
            this.elRef.nativeElement.querySelector('#selectAllCheck')['checked'] = false;
            // this.unchekAll();
        } else {
            this.notifyPopup.showLoader(commonMessages.save_systemConfig);

            this._service.deleteWeb('configurations/dhcp-configurations/?vlan_id=' + this.selectedVlanArray, '').then(_result => {
                if (_result.status == '1') {
                    this.groupdetailArr = [];
                    if (this.selectedVlanArray.length != _result.random_id.length) {

                        for (let vaps of _result.affected_ssid) {
                            let groupArr = [];
                            for (let i of vaps.ssid_list) {

                                let str = { 'ssidname': i };
                                groupArr.push(str);
                            }

                            let str = { 'Profile_name': vaps.profile_name, 'ssidnames': groupArr };
                            this.groupdetailArr.push({ 'Profile_name': vaps.profile_name, 'ssidnames': groupArr });

                        }
                        this.notifyPopup.hideLoader('');
                        this.notifyPopup.error_details(commonMessages.valn_ssid_error);
                        return false;
                    } else {
                        this.notifyPopup.hideLoader('');
                        this.notifyPopup.success(commonMessages.vlan_delete_success);
                        setTimeout(() => {
                            this.reset();
                            this.loadData();

                        }, 2500);
                    }




                    // this.notifyPopup.hideLoader('');
                    // this.notifyPopup.success("Settings deleted successfully");
                    // setTimeout(() => {
                    //     this.loadData();
                    //     this.reset();
                    // }, 2000);



                } else {

                    this.notifyPopup.hideLoader('');
                    this.btnDisable = true;
                    this.notifyPopup.error(_result.msg);

                    setTimeout(() => {
                        this.loadData();
                        this.reset();
                    }, 2000);

                }
            }).catch((error) => {
                // this.notifyPopup.logoutpop(commonMessages.InternalserverError);
            });

        }
    }

    showSSIDnames() {
        this.notifyPopup.details(this.groupdetailArr);
        return false;
    }
    selectAll(e) {
        this.selectedVlanArray = [];
        var count = Object.keys(this.data).length;
        if (e.target.checked) {
            this.selectAllFlag = true;


            for (var i = 0; i < count; i++) {
                this.selectedVlanArray.push(this.data[i].vlan_id);
            }

            // this.elRef.nativeElement.querySelector('#movebutton').classList.remove('disabled');
            // if (count == 0) {
            //   this.elRef.nativeElement.querySelector('#movebutton').classList.add('disabled');
            // }
        } else {
            this.unchekAll();
            this.selectAllFlag = false;
            this.selectedVlanArray = [];
        }
    }

    unchekAll() {
        var chkLen = this.elRef.nativeElement.querySelectorAll('.ssid-check').length;
        this.selectAllFlag = false;
        this.selectedVlanArray = [];
        for (var i = 0; i < chkLen; i++) {
            this.elRef.nativeElement.querySelectorAll('.ssid-check')[i]['checked'] = false;
        }
    }

    editDHCP() {
        this.btnDisable = true;
        if (Object.keys(this.selectedVlanArray).length == 1) {
            this.saveButton = false;
            // this.DHCPForm.get('dhcp_type').setValue('1');
            this.addButtonDisable = false;
            this.notifyPopup.showLoader('Please wait...')
            this._service.getWeb('configurations/dhcp-configurations/' + this.selectedVlan + '/', '', '').then(_result => {
                this.editData = _result['result'];
                this.updateGetData= _result['result'];;
                this.addDHCPStatus = true;
                this.updateButton = true;
                // this.DHCPForm.get('profile_name').setValue(this.editData.profile_name);
                // this.DHCPForm.get('vlan_id').setValue(this.editData.vlan_id);
                // this.DHCPForm.get('dhcp_type').setValue(this.editData.dhcp_type);
                // this.DHCPForm.get('vlan_id').disable();
                this.DHCPForm.setValue(this.updateGetData);
                this.checkAnyUpdate();
                this.scrollHelper.scrollToFirst("detailArea");
                this.dhcpRelayStatus = false;
                this.selectedVlanArray = [];
                if (this.updateGetData.dhcp_type == '2') {
                    this.DHCPForm.get('remote_server').setValue(this.updateGetData.remote_server);
                    this.dhcpRelayStatus = true;
                    this.selectedVlanArray = [];
                }

                this.notifyPopup.hideLoader('');
            });
        } else {
            this.notifyPopup.error("Select one DHCP to edit");
            return false;
        }
    }


    validateIP(event) {
        this.btnDisable = true;
        this.IpvalidateStatus = false;
        var value = event.target.value;
        var result = value.split(".");

        if (result[0] == "0" || result[0] == "4" || result[0] == "8" || result[0] == "127" || result[1] == "0" || result[0] == "255" || result[0] == "00" || result[0] == "000") {
            this.btnDisable = true;
            this.IpvalidateStatus = true;
        } else {
            this.btnDisable = false;
            this.IpvalidateStatus = false;
            this.checkAnyUpdate();
        }


    }


    ngAfterViewInit() {

        this.scrollHelper.doScroll();
        this.dhcptable.onSortChange.subscribe((event: SortEvent) => {
            this._sortBy = event.sortBy;
            this._sortOrder = event.sortOrder;
        });
        // this.DHCPForm.get('netmask').valueChanges.subscribe(() => {

        //     this.netmaskValidation();

        // });
        this.DHCPForm.get('profile_name').valueChanges.subscribe(() => {

            this.checkAnyUpdate();
        });
        this.DHCPForm.valueChanges.subscribe(() => {
            this.checkAnyUpdate();
        });
        


        this.dhcptable.onPageChange.subscribe((x) => {

            this.currentPage = x.activePage;
            this.dataLength = x.dataLength;
            this.pageModulus = this.dataLength % x.rowsOnPage;
            if (x.rowsOnPage * this.currentPage > x.dataLength) {
                this.showingto = (x.rowsOnPage * (this.currentPage - 1)) + this.pageModulus;
                this.showingfrom = (this.showingto - this.pageModulus) + 1;
            } else {
                this.showingto = x.rowsOnPage * this.currentPage;
                this.showingfrom = (this.showingto - x.rowsOnPage) + 1;
            }


        });

    }


    checkAnyUpdate() {

        let jsonArry = this.DHCPForm.value;
        jsonArry['vlan_id'] = this.DHCPForm.get('vlan_id').value;

        jsonArry['ip_type'] = "1";
        if (this.DHCPForm.get('remote_server').value == null) {
            jsonArry['remote_server'] = '';
        }
        if (_.isEqual(this.editData, jsonArry)) {
            this.btnDisable = true;
        } else {
            this.btnDisable = false;
        }
        if (this.updateButton) {
            this.DHCPForm.get('vlan_id').disable();
        } else {
            this.DHCPForm.get('vlan_id').enable();
        }
        this.scrollHelper.scrollToFirst('detailArea');
    }
    callAddEdit() {
        this.addDHCPStatus = true;
        this.scrollHelper.scrollToFirst("detailArea");
        this.saveButton = true;
        this.updateButton = false;
    }

    reset() {
        this.DHCPForm.reset();
        this.IpvalidateStatus = false;
        // this.btnDisable = true;
        this.dhcpRelayStatus = false;
        this.addDHCPStatus = false;
        this.btnDisable = true;
        this.saveButton = true;
        this.DHCPForm.get('dhcp_type').setValue('1');
        this.DHCPForm.get('dhcp_type').setValue('0')
        window.scrollTo(0, 0);
        this.addButtonDisable = true;
        this.loadData();
    }


    getIpRangeFromAddressAndNetmask(str) {
        //   console.log("iprange " + str);
        var part = str.split("/"); // part[0] = base address, part[1] = netmask
        var ipaddress = part[0].split('.');
        var netmaskblocks = ["0", "0", "0", "0"];
        var netmask;
        if (!/\d+\.\d+\.\d+\.\d+/.test(part[1])) {
            // part[1] has to be between 0 and 32
            netmaskblocks = ("1".repeat(parseInt(part[1], 10)) + "0".repeat(32 - parseInt(part[1], 10))).match(/.{1,8}/g);
            netmask = netmaskblocks.map(function (el) { return parseInt(el, 2); });
        } else {
            // xxx.xxx.xxx.xxx
            netmask = part[1].split('.').map(function (el) { return parseInt(el, 10) });
        }
        var invertedNetmaskblocks = netmask.map(function (el) { return el ^ 255; });
        var baseAddress = ipaddress.map(function (block, idx) { return block & netmask[idx]; });
        var broadcastaddress = ipaddress.map(function (block, idx) { return block | invertedNetmaskblocks[idx]; });
        return [baseAddress.join('.'), broadcastaddress.join('.')];
    }
    changeDHCPtype(event) {
        //     this.dhcptypeStatus = (event.target.value == "enable" ? true : false);
        if (event.target.value == "1") {

            this.DHCPForm.get('dns_server1').setValidators([Validators.required, Validators.pattern(this.IPpattern)]);
            this.DHCPForm.get('dns_server2').setValidators([Validators.required, Validators.pattern(this.IPpattern)]);
            this.DHCPForm.get('wins_server').setValidators([Validators.required, Validators.pattern(this.IPpattern)]);
            this.DHCPForm.get('gateway').setValidators([Validators.required, Validators.pattern(this.IPpattern)]);
            this.DHCPForm.get('end_ip').setValidators([Validators.required, Validators.pattern(this.IPpattern)]);
            this.DHCPForm.get('start_ip').setValidators([Validators.required, Validators.pattern(this.IPpattern)]);
            this.DHCPForm.get('lease_time').setValidators([Validators.required, Validators.pattern(this.IPpattern), this.leaseTime]);
            this.dhcptypeStatus = true;
            let value = this.getIpRangeFromAddressAndNetmask(this.DHCPForm.get('ipv4_addr').value + "/" + this.DHCPForm.get('netmask').value)
            this.startIP = value[0].split(',');
            this.endIP = value[1].split(',');
            // this.DHCPForm.get('start_ip').setValue("" + this.startIP);
            // this.DHCPForm.get('end_ip').setValue("" + value[1].split(','));


        } else if (event.target.value == "2") {
            this.dhcpRelayStatus = true;
            this.dhcptypeStatus = false;
            this.DHCPForm.get('remote_server').setValidators([Validators.required, Validators.pattern(this.IPpattern)]);
            // this.DHCPForm.get('dns_server1').clearValidators();
            // this.DHCPForm.get('dns_server1').setValue(null);
            // this.DHCPForm.get('dns_server2').clearValidators();
            // this.DHCPForm.get('dns_server2').setValue(null);
            // this.DHCPForm.get('wins_server').clearValidators();
            // this.DHCPForm.get('wins_server').setValue(null);
            // this.DHCPForm.get('gateway').clearValidators();
            // this.DHCPForm.get('gateway').setValue(null);
            // this.DHCPForm.get('end_ip').clearValidators();
            // this.DHCPForm.get('end_ip').setValue(null);
            // this.DHCPForm.get('start_ip').clearValidators();
            // this.DHCPForm.get('start_ip').setValue(null);
            // this.DHCPForm.get('lease_time').clearValidators();
            // this.DHCPForm.get('lease_time').setValue(null);
        } else {
            this.dhcpRelayStatus = false;
            this.dhcptypeStatus = false;
            this.DHCPForm.get('remote_server').clearValidators();
            if (this.updateGetData.remote_server == '') {
                this.DHCPForm.get('remote_server').setValue(null);
            } else {
                this.DHCPForm.get('remote_server').setValue(this.updateGetData.remote_server);
            }
            // this.DHCPForm.get('dns_server1').clearValidators();
            // this.DHCPForm.get('dns_server1').setValue(null);
            // this.DHCPForm.get('dns_server2').clearValidators();
            // this.DHCPForm.get('dns_server2').setValue(null);
            // this.DHCPForm.get('wins_server').clearValidators();
            // this.DHCPForm.get('wins_server').setValue(null);
            // this.DHCPForm.get('gateway').clearValidators();
            // this.DHCPForm.get('gateway').setValue(null);
            // this.DHCPForm.get('end_ip').clearValidators();
            // this.DHCPForm.get('end_ip').setValue(null);
            // this.DHCPForm.get('start_ip').clearValidators();
            // this.DHCPForm.get('start_ip').setValue(null);
            // this.DHCPForm.get('lease_time').clearValidators();
            // this.DHCPForm.get('lease_time').setValue(null);
        }

    }
    netmaskValidation() {
        var prefixvalue = this.DHCPForm.get('netmask').value;
        var prefixVal = "" + prefixvalue;
        switch (prefixVal) {
            case "0":
                return this.DHCPForm.patchValue({ subnetmask: "0.0.0.0" });
            case "1":
                return this.DHCPForm.patchValue({ subnetmask: "128.0.0.0" });
            case "2":
                return this.DHCPForm.patchValue({ subnetmask: "192.0.0.0" });
            case "3":
                return this.DHCPForm.patchValue({ subnetmask: "224.0.0.0" });
            case "4":
                return this.DHCPForm.patchValue({ subnetmask: "240.0.0.0" });
            case "5":
                return this.DHCPForm.patchValue({ subnetmask: "248.0.0.0" });
            case "6":
                return this.DHCPForm.patchValue({ subnetmask: "252.0.0.0" });
            case "7":
                return this.DHCPForm.patchValue({ subnetmask: "254.0.0.0" });
            case "8":
                return this.DHCPForm.patchValue({ subnetmask: "255.0.0.0" });
            case "9":
                return this.DHCPForm.patchValue({ subnetmask: "255.128.0.0" });
            case "10":
                return this.DHCPForm.patchValue({ subnetmask: "255.192.0.0" });
            case "11":
                return this.DHCPForm.patchValue({ subnetmask: "255.224.0.0" });
            case "12":
                return this.DHCPForm.patchValue({ subnetmask: "255.240.0.0" });
            case "13":
                return this.DHCPForm.patchValue({ subnetmask: "255.248.0.0" });
            case "14":
                return this.DHCPForm.patchValue({ subnetmask: "255.252.0.0" });
            case "15":
                return this.DHCPForm.patchValue({ subnetmask: "255.254.0.0" });
            case "16":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.0.0" });
            case "17":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.128.0" });
            case "18":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.192.0" });
            case "19":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.224.0" });
            case "20":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.240.0" });
            case "21":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.248.0" });
            case "22":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.252.0" });
            case "23":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.254.0" });
            case "24":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.255.0" });
            case "25":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.255.128" });
            case "26":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.255.192" });
            case "27":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.255.224" });
            case "28":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.255.240" });
            case "29":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.255.248" });
            case "30":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.255.252" });
            case "31":
                return this.DHCPForm.patchValue({ subnetmask: "255.255.255.254 " });
            case "":
                return this.DHCPForm.patchValue({ subnetmask: "" });

        }
    }

    prefixvalidation() {
        var netmaskValue = this.DHCPForm.get('subnetmask').value;
        //console.log(this.DHCPForm.valid +" tsts "+this.DHCPForm.dirty+" yfy "+this.DHCPForm.touched)
        if (this.subnetmaskPatern.test(netmaskValue)) {
            //      console.log("Valid value")
            this.subnetMaskStatus = false;
        } else {
            //      console.log("Invalid value");
            this.subnetMaskStatus = true;
        }
        var NetmaskVal = "" + netmaskValue;
        switch (NetmaskVal) {
            case "0.0.0.0":
                return this.DHCPForm.patchValue({ netmask: "0" });
            case "128.0.0.0":
                return this.DHCPForm.patchValue({ netmask: "1" });
            case "192.0.0.0":
                return this.DHCPForm.patchValue({ netmask: "2" });
            case "224.0.0.0":
                return this.DHCPForm.patchValue({ netmask: "3" });
            case "240.0.0.0":
                return this.DHCPForm.patchValue({ netmask: "4" });
            case "248.0.0.0":
                return this.DHCPForm.patchValue({ netmask: "5" });
            case "252.0.0.0":
                return this.DHCPForm.patchValue({ netmask: "6" });
            case "254.0.0.0":
                return this.DHCPForm.patchValue({ netmask: "7" });
            case "255.0.0.0":
                return this.DHCPForm.patchValue({ netmask: "8" });
            case "255.128.0.0":
                return this.DHCPForm.patchValue({ netmask: "9" });
            case "255.192.0.0":
                return this.DHCPForm.patchValue({ netmask: "10" });
            case "255.224.0.0":
                return this.DHCPForm.patchValue({ netmask: "11" });
            case "255.240.0.0":
                return this.DHCPForm.patchValue({ netmask: "12" });
            case "255.248.0.0":
                return this.DHCPForm.patchValue({ netmask: "13" });
            case "255.252.0.0":
                return this.DHCPForm.patchValue({ netmask: "14" });
            case "255.254.0.0":
                return this.DHCPForm.patchValue({ netmask: "15" });
            case "255.255.0.0":
                return this.DHCPForm.patchValue({ netmask: "16" });
            case "255.255.128.0":
                return this.DHCPForm.patchValue({ netmask: "17" });
            case "255.255.192.0":
                return this.DHCPForm.patchValue({ netmask: "18" });
            case "255.255.224.0":
                return this.DHCPForm.patchValue({ netmask: "19" });
            case "255.255.240.0":
                return this.DHCPForm.patchValue({ netmask: "20" });
            case "255.255.248.0":
                return this.DHCPForm.patchValue({ netmask: "21" });
            case "255.255.252.0":
                return this.DHCPForm.patchValue({ netmask: "22" });
            case "255.255.254.0":
                return this.DHCPForm.patchValue({ netmask: "23" });
            case "255.255.255.0":
                return this.DHCPForm.patchValue({ netmask: "24" });
            case "255.255.255.128":
                return this.DHCPForm.patchValue({ netmask: "25" });
            case "255.255.255.192":
                return this.DHCPForm.patchValue({ netmask: "26" });
            case "255.255.255.224":
                return this.DHCPForm.patchValue({ netmask: "27" });
            case "255.255.255.240":
                return this.DHCPForm.patchValue({ netmask: "28" });
            case "255.255.255.248":
                return this.DHCPForm.patchValue({ netmask: "29" });
            case "255.255.255.252":
                return this.DHCPForm.patchValue({ netmask: "30" });
            case "255.255.255.254":
                return this.DHCPForm.patchValue({ netmask: "31" });
            case "255.255.255.255":
                return this.DHCPForm.patchValue({ netmask: "" });

        }
    }
    /* pagination method here*/
    getNext(page) {
        this.page = page;
        if (this.page == 1) {
            this.firstarrowStatus = true;
            this.lastarrowStatus = false;
        } else if (this.page == this.Math.ceil(this.data.length / this.rowsOnPage)) {
            this.lastarrowStatus = true;
            this.firstarrowStatus = false;
        }
        else {
            this.firstarrowStatus = false;
            this.lastarrowStatus = false;
        }
    }
    goToPage(num) {
        this.getNext(num);
    }
    /* pagination method here end*/


}
