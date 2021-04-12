import { Component, OnInit } from '@angular/core';
import { CarouselService } from '../services/carousel.service';
import { AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatSnackBar} from '@angular/material';
import { LanguageService } from 'src/app/shared/services/language.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-carousel-add',
  templateUrl: './carousel-add.component.html',
  styleUrls: ['./carousel-add.component.css']
})
export class CarouselAddComponent implements OnInit {

  get control(): { [key: string]: AbstractControl }  {
    return this.addCarouselFormGroup.controls;
  }

  addCarouselFormGroup = new FormGroup({
    code: new FormControl('', [ Validators.required, Validators.minLength(5) ]),
    name: new FormControl('', [ Validators.required, Validators.minLength(5) ]),
    description: new FormControl('')
  });

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              public carouselService: CarouselService,
              public languageService: LanguageService) { }

  ngOnInit() {
  }

  addCarousel(): void {
    if (this.addCarouselFormGroup.valid) {
      this.carouselService.addCarousel(this.addCarouselFormGroup.value).subscribe(
        res => {
          this.router.navigate(['/carousels']);
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
