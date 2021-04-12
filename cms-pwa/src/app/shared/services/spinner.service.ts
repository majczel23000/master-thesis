import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  spinner = false;

  constructor() { }

  getSpinner(): boolean {
    return this.spinner;
  }

  setSpinner(value: boolean): void {
    this.spinner = value;
  }

}
