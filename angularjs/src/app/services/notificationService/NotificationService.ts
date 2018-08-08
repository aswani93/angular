import {Injectable} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';
import {Alert, AlertType} from '../../model/alertModel';

export class commonMessages { 
  static offlineAutoRFUpdateError = 'The selected AP/APs are offline';
  static autoRFShowData = 'Loading all APs...';
  static updatingAutoRFConfiguration = 'Updating AutoRF setting...';
  static autoRFUpdate = 'Auto RF configuration settings updated'; 
  static registerShowData = 'Loading all registered APs...';
  static unregisterShowData = 'Loading all unregistered APs...';
  static groupShowData = 'Loading group configurations...';
  static SSIDShowData = 'Loading SSID configurations...';
  static confirm_delete_register = 'Are you sure to unregister this APs?';
  static confirm_delete_group = 'Are you sure to delete this Group?';
  static confirm_delete_SSID = 'Are you sure to delete this SSID?';
  static confirm_delete_DHCP = 'Are you sure to delete this DHCP profile?';
  static confirm_delete_AAA = 'Are you sure to delete this AAA Server?';
  
  static delete_AP = 'Unregistering APs';

  static delete_group = 'Deleting group...';
  static delete_SSID = 'Deleting SSID...';
  static delete_AAA = 'Deleting AAA...';
  static delete_knownAP = 'Deleting AP form knownAP list...';
  static registerAP = 'Registering your AP...';
  static addGroup = 'Please wait , Creating the group....';
  static updateGroup = 'Please wait , Updating the group....';
  static updateSSID = 'Please wait , Updating the SSID....';
  static aaaSSID = 'Please wait , Updating the SSID....';
  static addSSID = 'Please wait , Creating the SSID....';
  static addAAA = 'Please wait , Creating the AAA Server....';
  static save_systemConfig = 'Please wait, Updating the changes...';
  static ems_snmp_load_data = 'Please wait, loading data...';
  static ems_snmp_save_data = 'Please wait, Updating the changes...';
  static maintenance_AP_upload = 'Data uploading now...';
  static maintenance_AP_upgrade = 'Data upgrading now...';
  static maintenance_system_update = 'Updating data , Please wait...';
  static maintenance_system_restore = 'Restoring data , Please wait...';
  static imgUpgrade = 'Please select both AP Model and Group Name.';
  static apModelSelectionError = 'Please select AP Model';
  static groupSelectionError = 'Please select Group Name';
  static upgrade_type = 'Please select upgrade Type';
  static firmwareSelect = 'Please select firmware';
  static save_image_upgrade = 'Data is upgrading now...';
  static serverError = 'Something went wrong,Please try again...';
  static upgrade_msg = 'Are you sure you want to Upgrade this AP image?';
  static upload_msg = 'Are you sure you want to Upload this AP image?';
  static upgrade_with_upload = 'Firmware uploaded sucessfully, Initiated the AP upgrade process';
  static upload_only = 'Firmware uploaded sucessfully';
  static regiter_delete_success = 'Selected AP deleted';
  static useraccount_delete='Selected User account deleted';
  static AP_delete_success = 'Selected AP deleted from knownAP list';
  static AP_register = 'AP registered sucessfully';
  static selectonessid = 'Please select One SSID for delete';
  static selectoneDHCP = 'Please select One DHCP profile for delete';
  static selectoneaaa = 'Please atleast select One AAA server to delete';
  static nodatainaaa = 'No data available';
  static failure_wcm = 'Failure response from WCM';
  static wcm_not_responding = 'WCM not responding';
  static ssid_delete_success = 'Selected ssids deleted';
  static aaa_delete_success = 'Selected AAA deleted';
  static aaa_ssid_error = 'AAAs assigned to SSIDs cant be deleted';
  static rougeAP_reboot_success = 'APs rebooted successfully';
  static rougeAP_reboot_initiated = 'APs reboot initiated';
  static vlan_delete_success = 'Selected vlan deleted';
  static default_ssid_error = 'Default SSID should not be deleted';
  static default_aaa_error = 'Default AAA should not be deleted';
  static default_vlan_error = 'Default DHCP profile should not be deleted';
  static mapped_ssid_error = 'SSIDs assigned to Groups which have no other SSIDs cant be deleted';
  static valn_ssid_error = 'VLAN assigned to SSID which have no other VLAN cant be deleted';
  static default_group_error = 'Default group should not be deleted';
  static selectonegroup = 'Please select one group for delete';
  static selectonegroup_edit = 'Please select one group for edit';
  static selectonessid_edit = 'Please select one SSID for edit';
  static selectoneaaa_edit = 'Please select one AAA Server for edit';
  static selectonessid_group = 'Minimum one ssid required to create a group';
  static AP_update_msg = 'Your data updated successfully';
  static AP_error_update_msg = 'Something went wrong,Please try again...';
  static AP_updating_msg = 'Please wait , Updating the AP....';
  static AP_edit_select = 'Please select One AP for Edit';
  static radioChannels_text = 'Please select all radio channels';
  static ssid_name_exists = 'SSID name already exists';
  static aaa_name_exists = 'AAA name already exists';
  static aaa_ip_exists = 'AAA server with IP already exists';
  static ssid_save_success = 'SSID saved sucessfully';
  static aaa_save_success = 'AAA Server saved sucessfully';
  static ssid_update_success = 'SSID update sucessfully';
  static useraccount_update_success = 'UserAccount update sucessfully';
  static aaa_update_success = 'AAA server updated sucessfully';
  static max_ssid_error = 'Maximum allowed SSIDs for a group is 16 !';
  static group_name_exists = 'Group Name Already Exists';
  static min_ssid_group_error = 'Minimum one SSID map required';
  static grp_save_success = 'Group saved sucessfully';
  static grp_update_success = 'Group update sucessfully';
  static grp_delete_success = 'Selected group deleted';
  static selectonessid_grp = 'Please select one SSID';
  static selectoneRougeAP_Reboot = 'Please select one AP to reboot';
  static unable_delete_allssid = 'Unable to delete all ssid';
  static not_disable_all = 'Atleast one radio should be enabled';
  static InternalserverError = 'Internal server error, Please try again later...';
  static ssid_failed = 'Failed to create ssid';
  static ssid_failed_update = 'Failed to update ssid';
  static ssid_failed_delete = 'Failed to delete the selected ssid';
  static aaa_failed_delete = 'Failed to delete the selected aaa';
  static rougeAp_failed_Reboot = 'Failed to reboot the APs';
  static grp_save_failed = 'Failed to create group';
  static grp_update_failure = 'Failed to update group';
  static edit_reg_page = 'Loading data...';
  
};


