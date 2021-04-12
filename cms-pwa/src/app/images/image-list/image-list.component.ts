import {Component, OnInit, ViewChild} from '@angular/core';
import { ImageService } from '../services/image.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSort } from '@angular/material';
import { ImageModel } from '../../shared/models/image/Image.model';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['code', 'name', 'status', 'image'];
  dataSource = new MatTableDataSource<ImageModel>();
  loadingData = true;
  images: ImageModel[];

  constructor(private router: Router,
              private paginatorIntl: MatPaginatorIntl,
              private snackBar: MatSnackBar,
              public imageService: ImageService,
              private spinnerService: SpinnerService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }


  ngOnInit() {
    this.getImages();
    this.paginatorIntl.itemsPerPageLabel = 'Images per page';
  }

  getImages(): void {
    this.imageService.getAllImages()
      .pipe(
        finalize( () => {
          this.loadingData = false;
          this.spinnerService.setSpinner(false);
          this.dataSource.paginator = this.paginator;
          setTimeout( () => {
            this.dataSource.sort = this.sort;
          });
        })
      )
      .subscribe(
        res => {
          this.dataSource.data = res.data;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
