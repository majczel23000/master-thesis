import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesRoutingModule } from './roles-routing.module';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RoleListComponent } from './role-list/role-list.component';
import { MatInputModule, MatButtonModule, MatCardModule,
  MatTableModule, MatPaginatorModule, MatPaginatorIntl,
  MatToolbarModule, MatCheckboxModule, MatSortModule } from '@angular/material';
import { CdkColumnDef } from '@angular/cdk/table';
import { SharedModule } from '../shared/shared.module';
import { DialogConfirmComponent } from '../shared/components/dialog-confirm/dialog-confirm.component';

@NgModule({
  declarations: [RoleDetailsComponent, RoleListComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
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
export class RolesModule { }
