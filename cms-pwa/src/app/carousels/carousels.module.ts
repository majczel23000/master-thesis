import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselsRoutingModule } from './carousels-routing.module';
import { CarouselListComponent } from './carousel-list/carousel-list.component';
import { CarouselAddComponent } from './carousel-add/carousel-add.component';
import { CarouselDetailsComponent } from './carousel-details/carousel-details.component';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule, MatButtonModule, MatCardModule,
  MatTableModule, MatPaginatorModule, MatPaginatorIntl,
  MatToolbarModule, MatCheckboxModule, MatSortModule, MatTabsModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkColumnDef } from '@angular/cdk/table';
import { DialogConfirmComponent } from '../shared/components/dialog-confirm/dialog-confirm.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [CarouselListComponent, CarouselAddComponent, CarouselDetailsComponent],
  imports: [
    CommonModule,
    CarouselsRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatCheckboxModule,
    SharedModule,
    MatSortModule,
    DragDropModule,
    MatTabsModule
  ],
  providers: [MatPaginatorIntl, CdkColumnDef],
  entryComponents: [DialogConfirmComponent]
})
export class CarouselsModule { }
