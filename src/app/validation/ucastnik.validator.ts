import { AbstractControl, FormGroup } from '@angular/forms';

import { DataService } from '../service/data.service';

export class UcastnikValidator {

  static createDuplicateValidator(dataService:  DataService) {
    // return (control: FormGroup) => {
    return (control: AbstractControl) => {
      const id = control.get('$id');
      const meno = control.get('meno');
      const priezvisko = control.get('priezvisko');
      // const datum = control.get('datum');
      
      return dataService.checkUcastnik(id.value, meno.value, priezvisko.value) ? null : { duplicate: true };
    };
  }

}