import { Component, OnInit } from '@angular/core';
import { CarouselService } from '../services/carousel.service';
import { CarouselModel } from '../../shared/models/carousels/Carousel.model';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogConfirmComponent } from '../../shared/components/dialog-confirm/dialog-confirm.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { CarouselItemModel } from '../../shared/models/carousels/CarouselItem.model';
import { CarouselConfigurationModel } from '../../shared/models/carousels/CarouselConfiguration.model';
import { ImageService } from '../../images/services/image.service';
import { ImageModel } from '../../shared/models/image/Image.model';
import { LanguageService } from 'src/app/shared/services/language.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-carousel-details',
  templateUrl: './carousel-details.component.html',
  styleUrls: ['./carousel-details.component.css']
})
export class CarouselDetailsComponent implements OnInit {

  carouselId: string = undefined;
  carousel: CarouselModel = null;

  editCarouselFormGroup: FormGroup;

  get control(): { [key: string]: AbstractControl }  {
    return this.editCarouselFormGroup.controls;
  }

  matcher = new MyErrorStateMatcher();

  carouselDesktopItems: CarouselItemModel[] = [];
  carouselMobileItems: CarouselItemModel[] = [];
  carouselConfiguration: CarouselConfigurationModel = {} as CarouselConfigurationModel;

  CMSImagesFlag = false;
  CMSImages: ImageModel[] = [];
  selectedCMSImageContext = {
    index: 0,
    from: 'desktop'
  }

  constructor( private activatedRoute: ActivatedRoute,
               private snackBar: MatSnackBar,
               public dialog: MatDialog,
               private router: Router,
               private spinnerService: SpinnerService,
               public carouselService: CarouselService,
               private imageService: ImageService,
               public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getCarouselById();
  }

  getCarouselById(): void {
    this.carouselId = this.activatedRoute.snapshot.paramMap.get('id');
    this.carouselService.getCarouselById(this.carouselId).subscribe(
      res => {
        this.carousel = res.data;
        this.spinnerService.setSpinner(false);
        this.cloneElements();
        this.editCarouselFormGroup = new FormGroup({
          name: new FormControl(this.carousel.name, [ Validators.required, Validators.minLength(5)]),
          description: new FormControl(this.carousel.description)
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
    this.carouselDesktopItems = [];
    for (let i = 0; i < this.carousel.itemsDesktop.length; i++) {
      this.carouselDesktopItems[i] = this.carousel.itemsDesktop[i];
    }

    this.carouselMobileItems = [];
    for (let i = 0; i < this.carousel.itemsMobile.length; i++) {
      this.carouselMobileItems[i] = this.carousel.itemsMobile[i];
    }

    this.carouselConfiguration = this.carousel.configuration ? this.carousel.configuration : {
      dots: false,
      arrows: false,
      autoplay: false,
      infinite: false,
      draggable: false,
      swipe: false,
      pauseOnHover: false,
      rtl: false,
      speed: 0,
      slidesToShow: 0
    } as CarouselConfigurationModel;
    console.log(this.carouselConfiguration);
  }

  clearChanges(): void {
    this.editCarouselFormGroup.controls.name.setValue(this.carousel.name);
    this.editCarouselFormGroup.controls.description.setValue(this.carousel.description);
    this.cloneElements();
  }

  changeStatus(): void {
    if (this.carousel.status !== 'DELETED') {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '40%',
        data: {
          title: 'Change status',
          description: 'Are you sure you want to change status of this carousel?',
          action: 'CHANGE_CAROUSEL_STATUS',
          status: this.carousel.status,
          _id: this.carouselId,
          code: this.carousel.code
        }
      });
      dialogRef.afterClosed().subscribe( result => {
        if (result) {
          this.getCarouselById();
        }
      });
    }
  }

  removeCarousel(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '40%',
      data: {
        title: 'Remove carousel',
        description: 'Are you sure you want to remove this carousel?',
        action: 'REMOVE_CAROUSEL',
        status: 'DELETED',
        _id: this.carouselId
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.router.navigate(['/carousels']);
      }
    });
  }

  runEditCarousel(): void {
    this.editCarouselFormGroup.updateValueAndValidity();
    this.editCarousel();
  }

  editCarousel(): void {
    if (this.editCarouselFormGroup.valid) {
      const carouselData = this.prepareDataToSend();
      this.carouselService.editCarousel(this.carouselId, carouselData).subscribe(
        res => {
          this.snackBar.open(res.message, 'X', {
            duration: 5000,
            horizontalPosition: 'right',
            panelClass: ['success-snackbar']
          });
          this.carousel = res.data;
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

  prepareDataToSend(): CarouselModel {
    const carouselData: CarouselModel = this.editCarouselFormGroup.value;
    carouselData.itemsMobile = this.carouselMobileItems.length ? this.carouselMobileItems : [];
    carouselData.itemsDesktop = this.carouselDesktopItems.length ? this.carouselDesktopItems : [];
    carouselData.configuration = this.carouselConfiguration;
    return carouselData;
  }

  addDesktopItem(): void {
    this.carouselDesktopItems.push({
      button: {
        text: 'text',
        url: 'url'
      },
      description: 'Description',
      header: 'Header',
      item: ''
    });
  }

  addMobileItem(): void {
    this.carouselMobileItems.push({
      button: {
        text: 'text',
        url: 'url'
      },
      description: 'Description',
      header: 'Header',
      item: ''
    });
  }

  removeDesktopItem(index: number): void {
    this.carouselDesktopItems.splice(index, 1);
  }

  removeMobileItem(index: number): void {
    this.carouselMobileItems.splice(index, 1);
  }

  onImageSelected(event, i: number, desktop: boolean): void {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (desktop) {
          this.carouselDesktopItems[i].item = reader.result as string;
        } else {
          this.carouselMobileItems[i].item = reader.result as string;
        }
      };
    }
  }

  showCMSImages(index: number, from: string): void {
    this.selectedCMSImageContext.index = index;
    this.selectedCMSImageContext.from = from;
    this.CMSImagesFlag = true;
    this.imageService.getAllImages().subscribe(
      res => {
        this.CMSImages = res.data;
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

  hideCMSImages(event): void {
    if (event.target.className.includes('background-fade')) {
      this.CMSImagesFlag = false;
    }
  }

  selectCMSImage(image: string): void {
    if (this.selectedCMSImageContext.from === 'desktop') {
      this.carouselDesktopItems[this.selectedCMSImageContext.index].item = image;
    } else {
      this.carouselMobileItems[this.selectedCMSImageContext.index].item = image;
    }
    this.CMSImagesFlag = false;
  }
}
