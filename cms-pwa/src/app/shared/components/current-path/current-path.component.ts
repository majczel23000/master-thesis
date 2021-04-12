import { Component, OnInit, Input } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-current-path',
  templateUrl: './current-path.component.html',
  styleUrls: ['./current-path.component.css']
})
export class CurrentPathComponent implements OnInit {

  @Input() currentPathItems: string[];

  constructor(public languageService: LanguageService) { }

  ngOnInit() {
  }

}
