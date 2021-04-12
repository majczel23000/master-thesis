import { Component, OnInit, ViewChild } from '@angular/core';
import { CarouselService } from '../services/carousel.service';
import { CarouselModel } from '../../shared/models/carousels/Carousel.model';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSort } from '@angular/material';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-carousel-list',
  templateUrl: './carousel-list.component.html',
  styleUrls: ['./carousel-list.component.css']
})
export class CarouselListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['code', 'name', 'status'];
  dataSource = new MatTableDataSource<CarouselModel>();
  loadingData = true;
  carousels: CarouselModel[];

  constructor(private router: Router,
              private paginatorIntl: MatPaginatorIntl,
              private snackBar: MatSnackBar,
              private spinnerService: SpinnerService,
              public carouselService: CarouselService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getCarousels();
    this.paginatorIntl.itemsPerPageLabel = 'Carousels per page';
  }

  getCarousels(): void {
    this.carouselService.getAllCarousels()
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
