import { AbstractControl, FormGroup } from '@angular/forms';

import { DataService } from '../service/data.service';

export class ZaujmovyUtvarValidator {

  static createDuplicateValidator(dataService:  DataService) {
    // return (control: FormGroup) => {
    return (control: AbstractControl) => {
      const id = control.get('$id');
      const nazov = control.get('nazov');

      return dataService.checkZaujmovyUtvar(id.value, nazov.value) ? null : { duplicate: true };
    };
  }

}