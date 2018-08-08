import {Injectable} from '@angular/core';

@Injectable()
export class TooltipService {

  system_basic_wlc_name = 'This is help text for the WLC NAME field';
  system_basic_time_zone = 'Time zone help';
  system_basic_date_time = 'data time help';
  system_basic_ntp_server_1 = 'NTP Server 1';
  system_basic_ntp_server_2 = 'NTP Server 2';


  system_ems_snmp_snmp_version = 'SNMP version';
  system_ems_snmp_read_community = 'Read community';
  system_ems_snmp_read_write_community = 'Read Write community';
  system_ems_snmp_port_number = 'SNMP port number';
  system_ems_snmp_username = 'SNMP Username';

  // system_ems_snmp_read_write_community = 'demo txt';
  system_ems_snmp_auth_algorithm = 'demo txt';
  system_ems_snmp_auth_authentication_password = 'Enter the authentication password';
  system_basic_trap_ip_server = 'IP server';
  system_basic_trap_port_number = 'Port Number';
  // system_basic_trap_ip_server = 'demo txt';


  group_configuration_add_group_group_name = 'Enter group Name';
  group_configuration_add_group_data_forwarding = 'Data Forwarding';
  group_configuration_add_group_country = 'Select the country';

  group_configuration_add_group_2_radio = '2Ghz Radio';
  group_configuration_add_group_2_wireless_mode = '2Ghz Wireless Mode';
  group_configuration_add_group_2_channel_width = '2Ghz width';
  group_configuration_add_group_primary_2_channel = 'Select the 2Ghz primary Channel';
  group_configuration_add_group_2_transmit_power = 'Choose the transmit power';
  group_configuration_add_group_2_rts_threshold = '(256 - 2347)';
  group_configuration_add_group_2_beacon_interval = '(100 - 300ms)';
  group_configuration_add_group_2_dtim_interval = '(1 - 255)';
  group_configuration_add_group_2_fragmentation_threshold = '(256 - 2346)';
  group_configuration_add_group_2_cts = 'CTS value';

  group_configuration_add_group_5_radio = '5Ghz Radio';
  group_configuration_add_group_5_wireless_mode = '2Ghz Wireless Mode';
  group_configuration_add_group_5_channel_width = '2Ghz width';
  group_configuration_add_group_primary_5_channel = 'Select the 5ghz primary Channel';
  group_configuration_add_group_5_transmit_power = 'Choose the transmit power';
  group_configuration_add_group_5_rts_threshold = '(256 - 2347)';
  group_configuration_add_group_5_beacon_interval = '(100 - 300ms)';
  group_configuration_add_group_5_dtim_interval = '(1 - 255)';
  group_configuration_add_group_5_fragmentation_threshold = '(256 - 2346)';
  group_configuration_add_group_5_cts = 'CTS value';

  group_ssid_configuration_add_ssid_l3_roaming = '';
  group_ssid_configuration_add_ssid_band_steering = '';
  group_ssid_configuration_add_ssid_vap = '';
  group_ssid_configuration_add_ssid_broadcast_ssid = '';
  group_ssid_configuration_add_ssid_network_auth = 'Select a network Auth type.';
  group_ssid_configuration_add_ssid_ssid_name = 'Select a SSID name with out Special Characters';
  group_ssid_configuration_add_ssid_passphrase = '(8-64 characters)';
  group_ssid_configuration_add_ssid_vlan = '(1 - 4094)';
  group_ssid_configuration_add_ssid_rssi_threshold = '(-10 to -100dBm)';
  

  group_ssid_configuration_aaa_pass = '(8-32 Characters)';

  group_ssid_configuration_add_ssid_wifi_multimedia = 'Wi-Fi Multimedia';
  group_ssid_configuration_add_ssid_wifi_multimedia_power = 'Wi-Fi Multimedia Power Save';

  group_macacl_configuration_add_mac_group_name = 'ACL Profile Name';
  group_macacl_configuration_add_mac_address_list = 'MAC Address List';
  group_macacl_configuration_add_mac_File_upload = 'File upload';
  group_macacl_configuration_add_mac_ACL_policy = 'ACL Policy';




  access_point_registered_ap_2ghz_channel = '2Ghz Channel';
  access_point_registered_ap_5ghz_channel = '5Ghz Channel';
  access_point_registered_ap_2ghz_transmit_power = 'bBm';
  access_point_registered_ap_5ghz_transmit_power = 'bBm';

