import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../base.component';
import { DataService } from './../service/data.service';
import { Miesto } from './../domain/miesto';

@Component({
  selector: 'app-miesta',
  templateUrl: './miesta.component.html',
  styleUrls: ['./miesta.component.scss']
})
export class MiestaComponent extends BaseComponent implements OnInit {
  miesta: Miesto[];

  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
    this.setTitle('Miesta', 'blue');
  }

  ngOnInit() {
    this.initData();
  }

  protected getData() {
    this.miesta = this.dataService.miesta;
    this.log('getData' + this.miesta);
    return this.miesta;
  }

  protected performDelete(miesto: Miesto): Promise<void> {
    return this.dataService.deleteMiesto(miesto);
  }

}
