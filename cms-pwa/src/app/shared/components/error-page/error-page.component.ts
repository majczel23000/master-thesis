import { Component, OnInit, Input } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {

  @Input() message;

  constructor(private spinnerService: SpinnerService) {
    this.spinnerService.setSpinner(false);
  }

  ngOnInit() {
  }

}
