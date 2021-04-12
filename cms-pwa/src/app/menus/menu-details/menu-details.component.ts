import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogConfirmComponent } from '../../shared/components/dialog-confirm/dialog-confirm.component';
import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { MenuService } from '../services/menu.service';
import { MenuModel } from '../../shared/models/menu/Menu.model';
import { MenuElementModel } from '../../shared/models/menu/MenuElement.model';
import { SpinnerService } from '../../shared/services/spinner.service';
import { LanguageService } from 'src/app/shared/services/language.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrls: ['./menu-details.component.css']
})
export class MenuDetailsComponent implements OnInit {

  menuId: string = undefined;
  menu: MenuModel = null;

  editMenuFormGroup: FormGroup;

  get control(): { [key: string]: AbstractControl }  {
    return this.editMenuFormGroup.controls;
  }

  matcher = new MyErrorStateMatcher();

  menuElementsVisibility = false;

  menuElements: MenuElementModel[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private router: Router,
              public menuService: MenuService,
              private spinnerService: SpinnerService,
              public languageService: LanguageService) {
    this.spinnerService.setSpinner(true);
  }

  ngOnInit() {
    this.getMenuById();
  }

  getMenuById(): void {
    this.menuId = this.activatedRoute.snapshot.paramMap.get('id');
    this.menuService.getMenuById(this.menuId).subscribe(
      res => {
        this.menu = res.data;
        if (this.menu.status === 'DELETED') {
          this.menuElementsVisibility = true;
        }
        this.spinnerService.setSpinner(false);
        this.cloneElements();
        this.editMenuFormGroup = new FormGroup({
          name: new FormControl(this.menu.name, [ Validators.required, Validators.minLength(5)]),
          description: new FormControl(this.menu.description)
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
    this.menuElements = JSON.parse(JSON.stringify(this.menu.elements));
  }

  clearChanges(): void {
    this.editMenuFormGroup.controls.name.setValue(this.menu.name);
    this.editMenuFormGroup.controls.description.setValue(this.menu.description);
    this.cloneElements();
  }

  changeStatus(): void {
    if (this.menu.status !== 'DELETED') {
      const dialogRef = this.dialog.open(DialogConfirmComponent, {
        width: '40%',
        data: {
          title: 'Change status',
          description: 'Are you sure you want to change status of this menu?',
          action: 'CHANGE_MENU_STATUS',
          status: this.menu.status,
          _id: this.menuId,
          code: this.menu.code
        }
      });
      dialogRef.afterClosed().subscribe( result => {
        if (result) {
          this.getMenuById();
        }
      });
    }
  }

  removeMenu(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '40%',
      data: {
        title: 'Remove menu',
        description: 'Are you sure you want to remove this menu?',
        action: 'REMOVE_MENU',
        status: 'DELETED',
        _id: this.menuId
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        this.router.navigate(['/menus']);
      }
    });
  }

  editMenu(): void {
    if (this.editMenuFormGroup.valid) {
      const menuData = this.prepareDataToSend();
      this.menuService.editMenu(this.menuId, menuData).subscribe(
        res => {
          this.snackBar.open(res.message, 'X', {
            duration: 5000,
            horizontalPosition: 'right',
            panelClass: ['success-snackbar']
          });
          this.menu = res.data;
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

  addMenuElement(element?: MenuElementModel): void {
    if (!element) {
      this.menuElements.push({
        text: 'Link Text',
        url: 'Link url',
        children: []
      });
    } else {
      element.children.push({
        text: 'Link Text',
        url: 'Link url',
        children: []
      });
    }
  }

  removeMenuElement(level: number, i: number, j: number, k: number): void {
    if (!level) {
      this.menuElements.splice(i, 1);
    } else if (level === 1) {
      this.menuElements[i].children.splice(j, 1);
    } else {
      this.menuElements[i].children[j].children.splice(k, 1);
    }
  }

  prepareDataToSend(): MenuModel {
    const menuData: MenuModel = this.editMenuFormGroup.value;
    if (!this.menuElements.length) {
      menuData.elements = [];
    } else {
      menuData.elements = this.menuElements;
    }
    return menuData;
  }

  moveElementDown(level: number, element: MenuElementModel, i: number, j: number, k: number): void {
    if (!level) {
      const temp = element;
      this.menuElements[i] = this.menuElements[i + 1];
      this.menuElements[i + 1] = temp;
    } else if (level === 1) {
      const temp = element;
      this.menuElements[i].children[j] = this.menuElements[i].children[j + 1];
      this.menuElements[i].children[j + 1] = temp;
    } else {
      const temp = element;
      this.menuElements[i].children[j].children[k] = this.menuElements[i].children[j].children[k + 1];
      this.menuElements[i].children[j].children[k + 1] = temp;
    }
  }

  moveElementUp(level: number, element: MenuElementModel, i: number, j: number, k: number): void {
    if (!level) {
      const temp = element;
      this.menuElements[i] = this.menuElements[i - 1];
      this.menuElements[i - 1] = temp;
    } else if (level === 1) {
      const temp = element;
      this.menuElements[i].children[j] = this.menuElements[i].children[j - 1];
      this.menuElements[i].children[j - 1] = temp;
    } else {
      const temp = element;
      this.menuElements[i].children[j].children[k] = this.menuElements[i].children[j].children[k - 1];
      this.menuElements[i].children[j].children[k - 1] = temp;
    }
  }
}