  system_upgrade_upgrade_upload_from = 'Choose the source FTP or local';
  system_upgrade_upgrade_firmware_name = 'Enter firmware name';
  system_upgrade_upgrade_ftp_ipaddress = 'Enter IP Address';
  system_upgrade_upgrade_ftp_username = 'Enter FTP username';
  system_upgrade_upgrade_ftp_password = 'Enter your FTP password.';
  system_upgrade_upgrade_system_image_file_size = 'Max. File Size : 500MB';


  access_point_upgrade_upload_upload_from = 'Choose the source FTP or local';
  access_point_upgrade_upgrade_select_by = 'Select the appropriate AP or Group';
  access_point_upgrade_upgrade_group_name = 'Select group name';
  access_point_upgrade_upgrade_ap_model = '';
  access_point_upgrade_upload_ap_image_fle_size = 'Max. File Size : 50MB';
  access_point_upgrade_upload_firmware_name = 'hfci_apdv.indoor.tar.gz or hfci_apdv.outdoor.tar.gz';

  system_aaa_server_server_name = 'AAA server name(1-32 chars)';

  system_aaa_server_p_aaa_ip_type = 'Select IP version (IPV4 / IPV6)';
  system_aaa_server_p_aaa_ip = 'Server IP address';
  system_aaa_server_p_aaa_port = 'Server port number (1-65535)';
  system_aaa_server_p_aaa_passphrase = 'Passphrase (8-32 chars)';

  system_aaa_server_s_aaa_ip_type = 'Select IP version (IPV4 / IPV6)';
  system_aaa_server_s_aaa_ip = 'Server IP address';
  system_aaa_server_s_aaa_port = 'Server port number (1-65535)';
  system_aaa_server_s_aaa_passphrase = 'Passphrase (8-32 chars)';


  default = 'lorem ipsum dolor sit';


  top = 'top';
  bottom = 'bottom';
  left = 'left';
  right = 'right';

  constructor() {
  }

