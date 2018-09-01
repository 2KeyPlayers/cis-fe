import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseComponent } from '../base.component';
import { DataService } from './../service/data.service';
import { Miesto } from './../domain/miesto';

@Component({
  selector: 'app-miesta',
  templateUrl: './miesta.component.html',
  styleUrls: ['./miesta.component.scss']
})
export class MiestaComponent extends BaseComponent implements OnInit {

  miesta$: Observable<Array<Miesto>>;

  constructor(protected dataService: DataService) {
    super();
  }

  ngOnInit() {
    this.miesta$ = this.dataService.getMiesta();
  }

}
