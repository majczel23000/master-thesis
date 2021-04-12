import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatCheckbox, MatSnackBar} from '@angular/material';
import { UserService } from '../services/user.service';
import { User } from '../../shared/models/user.model';
import { RoleModel } from '../../shared/models/Role.model';
import { LanguageService } from 'src/app/shared/services/language.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  roles: RoleModel[];

  checkedCheckboxes = [];

  get control(): { [key: string]: AbstractControl }  {
    return this.addUserFormGroup.controls;
  }

  addUserFormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [ Validators.required])
  });

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              public userService: UserService,
              public languageService: LanguageService) { }

  ngOnInit() {
    this.getAllRoles();
  }

  addUser(): void {
    if (this.addUserFormGroup.valid) {
      const userData = this.prepareDataToSend();
      this.userService.addUser(userData).subscribe(
        (res) => {
          this.router.navigate(['/users']);
          this.snackBar.open(res.message, 'X', {
            duration: 5000,
            horizontalPosition: 'right',
            panelClass: ['success-snackbar']
          });
        },
        (err) => {
          this.snackBar.open(err.error.message, 'X', {
            duration: 5000,
            horizontalPosition: 'right',
            panelClass: ['error-snackbar']
          });
        }
      );
    }
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

  prepareDataToSend(): User {
    const userData: User = this.addUserFormGroup.value;
    userData.roles = this.checkedCheckboxes;
    return userData;
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
}
