import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqAddComponent } from './faq-add/faq-add.component';
import { FaqDetailsComponent } from './faq-details/faq-details.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FaqListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: FaqAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'faq/:id',
    component: FaqDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqsRoutingModule { }
