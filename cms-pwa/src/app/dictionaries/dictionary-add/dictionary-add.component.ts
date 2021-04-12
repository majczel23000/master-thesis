import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatSnackBar} from '@angular/material';
import { DictionaryService } from '../services/dictionary.service';
import {MyErrorStateMatcher} from "../../faqs/faq-add/faq-add.component";
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-dictionary-add',
  templateUrl: './dictionary-add.component.html',
  styleUrls: ['./dictionary-add.component.css']
})
export class DictionaryAddComponent implements OnInit {

  get control(): { [key: string]: AbstractControl }  {
    return this.addDictionaryFormGroup.controls;
  }

  addDictionaryFormGroup = new FormGroup({
    code: new FormControl('', [ Validators.required, Validators.minLength(5) ]),
    name: new FormControl('', [ Validators.required, Validators.minLength(5) ]),
    description: new FormControl('')
  });

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              public dictionaryService: DictionaryService,
              public languageService: LanguageService) { }

  ngOnInit() {
  }

  addDictionary(): void {
    if (this.addDictionaryFormGroup.valid) {
      this.dictionaryService.addDictionary(this.addDictionaryFormGroup.value).subscribe(
        res => {
          this.router.navigate(['/dictionaries']);
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

}
