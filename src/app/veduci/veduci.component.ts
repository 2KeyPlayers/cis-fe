import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { BaseComponent } from '../base.component';
import { DataService } from './../service/data.service';
import { Veduci } from './../domain/veduci';

@Component({
  selector: 'app-veduci',
  templateUrl: './veduci.component.html',
  styleUrls: ['./veduci.component.scss']
})
export class VeduciComponent extends BaseComponent implements OnInit {

  veduci$: Observable<Veduci[]>;

  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
    this.setTitle('Vedúci', 'warning');
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.veduci$ = this.dataService.getVeduci();
  }

}
