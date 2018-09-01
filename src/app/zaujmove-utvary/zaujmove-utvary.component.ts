import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseComponent } from '../base.component';
import { DataService } from './../service/data.service';
import { ZaujmovyUtvar } from './../domain/zaujmovy-utvar';

@Component({
  selector: 'app-zaujmove-utvary',
  templateUrl: './zaujmove-utvary.component.html',
  styleUrls: ['./zaujmove-utvary.component.scss']
})
export class ZaujmoveUtvaryComponent extends BaseComponent implements OnInit {

  zaujmoveUtvary$: Observable<Array<ZaujmovyUtvar>>;

  constructor(protected dataService: DataService) {
    super();
  }

  ngOnInit() {
    this.zaujmoveUtvary$ = this.dataService.getZaujmoveUtvary();
  }

}
