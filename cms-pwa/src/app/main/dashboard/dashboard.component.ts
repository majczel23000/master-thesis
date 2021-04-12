import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../shared/services/login.service';
import { LanguageService } from 'src/app/shared/services/language.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private loginService: LoginService,
    public languageService: LanguageService) { }

  private user;
  public modules = {
    'USERS': false,
    'ROLES': false,
    'FAQS': false,
    'MENUS': false,
    'IMAGES': false,
    'PAGES': false,
    'SETTINGS': false,
    'CAROUSELS': false,
    'DICTIONARIES': false
  }

  ngOnInit() {
    this.user = this.loginService.getUser();
    for (let i = 0; i < this.user.roles.length; i++) {
      for (let key in this.modules) {
        if (this.modules.hasOwnProperty(key)) {
          if (this.user.roles[i].includes(key)) {
            this.modules[key] = true;
          }
        }
      }
    }
  }


}
