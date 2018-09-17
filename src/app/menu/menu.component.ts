import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService, AppStatus } from './../service/data.service';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends BaseComponent implements OnInit {

  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
    this.setTitle(null, null);
  }
  
  ngOnInit() {
    this.dataService.loadData().subscribe(ok => {
      this.log('data nacitane');
    });
  }

  get loading(): boolean {
    return this.dataService.status == AppStatus.LOADING;
  }

  get failed(): boolean {
    return this.dataService.status == AppStatus.FAILED;
  }

}
