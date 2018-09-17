import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  zaujmoveUtvary: ZaujmovyUtvar[];

  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
    this.setTitle('Záujmové útvary', 'danger');
  }

  ngOnInit() {
    this.zaujmoveUtvary = this.dataService.zaujmoveUtvary;
  }
}