  fetchTooltip(text_id: string) {

    if (text_id === 'system_basic_wlc_name') {
      return this.system_basic_wlc_name;
    } else if (text_id === 'system_ems_snmp_snmp_version') {
      return this.system_ems_snmp_snmp_version;

      // add group page helper text.

    } else if (text_id === 'group_configuration_add_group_2_transmit_power') {
      return this.group_configuration_add_group_2_transmit_power;
    } else if (text_id === 'group_configuration_add_group_5_transmit_power') {
      return this.group_configuration_add_group_5_transmit_power;
    } else if (text_id === 'group_configuration_add_group_2_rts_threshold') {
      return this.group_configuration_add_group_2_rts_threshold;
    } else if (text_id === 'group_configuration_add_group_2_beacon_interval') {
      return this.group_configuration_add_group_2_beacon_interval;
    } else if (text_id === 'group_configuration_add_group_2_dtim_interval') {
      return this.group_configuration_add_group_2_dtim_interval;
    } else if (text_id === 'group_configuration_add_group_2_fragmentation_threshold') {
      return this.group_configuration_add_group_2_fragmentation_threshold;
    } else if (text_id === 'group_configuration_add_group_5_rts_threshold') {
      return this.group_configuration_add_group_2_rts_threshold;
    } else if (text_id === 'group_configuration_add_group_5_beacon_interval') {
      return this.group_configuration_add_group_2_beacon_interval;
    } else if (text_id === 'group_configuration_add_group_5_dtim_interval') {
      return this.group_configuration_add_group_2_dtim_interval;
    } else if (text_id === 'group_configuration_add_group_5_fragmentation_threshold') {
      return this.group_configuration_add_group_2_fragmentation_threshold;
    }

    // group ssid page.
    else if (text_id === 'group_ssid_configuration_add_ssid_network_auth') {
      return this.group_ssid_configuration_add_ssid_network_auth;
    } else if (text_id === 'group_ssid_configuration_add_ssid_ssid_name') {
      return this.group_ssid_configuration_add_ssid_ssid_name;
    } else if (text_id === 'group_ssid_configuration_add_ssid_vlan') {
      return this.group_ssid_configuration_add_ssid_vlan;
    } else if (text_id === 'group_ssid_configuration_add_ssid_passphrase') {
      return this.group_ssid_configuration_add_ssid_passphrase;
    } else if (text_id === 'group_configuration_add_group_2_dtim_interval') {
      return this.group_configuration_add_group_2_dtim_interval;
    } else if (text_id === 'group_ssid_configuration_add_ssid_rssi_threshold') {
      return this.group_ssid_configuration_add_ssid_rssi_threshold;
    }

    // register ap page..
    else if (text_id === 'access_point_registered_ap_2ghz_channel') {
      return this.access_point_registered_ap_2ghz_channel;
    } else if (text_id === 'access_point_registered_ap_2ghz_transmit_power') {
      return this.access_point_registered_ap_2ghz_transmit_power;
    } else if (text_id === 'access_point_registered_ap_5ghz_channel') {
      return this.access_point_registered_ap_5ghz_channel;
    } else if (text_id === 'access_point_upgrade_upload_firmware_name') {
      return this.access_point_upgrade_upload_firmware_name;
    }

    // AP i

    else if (text_id === 'system_upgrade_upgrade_system_image_file_size') {
      return this.system_upgrade_upgrade_system_image_file_size;
    } else if (text_id === 'system_upgrade_upgrade_upload_from') {
      return this.system_upgrade_upgrade_upload_from;
    } else if (text_id === 'system_upgrade_upgrade_firmware_name') {
      return this.system_upgrade_upgrade_firmware_name;
    }else if (text_id === 'system_upgrade_upgrade_ftp_ipaddress') {
      return this.system_upgrade_upgrade_ftp_ipaddress;
    } else if (text_id === 'system_upgrade_upgrade_ftp_username') {
      return this.system_upgrade_upgrade_ftp_username;
    } else if (text_id === 'system_upgrade_upgrade_ftp_password') {
      return this.system_upgrade_upgrade_ftp_password;
    }

    else if (text_id === 'access_point_upgrade_upload_ap_image_fle_size') {
      return this.access_point_upgrade_upload_ap_image_fle_size;
    } else if (text_id === 'access_point_upgrade_upload_upload_from') {
      return this.access_point_upgrade_upload_upload_from;
    }else if (text_id === 'access_point_upgrade_upgrade_group_name') {
      return this.access_point_upgrade_upgrade_group_name;
    } else if (text_id === 'access_point_upgrade_upgrade_ap_model') {
      return this.access_point_upgrade_upgrade_ap_model;
    } else if (text_id === 'access_point_upgrade_upgrade_ap_model') {
      return this.access_point_upgrade_upgrade_ap_model;
    }


    else if (text_id === 'system_aaa_server_server_name') {
      return this.system_aaa_server_server_name;
    } else if (text_id === 'system_aaa_server_p_aaa_ip_type') {
      return this.system_aaa_server_p_aaa_ip_type;
    }else if (text_id === 'system_aaa_server_p_aaa_ip') {
      return this.system_aaa_server_p_aaa_ip;
    } else if (text_id === 'system_aaa_server_p_aaa_port') {
      return this.system_aaa_server_p_aaa_port;
    } else if (text_id === 'system_aaa_server_p_aaa_passphrase') {
      return this.system_aaa_server_p_aaa_passphrase;
    } else if (text_id === 'system_aaa_server_s_aaa_ip_type') {
      return this.system_aaa_server_s_aaa_ip_type;
    } else if (text_id === 'system_aaa_server_s_aaa_ip') {
      return this.system_aaa_server_s_aaa_ip;
    } else if (text_id === 'system_aaa_server_s_aaa_port') {
      return this.system_aaa_server_s_aaa_port;
    } else if (text_id === 'system_aaa_server_s_aaa_passphrase') {
      return this.system_aaa_server_s_aaa_passphrase;
    } else if (text_id === 'group_macacl_configuration_add_mac_group_name') {
      return this.group_macacl_configuration_add_mac_group_name;
    } else if (text_id === 'group_macacl_configuration_add_mac_address_list') {
      return this.group_macacl_configuration_add_mac_address_list;
    } else if (text_id === 'group_macacl_configuration_add_mac_File_upload') {
      return this.group_macacl_configuration_add_mac_File_upload;
    } else if (text_id === 'group_macacl_configuration_add_mac_ACL_policy') {
      return this.group_macacl_configuration_add_mac_ACL_policy;
    }

    else {
      return this.default;
    }
  }
}
