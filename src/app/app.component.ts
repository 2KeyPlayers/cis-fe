import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from './base.component';
import { DataService } from './services/data.service';

// import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
  }

  ngOnInit(): void {
    this.dataService.initDB();
  }

  get uzivatelPrihlaseny(): boolean {
    return this.dataService.uzivatelPrihlaseny;
  }

  odhlasit() {
    this.dataService.odhlasenie().then(() => this.router.navigate(['/menu']));
  }
}
