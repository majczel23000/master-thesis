import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogConfirmComponent } from '../../shared/components/dialog-confirm/dialog-confirm.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { PageService } from '../services/page.service';
import { PageModel } from '../../shared/models/page/Page.model';
import { PageStyleModel } from '../../shared/models/page/PageStyle.model';
import { PageMetaTagModel } from '../../shared/models/page/PageMetaTag.model';
import { PageContentModel } from '../../shared/models/page/PageContent.model';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LanguageService } from 'src/app/shared/services/language.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-page-details',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.css']
})
export class PageDetailsComponent implements OnInit {

  pageId: string = undefined;
  page: PageModel = null;

  editPageFormGroup: FormGroup;

  get control(): { [key: string]: AbstractControl }  {
    return this.editPageFormGroup.controls;
  }

  matcher = new MyErrorStateMatcher();

  pageStyles: PageStyleModel[] = [];
  pageMetaTags: PageMetaTagModel[] = [];
  pageContents: PageContentModel[] = [];
  contentValue = 'Enter content here';
  contentSelector = 'selector';

  constructor(private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private router: Router,
              public pageService: PageService,
              private spinnerService: SpinnerService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getPageById();
  }

  getPageById(): void {
    this.pageId = this.activatedRoute.snapshot.paramMap.get('id');
    this.pageService.getPageById(this.pageId).subscribe(
      res => {
        this.page = res.data;
        this.spinnerService.setSpinner(false);
        this.cloneStyles();
        this.cloneMetaTags();
        this.cloneContents();
        this.editPageFormGroup = new FormGroup({
          name: new FormControl(this.page.name, [ Validators.required, Validators.minLength(5)]),
          description: new FormControl(this.page.description)
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

  clearChanges(): void {
    this.editPageFormGroup.controls.name.setValue(this.page.name);
    this.editPageFormGroup.controls.description.setValue(this.page.description);
    this.cloneStyles();
    this.cloneMetaTags();
    this.cloneContents();
  }

  changeStatus(): void {
    if (this.page.status !== 'DELETED') {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '40%',
        data: {
          title: 'Change status',
          description: 'Are you sure you want to change status of this page?',
          action: 'CHANGE_PAGE_STATUS',
          status: this.page.status,
          _id: this.pageId,
          code: this.page.code
        }
      });
      dialogRef.afterClosed().subscribe( result => {
        if (result) {
          this.getPageById();
        }
      });
    }
  }

  removePage(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '40%',
      data: {
        title: 'Remove menu',
        description: 'Are you sure you want to remove this page?',
        action: 'REMOVE_PAGE',
        status: 'DELETED',
        _id: this.pageId
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.router.navigate(['/pages']);
      }
    });
  }

  cloneStyles(): void {
    this.pageStyles = [];
    for (let i = 0; i < this.page.styles.length; i++) {
      this.pageStyles[i] = this.page.styles[i];
    }
  }

  addPageStyle(): void {
    this.pageStyles.push({
      property: 'property',
      value: 'value'
    });
  }

  removePageStyle(index: number): void {
    this.pageStyles.splice(index, 1);
  }

  cloneMetaTags(): void {
    this.pageMetaTags = [];
    for (let i = 0; i < this.page.metaTags.length; i++) {
      this.pageMetaTags[i] = this.page.metaTags[i];
    }
  }

  addPageMetaTag(): void {
    this.pageMetaTags.push({
      name: 'name',
      content: 'content'
    });
  }

  removePageMetaTag(index: number): void {
    this.pageMetaTags.splice(index, 1);
  }


  cloneContents(): void {
    this.pageContents = [];
    for (let i = 0; i < this.page.contents.length; i++) {
      this.pageContents[i] = this.page.contents[i];
    }
  }

  addPageContent(): void {
    let includes = false;
    for (let i = 0; i < this.pageContents.length; i++) {
      if (this.pageContents[i].selector === this.contentSelector) {
        includes = true;
      }
    }
    if (!includes) {
      this.pageContents.push({
        selector: this.contentSelector,
        content: this.contentValue
      });
    } else {
      this.snackBar.open('Specified selector already exist', 'X', {
        duration: 5000,
        horizontalPosition: 'right',
        panelClass: ['error-snackbar']
      });
    }
  }

  removePageContent(index: number): void {
    this.pageContents.splice(index, 1);
  }


  runEditPage(): void {
    this.editPageFormGroup.updateValueAndValidity();
    this.editPage();
  }

  editPage(): void {
    if (this.editPageFormGroup.valid) {
      const pageData = this.prepareDataToSend();
      this.pageService.editPage(this.pageId, pageData).subscribe(
        res => {
          this.snackBar.open(res.message, 'X', {
            duration: 5000,
            horizontalPosition: 'right',
            panelClass: ['success-snackbar']
          });
          this.page = res.data;
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

  prepareDataToSend(): PageModel {
    const pageData: PageModel = this.editPageFormGroup.value;
    if (!this.pageStyles.length) {
      pageData.styles = [];
    } else {
      pageData.styles = this.pageStyles;
    }

    if (!this.pageMetaTags.length) {
      pageData.metaTags = [];
    } else {
      pageData.metaTags = this.pageMetaTags;
    }

    if (!this.pageContents.length) {
      pageData.contents = [];
    } else {
      pageData.contents = this.pageContents;
    }
    return pageData;
  }

}
