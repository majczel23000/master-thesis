import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSort } from '@angular/material';
import { User } from 'src/app/shared/models/user.model';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'status'];
  dataSource = new MatTableDataSource<User>();
  loadingData = true;
  users: User[];

  constructor(public userService: UserService,
              private router: Router,
              private paginatorIntl: MatPaginatorIntl,
              private snackBar: MatSnackBar,
              private spinnerService: SpinnerService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getUsers();
    this.paginatorIntl.itemsPerPageLabel = this.languageService.getTranslation('userItemsPerPage');
  }

  getUsers(): void {
    this.userService.getUsers()
    .pipe(
      finalize(() => {
        this.loadingData = false;
        this.spinnerService.setSpinner(false);
        this.dataSource.paginator = this.paginator;
        setTimeout(() => {
          this.dataSource.sort = this.sort;
        });
      })
    )
    .subscribe(
      (res) => {
        this.dataSource.data = res.data;
      },
      (err) => {
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
