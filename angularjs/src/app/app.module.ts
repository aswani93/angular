
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {ChartModule} from 'angular-highcharts';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AlertModule, AlertService} from 'ngx-alerts';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {HttpModule} from '@angular/http';
import {DataTableModule} from 'angular2-datatable';
import {ModalModule} from 'ngx-bootstrap';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';
import {TabsModule} from 'ngx-bootstrap/tabs';
import * as $ from 'jquery';
import {TimepickerModule} from 'ngx-bootstrap';
import {BsDatepickerModule} from 'ngx-bootstrap';
import {AccordionModule} from 'ngx-bootstrap';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import {CarouselModule} from 'ngx-bootstrap';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { Ng5SliderModule } from 'ng5-slider';





// Services

import {NotificationService} from './services/notificationService/NotificationService';
import {CanActiveService} from './services/loginServices/can-active.service';
import {LoggedInService} from './services/loginServices/logged-in.service';
import {WebserviceService} from './services/commonServices/webservice.service';
import {_HttpInterceptor} from './services/httpInterceptor/http-interceptor';
import {AuthService} from './services/loginServices/auth.service';
import {DataService} from './services/dataService/data.service';
import {DataFilterPipe} from './services/filters/data-table-filter';
import {NoColonPipe} from './services/filters/nocolon';
import {FilterPipe} from './services/filters/filterPipe';
import {NoHyphenPipe} from './services/filters/noHyphen';
import {OrderByPipe} from './services/filters/sort';
import {counrtyService} from './services/countryList/country';


// components
 import {RogueApComponent} from '../app/components/maintenance/accesspoint/rogue-ap/rogue-ap.component';
