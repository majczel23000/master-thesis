import { Component } from '@angular/core';
import { LoginService } from '../shared/services/login.service';
import { SpinnerService } from '../shared/services/spinner.service';
import { LanguageService } from '../shared/services/language.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  menuItems = [
    {
      routerLink: '/dashboard',
      text: 'Dashboard',
      icon: 'dashboard'
    },
    {
      routerLink: '/users',
      text: 'Users',
      icon: 'account_circle'
    },
    {
      routerLink: '/roles',
      text: 'Roles',
      icon: 'accessibility_new'
    },
    {
      routerLink: '/faqs',
      text: 'Faqs',
      icon: 'question_answer'
    },
    {
      routerLink: '/menus',
      text: 'Menus',
      icon: 'menu'
    },
    {
      routerLink: '/pages',
      text: 'Pages',
      icon: 'pages'
    },
    {
      routerLink: '/images',
      text: 'Images',
      icon: 'image'
    },
    {
      routerLink: '/settings',
      text: 'Settings',
      icon: 'settings'
    },
    {
      routerLink: '/carousels',
      text: 'Carousels',
      icon: 'view_carousel'
    },
    {
      routerLink: '/dictionaries',
      text: 'Dictionaries',
      icon: 'library_books'
    }
  ];

  constructor(public loginService: LoginService,
              public spinnerService: SpinnerService,
              public languageService: LanguageService) {
  }

  logout(): void {
    this.loginService.logout();
  }
}
