import { Component, OnInit } from '@angular/core';
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

  veduci$: Observable<Array<Veduci>>;

  constructor(protected dataService: DataService) {
    super();
  }

  ngOnInit() {
    this.veduci$ = this.dataService.getVeduci();
  }

}
