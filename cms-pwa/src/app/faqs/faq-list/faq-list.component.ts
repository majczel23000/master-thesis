import { Component, OnInit, ViewChild } from '@angular/core';
import { FaqService } from '../services/faq.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSort } from '@angular/material';
import { FaqModel } from '../../shared/models/faq/Faq.model';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.css']
})
export class FaqListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['code', 'name', 'status'];
  dataSource = new MatTableDataSource<FaqModel>();
  loadingData = true;
  users: FaqModel[];

    constructor(public faqService: FaqService,
              private router: Router,
              private paginatorIntl: MatPaginatorIntl,
              private snackBar: MatSnackBar,
                private spinnerService: SpinnerService,
                public languageService: LanguageService) {
      this.spinnerService.setSpinner(true);
    }

  ngOnInit() {
    this.getFaqs();
    this.paginatorIntl.itemsPerPageLabel = 'Faqs per page';
  }

  getFaqs(): void {
      this.faqService.getAllFaqs()
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
