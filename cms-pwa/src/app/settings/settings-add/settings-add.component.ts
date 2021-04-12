import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatSnackBar} from '@angular/material';
import { SettingsService } from '../services/settings.service';
import { LanguageService } from 'src/app/shared/services/language.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-settings-add',
  templateUrl: './settings-add.component.html',
  styleUrls: ['./settings-add.component.css']
})
export class SettingsAddComponent implements OnInit {

  settingType = ['Boolean', 'Number', 'String'];
  typeStringError = false;
  typeBooleanError = false;
  typeNumberError = false;

  get control(): { [key: string]: AbstractControl }  {
    return this.addSettingFormGroup.controls;
  }

  addSettingFormGroup = new FormGroup({
    code: new FormControl('', [ Validators.required, Validators.minLength(5) ]),
    name: new FormControl('', [ Validators.required, Validators.minLength(5) ]),
    description: new FormControl(''),
    type: new FormControl('', Validators.required),
    value: new FormControl('', Validators.required)
  });

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              public settingsService: SettingsService,
              public languageService: LanguageService) { }

  ngOnInit() {
  }

  addSetting(): void {
    this.validateType();
    if (this.addSettingFormGroup.valid) {
      this.settingsService.addSetting(this.addSettingFormGroup.value).subscribe(
        res => {
          this.router.navigate(['/settings']);
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
  }

  validateType(): void {
    if (this.control.type.value === 'Boolean') {
      if (this.control.value.value !== 'true' && this.control.value.value !== 'false' && this.control.value.value !== '1' &&
      this.control.value.value !== 1 && this.control.value.value !== '0' && this.control.value.value !== 0) {
        this.typeBooleanError = true;
      }
    } else if (this.control.type.value === 'Number') {
      if (isNaN(this.control.value.value)) {
        this.typeNumberError = true;
      }
    }
  }

}
