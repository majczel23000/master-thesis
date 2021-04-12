import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuAddComponent } from './menu-add/menu-add.component';
import { MenuDetailsComponent } from './menu-details/menu-details.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MenuListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: MenuAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'menu/:id',
    component: MenuDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenusRoutingModule { }
