import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../../app.component';
import { UserComponent } from '../../components/user/user.component';
import { LoginComponent } from '../../components/login/login.component';
import { UserDetailComponent } from '../../components/user-detail/user-detail.component';
import { CanActiveService} from '../../services/can-active.service';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'user', component: UserComponent , canActivate: [CanActiveService] },
  { path: 'userDetail', component: UserDetailComponent , canActivate: [CanActiveService] }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  })
export class RoutingModule { }
