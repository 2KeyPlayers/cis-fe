import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseComponent } from '../base.component';
import { DataService } from './../service/data.service';
import { Ucastnik } from '../domain/ucastnik';

@Component({
  selector: 'app-ucastnici',
  templateUrl: './ucastnici.component.html',
  styleUrls: ['./ucastnici.component.scss']
})
export class UcastniciComponent extends BaseComponent implements OnInit {

  ucastnici$: Observable<Array<Ucastnik>>;

  constructor(protected dataService: DataService) {
    super();
  }

  ngOnInit() {
    this.ucastnici$ = this.dataService.getUcastnici();
  }

  age(date: Date): string | number {
    if (date) {
      let rozdiel = Math.abs(Date.now() - new Date(date).getTime());
      return Math.floor((rozdiel / (1000 * 3600 * 24)) / 365);
    }
    return '-';
  }

}
