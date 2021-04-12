import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { RoleModel } from '../../shared/models/Role.model';
import { MatCheckbox, MatSnackBar } from '@angular/material';
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
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  userId: string = undefined;
  user: User = null;
  roles: RoleModel[];
  checkedCheckboxes = [];

  editUserFormGroup: FormGroup;

  get control(): { [key: string]: AbstractControl }  {
    return this.editUserFormGroup.controls;
  }

  matcher = new MyErrorStateMatcher();

  constructor(public userService: UserService,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private router: Router,
              private spinnerService: SpinnerService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getAllRoles();
    this.getUserById();
  }

  getUserById(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.userService.getUserById(this.userId).subscribe(
      res => {
        this.user = res.data;
        this.spinnerService.setSpinner(false);
        for (let i = 0; i < this.user.roles.length; i++) {
          this.checkedCheckboxes.push(this.user.roles[i]);
        }

        this.editUserFormGroup = new FormGroup({
          password: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
          firstName: new FormControl(this.user.firstName, [ Validators.required]),
          lastName: new FormControl(this.user.lastName, [ Validators.required])
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

  getAllRoles(): void {
    this.userService.getAllRoles().subscribe(
      res => {
        this.roles = res.data;
      },
      err => {
        console.log(err);
      }
    );
  }

  checkIfUserHasThisRole(code: string): boolean {
    for (let i = 0; i < this.roles.length; i++) {
      for (let j = 0; j < this.user.roles.length; j++) {
        if (code === this.user.roles[j]) {
          return true;
        }
      }
    }
    return false;
  }

  onCheckboxChange(role, checkbox: MatCheckbox): void {
    if (checkbox.checked) {
      this.checkedCheckboxes.push(role);
    } else {
      for (let i = 0; i < this.checkedCheckboxes.length; i++) {
        if (this.checkedCheckboxes[i] === role) {
          this.checkedCheckboxes.splice(i, 1);
        }
      }
    }
  }

  editUser(): void {
    if (this.editUserFormGroup.valid) {
      const userData = this.prepareDataToSend();
      this.userService.updateUser(this.userId, userData).subscribe(
        res => {
          this.snackBar.open(res.message, 'X', {
            duration: 5000,
            horizontalPosition: 'right',
            panelClass: ['success-snackbar']
          });
          this.user = res.data;
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
  }

  clearChanges(): void {
    this.editUserFormGroup.controls.firstName.setValue(this.user.firstName);
    this.editUserFormGroup.controls.lastName.setValue(this.user.lastName);
    this.editUserFormGroup.controls.password.setValue('');
  }

  prepareDataToSend(): User {
    const userData: User = this.editUserFormGroup.value;
    userData.roles = this.checkedCheckboxes;
    return userData;
  }

  changeStatus(): void {
    if (this.user.status !== 'DELETED') {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '40%',
        data: {
          title: 'Change status',
          description: 'Are you sure you want to change status of this user?',
          action: 'CHANGE_STATUS',
          status: this.user.status,
          _id: this.userId
        }
      });
      dialogRef.afterClosed().subscribe( result => {
        if (result) {
          this.getUserById();
        }
      });
    }
  }

  removeUser(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '40%',
      data: {
        title: 'Remove user',
        description: 'Are you sure you want to remove this user?',
        action: 'REMOVE_USER',
        status: 'DELETED',
        _id: this.userId
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.router.navigate(['/users']);
      }
    });
  }

}
