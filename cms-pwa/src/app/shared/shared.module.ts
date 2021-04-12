import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentPathComponent } from './components/current-path/current-path.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { MatDialogModule } from '@angular/material';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { ModuleNavigationComponent } from './components/module-navigation/module-navigation.component';
import { MatToolbarModule, MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CurrentPathComponent, DialogConfirmComponent, ErrorPageComponent, ModuleNavigationComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatToolbarModule,
    RouterModule,
    MatButtonModule
  ],
  exports: [CurrentPathComponent, DialogConfirmComponent, MatDialogModule, ErrorPageComponent, ModuleNavigationComponent]
})
export class SharedModule { }
