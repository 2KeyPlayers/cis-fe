import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { BaseComponent } from '../base.component';
import { Kruzok } from '../models/kruzok.model';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-kruzky',
  templateUrl: './kruzky.component.html',
  styleUrls: ['./kruzky.component.scss']
})
export class KruzkyComponent extends BaseComponent implements OnInit {
  kruzky: Kruzok[];

  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
    this.setTitle('Krúžky', 'red');
  }

  ngOnInit() {
    this.getData();
  }

  protected getData() {
    this.dataService.getKruzky().subscribe((kruzky: Kruzok[]) => {
      this.kruzky = kruzky;
    });
  }

  protected performDelete(id: number): Observable<boolean> {
    return this.dataService.deleteKruzok(id);
  }
}
