import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageListComponent } from './page-list/page-list.component';
import { PageAddComponent } from './page-add/page-add.component';
import { PageDetailsComponent } from './page-details/page-details.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PageListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: PageAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'page/:id',
    component: PageDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
