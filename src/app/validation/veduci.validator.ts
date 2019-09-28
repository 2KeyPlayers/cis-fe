import { AbstractControl, FormGroup } from '@angular/forms';

import { DataService } from '../service/data.service';

export class VeduciValidator {
  static createDuplicateValidator(dataService: DataService) {
    // return (control: FormGroup) => {
    return (control: AbstractControl) => {
      const id = control.get('id');
      const meno = control.get('meno');
      const priezvisko = control.get('priezvisko');

      return dataService.checkVeduci(id.value, meno.value, priezvisko.value) ? null : { duplicate: true };
    };
  }
}
