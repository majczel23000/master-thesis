import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagesRoutingModule } from './images-routing.module';
import { ImageAddComponent } from './image-add/image-add.component';
import { ImageListComponent } from './image-list/image-list.component';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule, MatButtonModule, MatCardModule,
  MatTableModule, MatPaginatorModule, MatPaginatorIntl,
  MatToolbarModule, MatCheckboxModule, MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkColumnDef } from '@angular/cdk/table';
import { DialogConfirmComponent } from '../shared/components/dialog-confirm/dialog-confirm.component';
import { ImageDetailsComponent } from './image-details/image-details.component';

@NgModule({
  declarations: [ImageAddComponent, ImageListComponent, ImageDetailsComponent],
  imports: [
    CommonModule,
    ImagesRoutingModule,
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
    MatSortModule
  ],
  providers: [MatPaginatorIntl, CdkColumnDef],
  entryComponents: [DialogConfirmComponent]
})
export class ImagesModule { }
