import { Component, Input } from '@angular/core';
import { ModuleNavigationModel } from '../../models/module-navigation/moduleNavigation.model';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-module-navigation',
  templateUrl: './module-navigation.component.html',
  styleUrls: ['./module-navigation.component.css']
})
export class ModuleNavigationComponent {

  @Input() navigation: ModuleNavigationModel;

  constructor(public languageService: LanguageService) { }

}
