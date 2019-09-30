import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../base.component';
import { DataService } from '../service/data.service';
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
    this.setTitle('Záujmové útvary', 'red');
  }

  ngOnInit() {
    this.getData();
  }

  protected getData() {
    this.zaujmoveUtvary = this.dataService.zaujmoveUtvary;
  }

  protected performDelete(zaujmovyUtvar: ZaujmovyUtvar): Promise<void> {
    return this.dataService.deleteZaujmovyUtvar(zaujmovyUtvar);
  }
}
