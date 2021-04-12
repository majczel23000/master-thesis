import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenusRoutingModule } from './menus-routing.module';
import { MenuAddComponent } from './menu-add/menu-add.component';
import { MenuDetailsComponent } from './menu-details/menu-details.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { SharedModule } from '../shared/shared.module';
import { MatInputModule, MatButtonModule, MatCardModule,
  MatTableModule, MatPaginatorModule, MatPaginatorIntl,
  MatToolbarModule, MatCheckboxModule, MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdkColumnDef } from '@angular/cdk/table';
import { DialogConfirmComponent } from '../shared/components/dialog-confirm/dialog-confirm.component';

@NgModule({
  declarations: [MenuAddComponent, MenuDetailsComponent, MenuListComponent],
  imports: [
    CommonModule,
    MenusRoutingModule,
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
export class MenusModule { }
