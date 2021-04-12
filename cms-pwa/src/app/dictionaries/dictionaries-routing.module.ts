import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { DictionaryListComponent } from './dictionary-list/dictionary-list.component';
import { DictionaryAddComponent } from './dictionary-add/dictionary-add.component';
import { DictionaryDetailsComponent } from './dictionary-details/dictionary-details.component';
const routes: Routes = [
  {
    path: '',
    component: DictionaryListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: DictionaryAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dictionary/:id',
    component: DictionaryDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DictionariesRoutingModule { }
