import { Component } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { LoginService } from '../../shared/services/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  get control(): { [key: string]: AbstractControl }  {
    return this.loginFormGroup.controls;
  }

  loginFormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required ])
  });

  matcher = new MyErrorStateMatcher();

  constructor(private loginService: LoginService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  login() {
    if (this.loginFormGroup.valid) {
      this.loginService.loginUser(this.loginFormGroup.value).subscribe(
        (res) => {
          this.loginService.setToken(res.data.token);
          this.loginService.setUser(res.data.user);
          this.router.navigate(['/dashboard']);
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

}
