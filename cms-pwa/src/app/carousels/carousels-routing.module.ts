import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { CarouselListComponent } from './carousel-list/carousel-list.component';
import { CarouselAddComponent } from './carousel-add/carousel-add.component';
import { CarouselDetailsComponent } from './carousel-details/carousel-details.component';

const routes: Routes = [
  {
    path: '',
    component: CarouselListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add',
    component: CarouselAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'carousel/:id',
    component: CarouselDetailsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarouselsRoutingModule { }
