import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsListComponent } from './settings-list/settings-list.component';
import { SettingsAddComponent } from './settings-add/settings-add.component';
import { SettingDetailsComponent } from './setting-details/setting-details.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SettingsListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: SettingsAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'setting/:id',
    component: SettingDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
