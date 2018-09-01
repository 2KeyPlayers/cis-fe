import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from './../service/data.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends BaseComponent implements OnInit {

  loading: boolean;

  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
    this.setTitle(null, null);
    this.loading = true;
  }
  
  ngOnInit() {
    this.loading = false;
  }

}
