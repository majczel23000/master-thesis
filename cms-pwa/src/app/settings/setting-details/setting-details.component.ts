import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../../shared/components/dialog-confirm/dialog-confirm.component';
import { ActivatedRoute } from '@angular/router';
import { SettingModel } from '../../shared/models/settings/Setting.model';
import { SettingsService } from '../services/settings.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LanguageService } from 'src/app/shared/services/language.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-setting-details',
  templateUrl: './setting-details.component.html',
  styleUrls: ['./setting-details.component.css']
})
export class SettingDetailsComponent implements OnInit {

  settingType = ['Boolean', 'Number', 'String'];
  typeStringError = false;
  typeBooleanError = false;
  typeNumberError = false;

  settingId: string = undefined;
  setting: SettingModel = null;

  editSettingFormGroup: FormGroup;

  get control(): { [key: string]: AbstractControl }  {
    return this.editSettingFormGroup.controls;
  }

  matcher = new MyErrorStateMatcher();

  constructor(private activatedRoute: ActivatedRoute,
              public settingsService: SettingsService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private router: Router,
              private spinnerService: SpinnerService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getSettingById();
  }

  getSettingById(): void {
    this.settingId = this.activatedRoute.snapshot.paramMap.get('id');
    this.settingsService.getSettingById(this.settingId).subscribe(
      res => {
        this.setting = res.data;
        this.spinnerService.setSpinner(false);
        this.editSettingFormGroup = new FormGroup({
          code: new FormControl(this.setting.code, [ Validators.required, Validators.minLength(5) ]),
          name: new FormControl(this.setting.name, [ Validators.required, Validators.minLength(5) ]),
          description: new FormControl(this.setting.description),
          type: new FormControl(this.setting.type, Validators.required),
          value: new FormControl(this.setting.value, Validators.required)
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
    this.editSettingFormGroup.controls.name.setValue(this.setting.name);
    this.editSettingFormGroup.controls.description.setValue(this.setting.description);
  }

  changeStatus(): void {
    if (this.setting.status !== 'DELETED') {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '40%',
        data: {
          title: 'Change status',
          description: 'Are you sure you want to change status of this setting?',
          action: 'CHANGE_SETTING_STATUS',
          status: this.setting.status,
          _id: this.settingId,
          code: this.setting.code
        }
      });
      dialogRef.afterClosed().subscribe( result => {
        if (result) {
          this.getSettingById();
        }
      });
    }
  }

  editSetting(): void {
    this.settingsService.updateSetting(this.settingId, this.editSettingFormGroup.value).subscribe(
      res => {
        this.snackBar.open(res.message, 'X', {
          duration: 5000,
          horizontalPosition: 'right',
          panelClass: ['success-snackbar']
        })
        this.setting = res.data;
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

  removeSetting(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '40%',
      data: {
        title: 'Remove setting',
        description: 'Are you sure you want to remove this setting?',
        action: 'REMOVE_SETTING',
        status: 'DELETED',
        _id: this.settingId
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.router.navigate(['/settings']);
      }
    });
  }
}