import {AppComponent} from './app.component';
import {NotificationComponent} from './directives/notification.component';
import {CommmonHeaderComponent} from './components/headers/commmon-header/commmon-header.component';
import {CommonSidebarComponent} from './components/sidebars/common-sidebar/common-sidebar.component';
import {SerachbarComponent} from './components/serachbar/serachbar.component';
import {UnregisteredApComponent} from './components/configuration/access-point/unregistered-ap/unregistered-ap.component';
import {LoginComponent} from './components/login/login.component';
import {SsidConfigComponent} from './components/configuration/group/ssid/ssid-config/ssid-config.component';
import {GroupConfigComponent} from './components/configuration/group/group-config/group-config.component';
import { MacAclComponent } from './components/configuration/group/mac-acl/mac-acl.component';
import {StatisticsComponent} from './components/monitor/access-point/statistics/statistics.component';
import {ImageupgradeComponent} from './components/maintenance/accesspoint/imageupgrade/imageupgrade.component';
import {SystemupgradeComponent} from './components/maintenance/system/systemupgrade/systemupgrade.component';
import {DownlinkTafficComponent} from './components/monitor/access-point/statistics/graphs/downlink-taffic/downlink-taffic.component';
import {OnlineApComponent} from './components/monitor/access-point/statistics/graphs/online-ap/online-ap.component';
import {ApModelComponent} from './components/monitor/access-point/statistics/graphs/ap-model/ap-model.component';
import {TopApsComponent} from './components/monitor/access-point/statistics/graphs/top-aps/top-aps.component';
import {ApDownlinkTrafficComponent} from './components/monitor/access-point/statistics/graphs/ap-downlink-traffic/ap-downlink-traffic.component';
import {ApCpuMemoryUtilizationComponent} from './components/monitor/access-point/statistics/graphs/ap-cpu-memory-utilization/ap-cpu-memory-utilization.component';
import {ApTopClientsComponent} from './components/monitor/access-point/statistics/graphs/ap-top-clients/ap-top-clients.component';
import {ApClientDistributionComponent} from './components/monitor/access-point/statistics/graphs/ap-client-distribution/ap-client-distribution.component';
import {ApTotalClientsComponent} from './components/monitor/access-point/statistics/graphs/ap-total-clients/ap-total-clients.component';
import {ApChannelInterferenceComponent} from './components/monitor/access-point/statistics/graphs/ap-channel-interference/ap-channel-interference.component';
import {SsidDownlinkTrafficComponent} from './components/monitor/access-point/statistics/graphs/ssid-downlink-traffic/ssid-downlink-traffic.component';
import {SsidDownlinkTraffic5Component} from './components/monitor/access-point/statistics/graphs/ssid-downlink-traffic-5/ssid-downlink-traffic-5.component';
import {RegisteredApComponent} from './components/configuration/access-point/registered-ap/registered-ap.component';
import {ConnectedClientsComponent} from './components/monitor/access-point/statistics/connected-clients/connected-clients.component';
import {BasicComponent} from './components/configuration/system/basic/basic.component';
import {GeneralComponent} from './components/monitor/system/general/general.component';
import {EmsSnmpComponent} from './components/configuration/system/ems-snmp/ems-snmp.component';
import {TooltipService} from './services/tooltip/tooltip.service';
import {PopoverModule} from 'ngx-popover';
import {UpToolTipComponent} from './tooltip/uptooltip.component';
import {RightTooltipComponent} from './tooltip/righttooltip.component';
import { RedundancyComponent } from './components/configuration/system/redundancy/redundancy.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccessGeneralComponent } from './components/monitor/access-point/access-general/access-general.component';
import { ConnectedClientDetailsComponent } from './components/monitor/access-point/statistics/connected-client-details/connected-client-details.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import {UserAccountComponent} from '../app/components/configuration/system/user-account/user-account.component';
import {IpconfigComponent} from './components/configuration/system/ipconfig/ipconfig.component';
import {SystemStatisticsComponent} from './components/monitor/system/system-statistics/system-statistics.component';
import {SystemDownlinkTrafficUtilizationComponent} from './components/monitor/system/system-statistics/graph/system-downlink-traffic-utilization/system-downlink-traffic-utilization.component';
import {SystemCpuMemoryUtilizationComponent} from './components/monitor/system/system-statistics/graph/system-cpu-memory-utilization/system-cpu-memory-utilization.component';
import { ApStatusChartComponent } from './components/dashboard/sub-components/ap-status-chart/ap-status-chart.component';
import { AlarmStatusComponent } from './components/dashboard/sub-components/alarm-status/alarm-status.component';
import { AccessPointChartComponent } from './components/dashboard/sub-components/access-point-chart/access-point-chart.component';
import { ClientTopChartsComponent } from './components/dashboard/sub-components/client-top-charts/client-top-charts.component';
import { AptrafficChartComponent } from './components/dashboard/sub-components/aptraffic-chart/aptraffic-chart.component';
import { GroupTrafficChartComponent } from './components/dashboard/sub-components/group-traffic-chart/group-traffic-chart.component';
import { CpuUtilizationChartComponent } from './components/dashboard/sub-components/cpu-utilization-chart/cpu-utilization-chart.component';
import { MemoryUtilizationChartComponent } from './components/dashboard/sub-components/memory-utilization-chart/memory-utilization-chart.component';
import { AccessPointBottomChartComponent } from './components/dashboard/sub-components/access-point-bottom-chart/access-point-bottom-chart.component';
import { GroupBottomChartComponent } from './components/dashboard/sub-components/group-bottom-chart/group-bottom-chart.component';
import { ClientsGroupChartComponent } from './components/dashboard/sub-components/clients-group-chart/clients-group-chart.component';
import { ClientsSsidchartComponent } from './components/dashboard/sub-components/clients-ssidchart/clients-ssidchart.component';
import { WlcInfoChartComponent } from './components/dashboard/sub-components/wlc-info-chart/wlc-info-chart.component';
import { GroupTopChartComponent } from './components/dashboard/sub-components/group-top-chart/group-top-chart.component';
import {DhcpComponent} from './components/configuration/system/dhcp/dhcp.component';
import { AlarmComponent } from './components/monitor/system/alarm/alarm.component';
import { AaaServerComponent } from './components/configuration/system/aaa-server/aaa-server.component';
import { RogueApmonitoringComponent } from './components/monitor/access-point/rogue-apmonitoring/rogue-apmonitoring.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { VmComponent } from './components/monitor/system/vm/vm.component';
import { VmCpuMemoryUtilizationComponent } from './components/monitor/system/vm/graph/vm-cpu-memory-utilization/vm-cpu-memory-utilization.component';
import { VmDownlinkTrafficUtilizationComponent } from './components/monitor/system/vm/graph/vm-downlink-traffic-utilization/vm-downlink-traffic-utilization.component';
import { CaptivePortalComponent } from './components/configuration/group/captive-portal/captive-portal.component';
import { AutoRfComponent } from './components/maintenance/accesspoint/auto-rf/auto-rf.component';
import {BackupRestoreComponent} from './components/maintenance/system/backup-restore/backup-restore.component';
import {RebootComponent} from './components/maintenance/system/reboot/reboot.component';
import {RemoteMaintenanceComponent} from './components/maintenance/system/remote-maintenance/remote-maintenance.component';
import {RestoreDefaultComponent} from './components/maintenance/system/restore-default/restore-default.component';
import { WlcCpuGraphComponent } from './graphs/wlc-cpu-graph/wlc-cpu-graph.component';
import { WlcMemoryGraphComponent } from './graphs/wlc-memory-graph/wlc-memory-graph.component';
import { WlcUplinkDownlinkGraphComponent } from './graphs/wlc-uplink-downlink-graph/wlc-uplink-downlink-graph.component';
import { ApRebootComponent } from './components/maintenance/accesspoint/ap-reboot/ap-reboot.component';
import {CheckVrrpServiceService} from './services/loginServices/check-vrrp-service.service';
import { AirQualityComponent } from './components/monitor/access-point/air-quality/air-quality.component';
import { AirQualityDetailsComponent } from './components/monitor/access-point/air-quality/air-quality-details/air-quality-details.component';
import { ModalSettingComponent } from './components/modal-setting/modal-setting.component';
import { AlarmsettingComponent } from './components/maintenance/system/alarmsetting/alarmsetting.component';
import { AutoRfmonitoringComponent } from './components/monitor/access-point/auto-rfmonitoring/auto-rfmonitoring.component';
import { ColorPickerModule } from 'ngx-color-picker';
@NgModule({
  declarations: [
    UpToolTipComponent,
    RightTooltipComponent,
    AppComponent,
    CommmonHeaderComponent,
    CommonSidebarComponent,
    UnregisteredApComponent,
    DataFilterPipe,
    NoColonPipe,
    FilterPipe,
    NoHyphenPipe,
    LoginComponent,
    DashboardComponent,
    SsidConfigComponent,
    GroupConfigComponent,
    MacAclComponent,
    StatisticsComponent,
    ImageupgradeComponent,
    SystemupgradeComponent,
    DownlinkTafficComponent,
    OnlineApComponent,
    ApModelComponent,
    TopApsComponent,
    ApDownlinkTrafficComponent,
    ApCpuMemoryUtilizationComponent,
    ApTopClientsComponent,
    ApClientDistributionComponent,
    ApTotalClientsComponent,
    ApChannelInterferenceComponent,
    SsidDownlinkTrafficComponent,
    SsidDownlinkTraffic5Component,
    SerachbarComponent,
    RegisteredApComponent,
    ConnectedClientsComponent,
    BasicComponent,
    GeneralComponent,
    EmsSnmpComponent,
    SystemStatisticsComponent,
    SystemDownlinkTrafficUtilizationComponent,
    SystemCpuMemoryUtilizationComponent,

    NotificationComponent,
    OrderByPipe,
    RedundancyComponent,
    DashboardComponent,
    AccessGeneralComponent,
    ConnectedClientDetailsComponent,
    IpconfigComponent,
    ModalDialogComponent,
    UserAccountComponent,
    ApStatusChartComponent,
    AlarmStatusComponent,
    AccessPointChartComponent,
    ClientTopChartsComponent,
    AptrafficChartComponent,
    GroupTrafficChartComponent,
    CpuUtilizationChartComponent,
    MemoryUtilizationChartComponent,
    AccessPointBottomChartComponent,
    GroupBottomChartComponent,
    ClientsGroupChartComponent,
    ClientsSsidchartComponent,
    WlcInfoChartComponent,
    GroupTopChartComponent,
    DhcpComponent,
    AaaServerComponent,
    AlarmComponent,
    RogueApComponent,
    VmComponent,
    VmCpuMemoryUtilizationComponent,
    VmDownlinkTrafficUtilizationComponent,
    RogueApmonitoringComponent,
    CaptivePortalComponent,
    AutoRfComponent,
    BackupRestoreComponent,
    RebootComponent,
    RemoteMaintenanceComponent,
    RestoreDefaultComponent,
    WlcCpuGraphComponent,
    WlcMemoryGraphComponent,
    WlcUplinkDownlinkGraphComponent,
    ApRebootComponent,
    AirQualityComponent,
    AirQualityDetailsComponent,
    ModalSettingComponent,
    AutoRfComponent,
    AutoRfmonitoringComponent,
    AlarmsettingComponent
  ],
  imports: [
    PopoverModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ChartModule,
    DataTableModule,
    HttpClientModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    BrowserAnimationsModule,
    AlertModule.forRoot({maxMessages: 1, timeout: 3000}),
    TabsModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    AngularMultiSelectModule,
    CarouselModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPaginationModule,
    Ng5SliderModule,
    ColorPickerModule
  ],
  providers:
    [
      TooltipService,
      CanActiveService,
      CheckVrrpServiceService,
      LoggedInService,
      WebserviceService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: _HttpInterceptor,
        multi: true
      },
      AuthService,
      DataService,
      AlertService,
      counrtyService,
      NotificationService,
      TooltipService
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
