import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from '../base.component';
import { DataService } from './../service/data.service';
import { Veduci } from './../domain/veduci';

@Component({
  selector: 'app-veduci',
  templateUrl: './veduci.component.html',
  styleUrls: ['./veduci.component.scss']
})
export class VeduciComponent extends BaseComponent implements OnInit {
  veduci: Veduci[];

  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
    this.setTitle('Vedúci', 'yellow');
  }

  ngOnInit() {
    this.getData();
  }

  protected getData() {
    this.veduci = this.dataService.veduci;
  }

  protected performDelete(veduci: Veduci): Promise<void> {
    return this.dataService.deleteVeduci(veduci);
  }

}
