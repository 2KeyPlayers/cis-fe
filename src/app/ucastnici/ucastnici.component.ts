import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  ucastnici$: Observable<Ucastnik[]>;

  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
    this.setTitle('Účastníci', 'success');
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.ucastnici$ = this.dataService.getUcastnici();
  }

}
