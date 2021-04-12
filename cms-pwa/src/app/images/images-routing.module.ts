import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageAddComponent } from './image-add/image-add.component';
import { ImageDetailsComponent } from './image-details/image-details.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ImageListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: ImageAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'image/:id',
    component: ImageDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImagesRoutingModule { }
