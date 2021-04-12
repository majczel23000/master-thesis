import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleService } from '../services/role.service';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RoleModel } from '../../shared/models/Role.model';
import { SpinnerService } from '../../shared/services/spinner.service';
import { MatSnackBar } from '@angular/material';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['code', 'name', 'status'];
  dataSource = new MatTableDataSource<RoleModel>();
  loadingData = true;
  roles: RoleModel[];
  constructor(private router: Router,
              private paginatorIntl: MatPaginatorIntl,
              private roleService: RoleService,
              private snackBar: MatSnackBar,
              private spinnerService: SpinnerService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getRoles();
    this.paginatorIntl.itemsPerPageLabel = 'Roles per page';
  }

  getRoles(): void {
    this.roleService.getAllRoles()
      .pipe(
        finalize( () => {
          this.loadingData = false;
          this.spinnerService.setSpinner(false);
          this.dataSource.paginator = this.paginator;
          setTimeout(() => {
            this.dataSource.sort = this.sort;
          });
        })
      )
      .subscribe(
      res => {
        this.roles = res.data;
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
