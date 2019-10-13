import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import Swal from 'sweetalert2';

import { BaseComponent } from '../../base.component';
import { Uzivatel } from 'src/app/models/uzivatel.model';
import { DataService } from '../../services/data.service';
import { Kruzok } from 'src/app/models/kruzok.model';
import { KruzokValidator } from 'src/app/validators/kruzok.validator';

declare var jQuery: any;

@Component({
  selector: 'app-kruzok',
  templateUrl: './kruzok.component.html',
  styleUrls: ['./kruzok.component.scss']
})
export class KruzokComponent extends BaseComponent implements OnInit, AfterViewChecked {
  @ViewChild('vodca', { static: true }) vodca: ElementRef;

  formular: FormGroup;
  submitnuty: boolean;

  veduci: Uzivatel[];

  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected location: Location,
    protected dataService: DataService
  ) {
    super(router, dataService);
    this.setTitle('Krúžok', 'red');

    this.formular = this.fb.group(
      {
        id: [null],
        nazov: [
          null,
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],
        veduci: [null, Validators.required]
      },
      { validator: KruzokValidator.createDuplicateValidator(this.dataService) }
    );
  }

  ngOnInit() {
    this.dataService.getVeduci().subscribe((veduci: Veduci) => {
      this.veduci = veduci;
    });

    // init dropdown
    jQuery(this.vodca.nativeElement).dropdown();
  }

  ngAfterViewChecked() {
    jQuery(this.vodca.nativeElement).dropdown('set selected', this.formular.get('veduci').value);
  }

  get f() {
    return this.formular.controls;
  }

  protected getData(): any {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id');
    let kruzok: Kruzok = new Kruzok({
      _id: null,
      nazov: '',
      veduci: {
        _id: null,
        meno: '',
        priezvisko: ''
      }
    });

    if (id !== 'plus') {
      kruzok = this.dataService.findKruzok(id);
      if (kruzok) {
        this.log('nastavujem veduceho: ' + kruzok.veduci.id);
        this.formular.setValue({
          id: kruzok.id,
          nazov: kruzok.nazov,
          veduci: kruzok.veduci.id ? kruzok.veduci.id : ''
        });
      }
    }
    return kruzok;
  }

  submit() {
    this.submitnuty = true;
    if (this.formular.valid) {
      if (
        this.formular.get('id').value == null ||
        this.formular.get('id').value === ''
      ) {
        this.log('pridavam zaujmovy utvar: ' + this.formular.get('nazov').value);
        this.dataService.insertKruzok(this.formular.value).then(() => {
          Swal.fire({
            title: `Krúžok úspešne pridaný.`,
            type: 'success',
            toast: true
          }).then(() => {
            this.formular.reset();
            this.formular.setValue({
              id: null,
              nazov: '',
              veduci: null
            });
            jQuery(this.vodca.nativeElement).dropdown('clear');
            this.submitnuty = false;
          });
        });
      } else {
        this.log('aktualizujem zaujmovy utvar: ' + this.formular.get('nazov').value);
        this.dataService.updateKruzok(this.formular.value).then(() => {
          Swal.fire({
            title: 'Krúžok úspešne upravený.',
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