@Injectable()
export class NotificationService {
  private subject = new Subject<Alert>();
  private message = new Subject<any>();
  private message_showdeltails = new Subject<any>();
  private message_removedeltails = new Subject<any>();

  private keepAfterRouteChange = false;

  constructor(private router: Router) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // only keep for a single route change
          this.keepAfterRouteChange = false;
        } else {
          // clear alert messages
          this.clear();
        }
      }
    });
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success_details(message: string, keepAfterRouteChange = false){
    this.alert(AlertType.Success_details, message, keepAfterRouteChange);
  }

  success(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Success, message, keepAfterRouteChange);
  }

  error(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Error, message, keepAfterRouteChange);
  }

  error_details(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Error_details, message, keepAfterRouteChange);
  }

  details(message: any, keepAfterRouteChange = false) {
    this.alert(AlertType.details, message, keepAfterRouteChange);
  }

  autorf_success_details(message: any, keepAfterRouteChange = false){
    this.alert(AlertType.autorf_success_details, message, keepAfterRouteChange);
  }

  logoutpop(message: any, keepAfterRouteChange = false) {
    this.alert(AlertType.Logout, message, keepAfterRouteChange);
  }

  info(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Info, message, keepAfterRouteChange);
  }

  warn(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.Warning, message, keepAfterRouteChange);
  }

  showLoader(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.loader, message, keepAfterRouteChange);
  }

  hideLoader(message: string, keepAfterRouteChange = false) {
    this.alert(AlertType.loader, message, keepAfterRouteChange);
  }

  alert(type: AlertType, message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next(<Alert>{type: type, message: message});
  }


  confirmeddelete(ev) {

    var path = document.URL;
    var page = path.split('/');
    this.message.next(page[page.length - 1]);
  }

  showeddetails(ev) {    
    this.clear();
    var path = document.URL;
    var page = path.split('/');
    this.message_showdeltails.next(page[page.length - 1]);

  }

  removeddetails() {
    this.clear();
    var path = document.URL;
    var page = path.split('/');
    this.message_removedeltails.next(page[page.length - 1]);
  }

  confirmationOk(): Observable<any> {
    return this.message.asObservable();
  }

  showing(): Observable<any> {
    return this.message_showdeltails.asObservable();
  }

  removing(): Observable<any> {
    return this.message_removedeltails.asObservable();
  }

  logout() {
    sessionStorage.setItem('token', '');
    this.hideLoader('');
    this.router.navigate(['/login']);
    document.cookie = 'session_key=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }


  clear() {
    this.subject.next();
  }
}
