import { Component } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { MatSnackBar} from '@angular/material';
import { ImageService } from '../services/image.service';
import { ImageModel } from '../../shared/models/image/Image.model';
import { LanguageService } from 'src/app/shared/services/language.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-image-add',
  templateUrl: './image-add.component.html',
  styleUrls: ['./image-add.component.css']
})
export class ImageAddComponent {

  get control(): { [key: string]: AbstractControl }  {
    return this.addImageFormGroup.controls;
  }

  addImageFormGroup = new FormGroup({
    code: new FormControl('', [ Validators.required, Validators.minLength(5) ]),
    name: new FormControl('', [ Validators.required, Validators.minLength(5) ])
  });

  image: string;

  matcher = new MyErrorStateMatcher();

  selectedImage: string;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              public imageService: ImageService,
              public languageService: LanguageService) { }

  addImage(): void {
    if (!this.image.length) {
      this.snackBar.open('Please select image from disk', 'X', {
        duration: 5000,
        horizontalPosition: 'right',
        panelClass: ['error-snackbar']
      });
    } else if (this.addImageFormGroup.valid) {
      const imageData = this.prepareDataToSend();
      this.imageService.addImage(imageData).subscribe(
        res => {
          this.router.navigate(['/images']);
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

  onImageSelected(event): void {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.selectedImage = file.name;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result as string;
      };
    }
  }

  prepareDataToSend(): ImageModel {
    const imageData: ImageModel = this.addImageFormGroup.value;
    imageData.image = this.image;
    return imageData;
  }

}
