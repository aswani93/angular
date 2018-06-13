import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material/material.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthenticationService } from './services/authentication.service';
import { CommonserviceService } from './services/commonservice.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { UserComponent } from './components/user/user.component';
import { RoutingModule } from './modules/routing/routing.module';
import { LoginComponent } from './components/login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { CanActiveService } from './services/can-active.service';
import { UserService } from './services/user.service';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { ChartModule } from 'angular-highcharts';
import { HeaderComponent } from './components/header/header.component';
import { ProjectmodalComponent } from './components/modals/projectmodal/projectmodal.component';




@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    UserDetailComponent,
    HeaderComponent,
    ProjectmodalComponent
  ],
  entryComponents: [ProjectmodalComponent],
  exports:[ProjectmodalComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RoutingModule,
    ChartModule,
    AngularFontAwesomeModule
  ],
  providers: [
    AuthenticationService,
    CommonserviceService,
    CanActiveService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
