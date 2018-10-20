import { Router } from "@angular/router";
import { Observable, EMPTY } from 'rxjs';
import { FormGroup } from '@angular/forms';

import { DataService, AppStatus } from './service/data.service';

export abstract class BaseComponent {

  formular: FormGroup;

  constructor(protected router: Router, protected dataService: DataService) { }

  // Status

  get ok(): boolean {
    return this.dataService.ok;
  }

  get error(): boolean {
    return !this.dataService.ok;
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

  // add/edit-delete navigations

  add(type: string) {
    this.router.navigate([`/${type}/plus`]);
  }

  edit(type: string, id: string) {
    this.router.navigate([`/${type}/${id}`]);
  }

  delete(type: string, id: string) {
    if (confirm("Naozaj vymazať?")) {
      this.performDelete(id).subscribe(res => {
        this.router.navigate([`/${type}`]);
      });
    }
  }

  protected performDelete(id: string): Observable<any> {
    return EMPTY;
  }

  // Log

  log(message: string) {
    console.log(message);
  }

}