import { Component, OnInit, ViewChild } from '@angular/core';
import { SpinnerService } from '../../shared/services/spinner.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSort } from '@angular/material';
import { DictionaryService } from '../services/dictionary.service';
import { DictionaryModel } from '../../shared/models/dictionary/Dictionary.model';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.css']
})
export class DictionaryListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['code', 'name', 'status'];
  dataSource = new MatTableDataSource<DictionaryModel>();
  loadingData = true;
  users: DictionaryModel[];

  constructor(private router: Router,
              private paginatorIntl: MatPaginatorIntl,
              private snackBar: MatSnackBar,
              private spinnerService: SpinnerService,
              public dictionaryService: DictionaryService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getDictionaries();
    this.paginatorIntl.itemsPerPageLabel = 'Dictionaries per page';
  }

  getDictionaries(): void {
    this.dictionaryService.getAllDictionaries()
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
