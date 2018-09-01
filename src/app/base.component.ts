import { DataService } from './service/data.service';
import { Router } from "@angular/router";

export abstract class BaseComponent {

  constructor(protected router: Router, protected dataService: DataService) { }

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

  // CRUD operations

  add(type: string) {
    this.router.navigate([`/${type}/pridat`]);
  }

  edit(type: string, id: number) {
    this.router.navigate([`/${type}/${id}`]);
  }

  delete(id?: number): boolean {
    return confirm('Naozaj vymazať?');
  }

  // Log

  log(message: string) {
    console.log(message);
  }

}