
import { AlarmsettingComponent } from './../components/maintenance/system/alarmsetting/alarmsetting.component';
import { MacAclComponent } from './../components/configuration/group/mac-acl/mac-acl.component';

import { PacketCaptureComponent } from './../components/maintenance/accesspoint/packet-capture/packet-capture.component';



import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CanActiveService } from '../services/loginServices/can-active.service';
import { LoggedInService } from '../services/loginServices/logged-in.service';
import { CommmonHeaderComponent } from '../components/headers/commmon-header/commmon-header.component';
import { CommonSidebarComponent } from '../components/sidebars/common-sidebar/common-sidebar.component';
import { UnregisteredApComponent } from '../components/configuration/access-point/unregistered-ap/unregistered-ap.component';
import { LoginComponent } from '../components/login/login.component';
import { SsidConfigComponent } from '../components/configuration/group/ssid/ssid-config/ssid-config.component';
import { GroupConfigComponent } from '../components/configuration/group/group-config/group-config.component';
import { StatisticsComponent } from '../components/monitor/access-point/statistics/statistics.component';
import { ImageupgradeComponent } from '../components/maintenance/accesspoint/imageupgrade/imageupgrade.component';
import { ScheduleComponent } from '../components/maintenance/accesspoint/schedule/schedule.component';
import { SystemupgradeComponent } from '../components/maintenance/system/systemupgrade/systemupgrade.component';
import { RegisteredApComponent } from '../components/configuration/access-point/registered-ap/registered-ap.component';
import { BasicComponent } from '../components/configuration/system/basic/basic.component';
import { GeneralComponent } from '../components/monitor/system/general/general.component';
import { EmsSnmpComponent } from '../components/configuration/system/ems-snmp/ems-snmp.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { RedundancyComponent } from '../components/configuration/system/redundancy/redundancy.component';
import { AccessGeneralComponent } from '../components/monitor/access-point/access-general/access-general.component';
import { IpconfigComponent } from '../components/configuration/system/ipconfig/ipconfig.component';
import { SystemStatisticsComponent } from '../components/monitor/system/system-statistics/system-statistics.component';
import { UserAccountComponent } from '../components/configuration/system/user-account/user-account.component';
import { DhcpComponent } from '../components/configuration/system/dhcp/dhcp.component';
import { AaaServerComponent } from '../components/configuration/system/aaa-server/aaa-server.component';
import { AlarmComponent } from '../components/monitor/system/alarm/alarm.component';
import { RogueApComponent } from '../components/maintenance/accesspoint/rogue-ap/rogue-ap.component';
import { VmComponent } from '../components/monitor/system/vm/vm.component';
import { RogueApmonitoringComponent } from '../components/monitor/access-point/rogue-apmonitoring/rogue-apmonitoring.component';
import { CaptivePortalComponent } from '../components/configuration/group/captive-portal/captive-portal.component';
import { AutoRfComponent } from '../components/maintenance/accesspoint/auto-rf/auto-rf.component';
import { AutoRfmonitoringComponent } from '../components/monitor/access-point/auto-rfmonitoring/auto-rfmonitoring.component';
import { AutoRfComponentsystem } from '../components/maintenance/system/auto-rf/auto-rf.component';
import { DiagnosticComponent } from '../components/monitor/access-point/diagnostic/diagnostic.component';
import { BackupRestoreComponent } from '../components/maintenance/system/backup-restore/backup-restore.component';
import { RebootComponent } from '../components/maintenance/system/reboot/reboot.component';
import { RemoteMaintenanceComponent } from '../components/maintenance/system/remote-maintenance/remote-maintenance.component';
import { RestoreDefaultComponent } from '../components/maintenance/system/restore-default/restore-default.component';
import { ApRebootComponent } from '../components/maintenance/accesspoint/ap-reboot/ap-reboot.component';
import { CheckVrrpServiceService } from '../services/loginServices/check-vrrp-service.service';
import { AirQualityComponent } from '../components/monitor/access-point/air-quality/air-quality.component';
import { ApRemoteMaintenanceComponent } from '../components/maintenance/accesspoint/ap-remote-maintenance/ap-remote-maintenance.component';
import { VrrpComponent } from '../components/configuration/system/vrrp/vrrp.component';
import { LogsComponent } from '../components/monitor/access-point/logs/logs.component';
import { LogsysComponent } from '../components/monitor/system/logsys/logsys.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    resolve: [LoggedInService]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    children: [
      {
        path: '',
        component: CommmonHeaderComponent,
        outlet: 'header'
      },
      {
        path: '',
        component: CommonSidebarComponent,
        outlet: 'sidebar',
        data: {
          activeSideMenu: 'configuration_ap'
        }
      },
      {
        path: '',
        component: DashboardComponent,

      }
    ],
    canActivate: [CanActiveService],
  }

  , {
    path: 'configuration',
    children: [
      {
        path: 'ap',
        children: [{
          path: '',
          component: CommmonHeaderComponent,
          outlet: 'header'
        },
        {
          path: '',
          component: CommonSidebarComponent,
          outlet: 'sidebar',
          data: {
            activeSideMenu: 'configuration_ap'
          }
        },
        {
          path: 'unregisteredAP',
          component: UnregisteredApComponent
        }
          ,
        {
          path: 'registeredAP',
          component: RegisteredApComponent
        }
        ]
      },

      {
        path: 'group',
        children: [{
          path: '',
          component: CommmonHeaderComponent,
          outlet: 'header'
        },
        {
          path: '',
          component: CommonSidebarComponent,
          outlet: 'sidebar',
          data: {
            activeSideMenu: 'configuration_group'
          }
        },
        {
          path: 'ssidConfiguration',
          component: SsidConfigComponent
        },
        {
          path: 'groupConfiguration',
          component: GroupConfigComponent
        },
        {
          path: 'captivePortalConfiguration',
          component: CaptivePortalComponent
        },
        {
          path: 'macAclConfiguration',
          component: MacAclComponent
        }
        ]
      },
      {
        path: 'system',
        children: [{
          path: '',
          component: CommmonHeaderComponent,
          outlet: 'header'
        },
        {
          path: '',
          component: CommonSidebarComponent,
          outlet: 'sidebar',
          data: {
            activeSideMenu: 'configuration_group'
          }
        },
        {
          path: 'confbasic',
          component: BasicComponent
        },
        {
          path: 'ipconfig',
          component: IpconfigComponent
        },
        {
          path: 'emssnmp',
          component: EmsSnmpComponent
        },
        {
          path: 'redundancy',
          component: RedundancyComponent
        },
        {
          path: 'vrrp',
          component: VrrpComponent
        },
        {
          path: 'userAccount',
          component: UserAccountComponent
        }, {
          path: 'DHCP',
          component: DhcpComponent

        },
        {
          path: 'aaaserver',
          component: AaaServerComponent
        },

        ]
      }
    ],
    canActivate: [CanActiveService, CheckVrrpServiceService],
  },
  {
    path: 'monitor',
    children: [
      {
        path: 'ap',
        children: [{
          path: '',
          component: CommmonHeaderComponent,
          outlet: 'header'
        },
        {
          path: '',
          component: CommonSidebarComponent,
          outlet: 'sidebar',
          data: {
            activeSideMenu: 'configuration_ap'
          }
        },
        {
          path: 'statistics',
          component: StatisticsComponent
        },
        {
          path: 'diagonstic',
          component: DiagnosticComponent
        },
        {
          path: 'access_general',
          component: AccessGeneralComponent
        },
        {
          path: 'rogueAPMonitoring',
          component: RogueApmonitoringComponent
        },
        {
          path: 'airQuality',
          component: AirQualityComponent
        },
        {
          path: 'autoRFMonitoring',
          component: AutoRfmonitoringComponent
        },
        {
          path: 'logs',
          component: LogsComponent
        }
        ]
      },
      {
        path: 'system',
        children: [{
          path: '',
          component: CommmonHeaderComponent,
          outlet: 'header'
        },
        {
          path: '',
          component: CommonSidebarComponent,
          outlet: 'sidebar',
          data: {
            activeSideMenu: 'configuration_ap'
          }
        },
        {
          path: 'general',
          component: GeneralComponent
        },
        {
          path: 'systemstatistics',
          component: SystemStatisticsComponent
        },
        {
          path: 'vm',
          component: VmComponent
        },
        {
          path: 'diagonstic',
          component: DiagnosticComponent
        },
        {
          path: 'alarm',
          component: AlarmComponent
        },
        {
          path: 'logsys',
          component: LogsysComponent
        },


        ]
      }
    ],
    canActivate: [CanActiveService, CheckVrrpServiceService],
  },
  {
    path: 'maintenance',
    children: [
      {
        path: 'ap',
        children: [{
          path: '',
          component: CommmonHeaderComponent,
          outlet: 'header'
        },
        {
          path: '',
          component: CommonSidebarComponent,
          outlet: 'sidebar',
          data: {
            activeSideMenu: 'configuration_group'
          }
        },
        {
          path: 'imageupgrade',
          component: ImageupgradeComponent
        },
        {
          path: 'packetCapture',
          component: PacketCaptureComponent
        },
        {
          path: 'schedule',
          component: ScheduleComponent
        },
        {
          path: 'apReboot',
          component: ApRebootComponent
        },
        {
          path: 'rogueAP',
          component: RogueApComponent
        },
        {
          path: 'schedule',
          component: ScheduleComponent
        },
        {
          path: 'autoRF',
          component: AutoRfComponent
        },
        {
          path: 'apRemoteMaintenance',
          component: ApRemoteMaintenanceComponent
        }
        ]
      },
      {
        path: 'system',
        children: [{
          path: '',
          component: CommmonHeaderComponent,
          outlet: 'header'
        },
        {
          path: '',
          component: CommonSidebarComponent,
          outlet: 'sidebar',
          data: {
            activeSideMenu: 'configuration_group'
          }
        },
        {
          path: 'systemUpgrade',
          component: SystemupgradeComponent
        },
        {
          path: 'system_autoRF',
          component: AutoRfComponentsystem
        },
        {
          path: 'backupRestore',
          component: BackupRestoreComponent
        },
        {
          path: 'reboot',
          component: RebootComponent
        },
        {
          path: 'remoteMaintenance',
          component: RemoteMaintenanceComponent
        },
        {
          path: 'restoreDefault',
          component: RestoreDefaultComponent
        },
        {
          path: 'alarmsetting',
          component: AlarmsettingComponent
        }
        ]
      }
    ],
    canActivate: [CanActiveService, CheckVrrpServiceService],
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

