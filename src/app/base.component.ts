import { Router } from "@angular/router";
import { FormGroup } from '@angular/forms';
import swal from 'sweetalert';

import { DataService, AppStatus } from './service/data.service';

export abstract class BaseComponent {

  formular: FormGroup;

  constructor(protected router: Router, protected dataService: DataService) { }

  goTo(location: string) {
    this.router.navigate([`/${location}`]);
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
    let data = this.getData();
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
    this.router.navigate([`/${type}/${id}`]);
  }

  delete(id: string) {
    swal({
      text: 'Naozaj vymazať?',
      icon: 'warning',
      buttons: [ 'Nie', 'Áno' ],
      dangerMode: true
    }).then((confirmed) => {
      if (confirmed) {
        this.performDelete(id).then(_ => {
          this.getData();
          swal('Záznam úspešne vymazaný.', {
            icon: 'success'
          });
        });
      }
    });
  }

  protected performDelete(id: string): Promise<void> {
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