import { AbstractControl, FormGroup } from '@angular/forms';

import { DataService } from './../service/data.service';

export class MiestoValidator {

  static createDuplicateValidator(dataService:  DataService) {
    // return (control: FormGroup) => {
    return (control: AbstractControl) => {
      const id = control.get('id');
      const nazov = control.get('nazov');

      return dataService.checkMiesto(id.value, nazov.value) ? null : { duplicate: true };
    };
  }

  // <div *ngIf="myForm.get('email').status === 'PENDING'">
  // Checking...
  // </div>
  // <div *ngIf="myForm.get('email').status === 'VALID'">
  // Email is available!
  // </div>
  // <div *ngIf="myForm.get('email').errors && myForm.get('email').errors.emailTaken">
  // Oh noes, this email is already taken!
  // </div>
}