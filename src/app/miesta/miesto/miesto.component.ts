import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Location } from "@angular/common";

import { DataService } from "../../service/data.service";
import { BaseComponent } from "../../base.component";
import { Miesto } from "src/app/domain/miesto";

@Component({
  selector: "app-nove-miesto",
  templateUrl: "./miesto.component.html",
  styleUrls: ["./miesto.component.scss"]
})
export class MiestoComponent extends BaseComponent implements OnInit {
  formular: FormGroup;
  submitted: boolean;

  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected location: Location,
    protected dataService: DataService
  ) {
    super(router, dataService);
    this.setTitle("Nové miesto", "info");

    this.formular = this.fb.group({
      $id: [null],
      nazov: [null, [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    this.getMiesto();
  }

  getMiesto() {
    let id: string = this.activatedRoute.snapshot.paramMap.get('id');
    let miesto: Miesto = this.dataService.findMiesto(id);
    this.formular.setValue({
      $id: id,
      nazov: miesto.nazov
    });
}

  submit() {
    this.submitted = true;
    if (this.formular.valid) {
      if (this.formular.get("$id").value == null) {
        this.dataService.insertMiesto(this.formular.value);
      } else {
        this.dataService.updateMiesto(this.formular.value);
      }
      // this.showSuccessMessage = true;
      // setTimeout(() => this.showSuccessMessage = false, 3000);
      this.submitted = false;
      this.formular.reset();
      this.formular.setValue({
        $id: null,
        nazov: ""
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
