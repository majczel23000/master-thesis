import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqsRoutingModule } from './faqs-routing.module';
import { FaqAddComponent } from './faq-add/faq-add.component';
import { FaqDetailsComponent } from './faq-details/faq-details.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule, MatButtonModule, MatCardModule,
  MatTableModule, MatPaginatorModule, MatPaginatorIntl,
  MatToolbarModule, MatCheckboxModule, MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkColumnDef } from '@angular/cdk/table';
import { DialogConfirmComponent } from '../shared/components/dialog-confirm/dialog-confirm.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [FaqAddComponent, FaqDetailsComponent, FaqListComponent],
  imports: [
    CommonModule,
    FaqsRoutingModule,
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
    DragDropModule
  ],
  providers: [MatPaginatorIntl, CdkColumnDef],
  entryComponents: [DialogConfirmComponent]
})
export class FaqsModule { }
