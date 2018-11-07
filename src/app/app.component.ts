import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent } from './base.component';
import { DataService } from './service/data.service';

// import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {
  
  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
  }

}
