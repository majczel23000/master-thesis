import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogConfirmComponent } from '../../shared/components/dialog-confirm/dialog-confirm.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { DictionaryModel } from '../../shared/models/dictionary/Dictionary.model';
import { DictionaryElementModel } from '../../shared/models/dictionary/DictionaryElement.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SpinnerService } from '../../shared/services/spinner.service';
import { DictionaryService } from '../services/dictionary.service';
import { LanguageService } from 'src/app/shared/services/language.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-dictionary-details',
  templateUrl: './dictionary-details.component.html',
  styleUrls: ['./dictionary-details.component.css']
})
export class DictionaryDetailsComponent implements OnInit {

  dictionaryId: string = undefined;
  dictionary: DictionaryModel = null;

  editDictionaryFormGroup: FormGroup;

  get control(): { [key: string]: AbstractControl }  {
    return this.editDictionaryFormGroup.controls;
  }

  matcher = new MyErrorStateMatcher();

  dictionaryElementsVisibility = false;

  dictionaryElements: DictionaryElementModel[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private router: Router,
              private spinnerService: SpinnerService,
              public dictionaryService: DictionaryService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getDictionaryById();
  }

  getDictionaryById(): void {
    this.dictionaryId = this.activatedRoute.snapshot.paramMap.get('id');
    this.dictionaryService.getDictionaryById(this.dictionaryId).subscribe(
      res => {
        this.dictionary = res.data;
        console.log(this.dictionary);
        if (this.dictionary.status === 'DELETED') {
          this.dictionaryElementsVisibility = true;
        }
        this.spinnerService.setSpinner(false);
        this.cloneElements();
        this.editDictionaryFormGroup  = new FormGroup({
          name: new FormControl(this.dictionary.name, [ Validators.required, Validators.minLength(5)]),
          description: new FormControl(this.dictionary.description)
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

  cloneElements(): void {
    this.dictionaryElements = JSON.parse(JSON.stringify(this.dictionary.dictionary));
  }

  clearChanges(): void {
    this.editDictionaryFormGroup.controls.name.setValue(this.dictionary.name);
    this.editDictionaryFormGroup.controls.description.setValue(this.dictionary.description);
    this.cloneElements();
  }

  changeStatus(): void {
    if (this.dictionary.status !== 'DELETED') {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '40%',
        data: {
          title: 'Change status',
          description: 'Are you sure you want to change status of this dictionary?',
          action: 'CHANGE_DICTIONARY_STATUS',
          status: this.dictionary.status,
          _id: this.dictionaryId,
          code: this.dictionary.code
        }
      });
      dialogRef.afterClosed().subscribe( result => {
        if (result) {
          this.getDictionaryById();
        }
      });
    }
  }

  removeDictionary(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '40%',
      data: {
        title: 'Remove menu',
        description: 'Are you sure you want to remove this dictionary?',
        action: 'REMOVE_DICTIONARY',
        status: 'DELETED',
        _id: this.dictionaryId
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.router.navigate(['/dictionaries']);
      }
    });
  }

  editDictionary(): void {
    if (this.editDictionaryFormGroup.valid) {
      const dictionaryData = this.prepareDataToSend();
      this.dictionaryService.editDictionary(this.dictionaryId, dictionaryData).subscribe(
        res => {
          this.snackBar.open(res.message, 'X', {
            duration: 5000,
            horizontalPosition: 'right',
            panelClass: ['success-snackbar']
          });
          this.dictionary = res.data;
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

  prepareDataToSend(): DictionaryModel {
    const dictionaryData: DictionaryModel = this.editDictionaryFormGroup.value;
    if (!this.dictionaryElements.length) {
      dictionaryData.dictionary = [];
    } else {
      dictionaryData.dictionary = this.dictionaryElements;
    }
    return dictionaryData;
  }

  addLanguageElement(element?: DictionaryElementModel): void {
    if (element) {
      element.elements.push({
        value: 'Element'
      });
    } else {
      this.dictionaryElements.push({
        elements: [],
        language: 'language'
      });
    }
  }

  removeElement(level: number, i: number, j: number): void {
    if (!level) {
      this.dictionaryElements.splice(i, 1);
    } else {
     this.dictionaryElements[i].elements.splice(j, 1);
    }
  }

  changeValue(dictionaryLanguage: DictionaryElementModel, value: string, index: number): void {
    dictionaryLanguage.elements[index].value = value;
  }

}
