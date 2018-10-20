import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { BaseComponent } from "../base.component";
import { DataService } from "./../service/data.service";
import { Miesto } from "./../domain/miesto";

@Component({
  selector: "app-miesta",
  templateUrl: "./miesta.component.html",
  styleUrls: ["./miesta.component.scss"]
})
export class MiestaComponent extends BaseComponent implements OnInit {
  miesta: Miesto[];

  constructor(protected router: Router, protected dataService: DataService) {
    super(router, dataService);
    this.setTitle("Miesta", "info");
  }

  ngOnInit() {
    this.miesta = this.dataService.miesta;
  }

  // protected performDelete(id: number): Observable<any> {
  //   return this.dataService.deleteMiesto(id);
  // }

}
