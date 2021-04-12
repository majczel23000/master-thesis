import { Component, OnInit } from '@angular/core';
import { RoleService } from '../services/role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModel } from '../../shared/models/Role.model';
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../shared/components/dialog-confirm/dialog-confirm.component';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LanguageService } from 'src/app/shared/services/language.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.css']
})
export class RoleDetailsComponent implements OnInit {

  roleId: string = undefined;
  role: RoleModel = null;

  editRoleFormGroup: FormGroup;

  get control(): { [key: string]: AbstractControl }  {
    return this.editRoleFormGroup.controls;
  }

  matcher = new MyErrorStateMatcher();

  constructor(private activatedRoute: ActivatedRoute,
              public roleService: RoleService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private spinnerService: SpinnerService,
              private router: Router,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getRoleById();
  }

  getRoleById(): void {
    this.roleId = this.activatedRoute.snapshot.paramMap.get('id');
    this.roleService.getRoleById(this.roleId).subscribe(
      res => {
        this.role = res.data;
        this.spinnerService.setSpinner(false);
        this.editRoleFormGroup = new FormGroup({
          name: new FormControl(this.role.name, [ Validators.required, Validators.minLength(6) ]),
          description: new FormControl(this.role.description, [ Validators.required])
        });
      },
      err => {
        this.snackBar.open(err.error.message, 'X', {
          duration: 5000,
          horizontalPosition: 'right',
          panelClass: ['error-snackbar']
        });
        this.router.navigate(['/error']);
      }
    );
  }

  clearChanges(): void {
    this.editRoleFormGroup.controls.name.setValue(this.role.name);
    this.editRoleFormGroup.controls.description.setValue(this.role.description);
  }

  editRole(): void {
    this.roleService.updateRole(this.roleId, this.editRoleFormGroup.value).subscribe(
      res => {
        this.snackBar.open(res.message, 'X', {
          duration: 5000,
          horizontalPosition: 'right',
          panelClass: ['success-snackbar']
        });
      },
      err => {
        this.snackBar.open(err.error.message, 'X', {
          duration: 5000,
          horizontalPosition: 'right',
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  changeStatus(): void {
    if (!this.role.code.includes('ROLES')) {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '40%',
        data: {
          title: 'Change status',
          description: 'Are you sure you want to change status of this role?',
          action: 'CHANGE_ROLE_STATUS',
          status: this.role.status,
          _id: this.roleId,
          code: this.role.code
        }
      });
      dialogRef.afterClosed().subscribe( result => {
        if (result) {
          this.getRoleById();
        }
      });
    }
  }

}
