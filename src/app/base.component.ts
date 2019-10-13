import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { DataService } from './services/data.service';
import Swal from 'sweetalert2';

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

  // Data

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

  delete(id: number) {
    console.log('mazem id: ' + id);
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
        this.performDelete(id).subscribe(() => {
          this.getData();
          Swal.fire({
            title: 'Záznam úspešne vymazaný',
            type: 'success',
            toast: true
          });
        });
      }
    });
  }

  protected performDelete(id: number): Observable<boolean> {
    return of(true);
  }

  // Log

  log(message: string) {
    console.log(message);
  }
}
