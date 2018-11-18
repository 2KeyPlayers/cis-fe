import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { DataService } from '../../service/data.service';
import { BaseComponent } from '../../base.component';
import { IMiesto } from 'src/app/domain/miesto';
import { MiestoValidator } from 'src/app/validation/miesto.validator';

@Component({
  selector: 'app-miesto',
  templateUrl: './miesto.component.html',
  styleUrls: ['./miesto.component.scss']
})
export class MiestoComponent extends BaseComponent implements OnInit {
  formular: FormGroup;
  submitnuty: boolean;

  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected location: Location,
    protected dataService: DataService
  ) {
    super(router, dataService);
    this.setTitle('Miesto', 'blue');

    this.formular = this.fb.group(
      {
        id: [null],
        nazov: [
          null,
          [
            Validators.required,
            Validators.minLength(3)
            // MiestoValidator.createDuplicateValidator(this.dataService, id)
          ]
        ]
      },
      { validator: MiestoValidator.createDuplicateValidator(this.dataService) }
    );
  }

  ngOnInit() {
   this.initData();
  }

  get f() {
    return this.formular.controls;
  }

  protected getData(): any {
    let id: string = this.activatedRoute.snapshot.paramMap.get('id');
    let miesto: IMiesto = {
      id: null,
      nazov: ''
    };

    if (id != 'plus') {
      miesto = this.dataService.findMiesto(id);
      if (miesto) {
        this.formular.setValue({
          id: miesto.id,
          nazov: miesto.nazov
        });
      }
    }
    return miesto;
  }

  submit() {
    this.submitnuty = true;
    if (this.formular.valid) {
      if (
        this.formular.get('id').value == null ||
        this.formular.get('id').value == ''
      ) {
        this.log('pridavam miesto: ' + this.formular.get('nazov').value);
        this.dataService.insertMiesto(this.formular.value).then(_ => {
          swal(`Miesto úspešne pridané.`, {
            icon: 'success'
          }).then(_ => {
            this.formular.reset();
            this.formular.setValue({
              id: null,
              nazov: ''
            });
            this.submitnuty = false;
          });
        });
      } else {
        this.log('aktualizujem miesto: ' + this.formular.get('nazov').value);
        this.dataService.updateMiesto(this.formular.value).then(_ => {
          swal('Miesto úspešne upravené.', {
            icon: 'success'
          }).then(_ => {
            this.submitnuty = false;
          });
        });
      }
    }
  }

  goBack(): void {
    this.location.back();
  }
}
