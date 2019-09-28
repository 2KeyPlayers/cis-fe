import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

import { DataService } from './service/data.service';
import { Identifikator } from './domain/identifikator';

export abstract class BaseComponent {
  formular: FormGroup;

  constructor(protected router: Router, protected dataService: DataService) {}

  goTo(location: string) {
    if (this.dataService.ok) {
      this.router.navigate([`/${location}`]);
    }
  }

  // Status

  get ok(): boolean {
    return this.dataService.ok;
  }

  get error(): boolean {
    return !this.dataService.ok && !this.dataService.loading;
  }

  get loading(): boolean {
    return this.dataService.loading;
  }

  get failed(): boolean {
    return this.dataService.failed;
  }

  // Title

  setTitle(nadpis: string, typ: string) {
    this.dataService.setNadpis(nadpis, typ);
  }

  get title(): string {
    return this.dataService.nadpis;
  }

  get titleType(): string {
    return this.dataService.typNadpisu;
  }

  // data

  protected initData() {
    const data = this.getData();
    this.log('initData: ' + data);
    if (!data) {
      this.log('ziadne data, presmeruvavam na /');
      this.router.navigate(['/']);
    }
  }

  protected getData(): any {
    return null;
  }

  add(type: string) {
    this.router.navigate([`/${type}/plus`]);
  }

  edit(type: string, id: string) {
    console.log('editujem id: ' + id);
    this.router.navigate([`/${type}/${id}`]);
  }

  delete(objekt: Identifikator) {
    console.log('mazem id: ' + objekt.id);
    Swal.fire({
      title: 'Naozaj vymazať?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Áno',
      cancelButtonText: 'Nie',
      focusCancel: true,
      toast: true
    }).then(confirmed => {
      if (confirmed.value) {
        this.performDelete(objekt).then(() => {
          this.getData();
          Swal.fire({
            title: 'Záznam úspešne vymazaný.',
            type: 'success',
            toast: true
          });
        });
      }
    });
  }

  protected performDelete(objekt: Identifikator): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.log('defaultny prazdny promise');
        resolve();
      }, 500);
    });
  }

  // Log

  log(message: string) {
    console.log(message);
  }
}
