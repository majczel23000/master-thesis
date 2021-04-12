import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogConfirmComponent } from '../../shared/components/dialog-confirm/dialog-confirm.component';
import { ImageService } from '../services/image.service';
import { ImageModel } from '../../shared/models/image/Image.model';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.css']
})
export class ImageDetailsComponent implements OnInit {

  imageId: string = undefined;
  image: ImageModel = null;

  constructor(private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private router: Router,
              public imageService: ImageService,
              private spinnerService: SpinnerService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getImageById();
  }

  getImageById(): void {
    this.imageId = this.activatedRoute.snapshot.paramMap.get('id');
    this.imageService.getImageById(this.imageId).subscribe(
      res => {
        this.image = res.data;
        this.spinnerService.setSpinner(false);
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

  changeStatus(): void {
    if (this.image.status !== 'DELETED') {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '40%',
        data: {
          title: 'Change status',
          description: 'Are you sure you want to change status of this image?',
          action: 'CHANGE_IMAGE_STATUS',
          status: this.image.status,
          _id: this.imageId,
          code: this.image.code
        }
      });
      dialogRef.afterClosed().subscribe( result => {
        if (result) {
          this.getImageById();
        }
      });
    }
  }

  removeImage(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '40%',
      data: {
        title: 'Remove image',
        description: 'Are you sure you want to remove this image?',
        action: 'REMOVE_IMAGE',
        status: 'DELETED',
        _id: this.imageId
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.router.navigate(['/images']);
      }
    });
  }

}
