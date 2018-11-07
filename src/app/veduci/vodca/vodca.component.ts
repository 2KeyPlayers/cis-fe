import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { DataService } from '../../service/data.service';
import { BaseComponent } from '../../base.component';
import { IVeduci } from './../../domain/veduci';
import { VeduciValidator } from 'src/app/validation/veduci.validator';

declare var jQuery: any;

@Component({
  selector: 'app-vodca',
  templateUrl: './vodca.component.html',
  styleUrls: ['./vodca.component.scss']
})
export class VodcaComponent extends BaseComponent implements OnInit {
  @ViewChild('titul') titul: ElementRef;
  
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
    this.setTitle('Vedúci', 'yellow');

    this.formular = this.fb.group(
      {
        $id: [null],
        titul: [null],
        meno: [null, Validators.required],
        priezvisko: [null, Validators.required]
      },
      { validator: VeduciValidator.createDuplicateValidator(this.dataService) }
    );
  }

  ngOnInit() {
    this.initData();

    // init dropdown
    jQuery(this.titul.nativeElement).dropdown({
      clearable: true
      // transition: 'scale'
    });
    jQuery(this.titul.nativeElement).dropdown('set selected', this.formular.get('titul').value);
  }

  get f() {
    return this.formular.controls;
  }

  protected getData(): any {
    let id: string = this.activatedRoute.snapshot.paramMap.get('id');
    let veduci: IVeduci = {
      $id: null,
      titul: '',
      meno: '',
      priezvisko: ''
    };

    if (id != 'plus') {
      veduci = this.dataService.findVeduci(id);
      if (veduci) {
        this.formular.setValue({
          $id: veduci.$id,
          titul: veduci.titul,
          meno: veduci.meno,
          priezvisko: veduci.priezvisko
        });
      }
    }
    return veduci;
  }

  submit() {
    this.submitnuty = true;
    if (this.formular.valid) {
      if (
        this.formular.get('$id').value == null ||
        this.formular.get('$id').value == ''
      ) {
        this.log('pridavam veduceho: ' + this.formular.get('meno').value + ' ' + this.formular.get('priezvisko').value);
        this.dataService.insertVeduci(this.formular.value).then(_ => {
          swal(`Vedúci úspešne pridaný.`, {
            icon: 'success'
          }).then(_ => {
            this.formular.reset();
            this.formular.setValue({
              $id: null,
              titul: '',
              meno: '',
              priezvisko: ''
            });
            this.submitnuty = false;
          });
        });
      } else {
        this.log('aktualizujem veduceho: ' + this.formular.get('meno').value + ' ' + this.formular.get('priezvisko').value);
        this.dataService.updateVeduci(this.formular.value).then(_ => {
          swal('Vedúci úspešne upravený.', {
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
