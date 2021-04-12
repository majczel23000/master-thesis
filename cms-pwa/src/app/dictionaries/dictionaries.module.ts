import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DictionariesRoutingModule } from './dictionaries-routing.module';
import { DictionaryAddComponent } from './dictionary-add/dictionary-add.component';
import { DictionaryDetailsComponent } from './dictionary-details/dictionary-details.component';
import { DictionaryListComponent } from './dictionary-list/dictionary-list.component';
import { MatInputModule, MatButtonModule, MatCardModule,
  MatTableModule, MatPaginatorModule, MatPaginatorIntl,
  MatToolbarModule, MatCheckboxModule, MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkColumnDef } from '@angular/cdk/table';
import { DialogConfirmComponent } from '../shared/components/dialog-confirm/dialog-confirm.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DictionaryAddComponent, DictionaryDetailsComponent, DictionaryListComponent],
  imports: [
    CommonModule,
    DictionariesRoutingModule,
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
export class DictionariesModule { }
