import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { DataService } from '../../service/data.service';
import { BaseComponent } from '../../base.component';
import { IVeduci } from './../../domain/veduci';
import { VeduciValidator } from 'src/app/validation/veduci.validator';

import Swal from 'sweetalert2';

declare var jQuery: any;

@Component({
  selector: 'app-vodca',
  templateUrl: './vodca.component.html',
  styleUrls: ['./vodca.component.scss']
})
export class VodcaComponent extends BaseComponent implements OnInit {
  @ViewChild('titulis', { static: false }) titulis: ElementRef;

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
        id: [null],
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
    jQuery(this.titulis.nativeElement).dropdown({
      clearable: true
      // transition: 'scale'
      // 'set selected': this.formular.get('titul').value
    });
    jQuery(this.titulis.nativeElement).dropdown('set selected', this.formular.get('titul').value);
  }

  get f() {
    return this.formular.controls;
  }

  protected getData(): any {
    let id: string = this.activatedRoute.snapshot.paramMap.get('id');
    let veduci: IVeduci = {
      id: null,
      titul: '',
      meno: '',
      priezvisko: ''
    };

    if (id != 'plus') {
      veduci = this.dataService.findVeduci(id);
      if (veduci) {
        this.formular.setValue({
          id: veduci.id,
          titul: veduci.titul ? veduci.titul : '',
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
        this.formular.get('id').value == null ||
        this.formular.get('id').value == ''
      ) {
        this.log('pridavam veduceho: ' + this.formular.get('titul').value + ' ' + this.formular.get('meno').value + ' ' + this.formular.get('priezvisko').value);
        this.dataService.insertVeduci(this.formular.value).then(() => {
          Swal.fire({
            title: `Vedúci úspešne pridaný.`,
            type: 'success',
            toast: true
          }).then(() => {
            this.formular.reset();
            this.formular.setValue({
              id: null,
              titul: '',
              meno: '',
              priezvisko: ''
            });
            jQuery(this.titulis.nativeElement).dropdown('clear');
            this.submitnuty = false;
          });
        });
      } else {
        this.log('aktualizujem veduceho: ' + this.formular.get('titul').value + ' ' + this.formular.get('meno').value + ' ' + this.formular.get('priezvisko').value);
        this.dataService.updateVeduci(this.formular.value).then(() => {
          Swal.fire({
            title: 'Vedúci úspešne upravený.',
            type: 'success',
            toast: true
          }).then(() => {
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
