import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { IUcastnik, Ucastnik } from '../../domain/ucastnik';
import { EPohlavie } from './../../domain/ucastnik';
import { ZaujmovyUtvar } from './../../domain/zaujmovy-utvar';
import { Kruzok, IKruzok } from './../../domain/kruzok';

import { DataService } from '../../service/data.service';
import { Utils } from './../../domain/utils';
import { BaseComponent } from '../../base.component';
import { UcastnikValidator } from 'src/app/validation/ucastnik.validator';

import Swal from 'sweetalert2';

declare var jQuery: any;

@Component({
  selector: 'app-ucastnik',
  templateUrl: './ucastnik.component.html',
  styleUrls: ['./ucastnik.component.scss']
})
export class UcastnikComponent extends BaseComponent implements OnInit {
  @ViewChild('kalendar', { static: true }) kalendar: ElementRef;
  @ViewChild('adresa', { static: true }) adresa: ElementRef;
  @ViewChild('ostatne', { static: true }) ostatne: ElementRef;
  @ViewChild('utvary', { static: true }) utvary: ElementRef;
  @ViewChild('kruzok', { static: true }) kruzok: ElementRef;

  formular: FormGroup;
  submitnuty: boolean;

  pohlavie: EPohlavie;
  datumNarodenia: string;

  zaujmoveUtvary: ZaujmovyUtvar[];
  kruzky: Kruzok[];

  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected activatedRoute: ActivatedRoute,
    protected location: Location,
    protected dataService: DataService
  ) {
    super(router, dataService);
    this.setTitle('Účastník', 'green');

    this.formular = this.fb.group(
      {
        id: [null],
        cislo: [null, Validators.required],
        pohlavie: [null, Validators.required],
        meno: [null, Validators.required],
        priezvisko: [null, Validators.required],
        datumNarodenia: [null, Validators.required],
        skola: [null],
        trieda: [null],
        adresa: this.fb.group(
          {
            ulica: [null],
            cislo: [null, Validators.required],
            mesto: [null, Validators.required],
            psc: [null, Validators.required]
          }
        ),
        zastupca: [null, Validators.required],
        telefon: [null, Validators.required],
        kruzok: [null]
      },
      {
        validator: UcastnikValidator.createDuplicateValidator(this.dataService)
      }
    );

    this.kruzky = new Array<Kruzok>();
  }

  ngOnInit() {
    this.dataService.sortZaujmoveUtvary();
    this.zaujmoveUtvary = this.dataService.zaujmoveUtvary;
    this.initData();

    // init calendar
    jQuery(this.kalendar.nativeElement).calendar({
      type: 'date',
      monthFirst: false,
      firstDayOfWeek: 1,
      startMode: 'year',
      // formatInput: false,
      text: {
        days: ['P', 'U', 'S', 'Š', 'P', 'S', 'N'],
        months: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        today: 'Dnes',
        now: 'Teraz'
      },
      formatter: {
        date: function(date, settings) {
          if (!date) return '';
          var day = date.getDate();
          var month = date.getMonth() + 1;
          var year = date.getFullYear();
          return day + '.' + month + '.' + year;
        }
      },
      onChange: (date, text) => { this.datumNarodenia = text }
    });
    jQuery(this.kalendar.nativeElement).calendar('set date', Utils.stringToDate(this.datumNarodenia));

    // init accordions
    jQuery(this.adresa.nativeElement).accordion();
    if (!this.formular.get('id').value) {
      jQuery(this.adresa.nativeElement).accordion('open', 0);
    }
    jQuery(this.ostatne.nativeElement).accordion();
    if (!this.formular.get('id').value) {
      jQuery(this.ostatne.nativeElement).accordion('open', 0);
    }
    jQuery(this.utvary.nativeElement).accordion();
    jQuery(this.utvary.nativeElement).accordion('open', 0);

    // init dropdown
    jQuery(this.kruzok.nativeElement).dropdown({
      clearable: true
    });
  }

  get f() {
    return this.formular.controls;
  }

  protected getData(): any {
    const id: string = this.activatedRoute.snapshot.paramMap.get('id');
    let ucastnik: Ucastnik = new Ucastnik({
      _id: null,
      cislo: '',
      pohlavie: null,
      meno: '',
      priezvisko: '',
      datumNarodenia: '',
      skola: '',
      trieda: '',
      adresa: {
        ulica: '',
        cislo: null,
        mesto: '',
        psc: ''
      },
      zastupca: '',
      telefon: ''
    });

    if (id !== 'plus') {
      ucastnik = this.dataService.findUcastnik(id);
      if (ucastnik) {
        this.kruzky = ucastnik.kruzky;
        this.pohlavie = ucastnik.pohlavie;
        this.datumNarodenia = ucastnik.datumNarodenia;
        this.formular.setValue({
          id: ucastnik.id,
          cislo: ucastnik.cislo,
          pohlavie: ucastnik.pohlavie,
          meno: ucastnik.meno,
          priezvisko: ucastnik.priezvisko,
          datumNarodenia: ucastnik.datumNarodenia,
          skola: ucastnik.skola ? ucastnik.skola : '',
          trieda: ucastnik.trieda ? ucastnik.trieda : '',
          adresa: {
            ulica: ucastnik.adresa.ulica ? ucastnik.adresa.ulica : '',
            cislo: ucastnik.adresa.cislo,
            mesto: ucastnik.adresa.mesto,
            psc: ucastnik.adresa.psc
          },
          zastupca: ucastnik.zastupca,
          telefon: ucastnik.telefon,
          kruzok: ''
        });
      }
    } else {
      const nasledujuceCislo = this.dataService.getNasledujuceCisloUcastnika();
      this.log('nasledujuce cislo: ' + nasledujuceCislo);
      this.formular.patchValue({
        cislo: nasledujuceCislo
      });
    }
    return ucastnik;
  }

  setPohlavie(pohlavie: EPohlavie) {
    this.pohlavie = pohlavie;
  }

  znizCislo() {
    const cislo: string = this.formular.get('cislo').value;
    this.formular.patchValue({
      cislo: this.dataService.zmenCisloUcasnika(cislo, -1)
    });
  }
  pridajCislo() {
    const cislo: string = this.formular.get('cislo').value;
    this.formular.patchValue({
      cislo: this.dataService.zmenCisloUcasnika(cislo, 1)
    });
  }

  addKruzok() {
    if (this.formular.get('kruzok').value) {
      const utvar = this.dataService.findZaujmovyUtvar(this.formular.get('kruzok').value);
      const kruzok = this.kruzky.find(k => k.id === utvar.id);
      if (!kruzok) {
        this.log('pridavam kruzok: ' + utvar.nazov);
        this.kruzky.push(new Kruzok(utvar));
        jQuery(this.kruzok.nativeElement).dropdown('clear');
      }
    }
  }
  deleteKruzok(index: number) {
    this.log('mazem kruzok: ' + index);
    Swal.fire({
      title: 'Naozaj vymazať?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Áno',
      cancelButtonText: 'Nie',
      focusCancel: true,
      toast: true
    }).then((confirmed) => {
      if (confirmed.value) {
        this.kruzky.splice(index, 1);
      }
    });
  }

  submit() {
    this.submitnuty = true;

    this.formular.patchValue({
      pohlavie: this.pohlavie,
      datumNarodenia: this.datumNarodenia
    });

    if (this.formular.valid) {
      if (
        this.formular.get('id').value == null ||
        this.formular.get('id').value === ''
      ) {
        this.log(
          'pridavam ucastnika: ' +
            this.formular.get('meno').value +
            ' ' +
            this.formular.get('priezvisko').value
        );
        // this.dataService.insertUcastnik(this.formular.value, this.kruzky).then(() => {
        this.dataService.insertUcastnik(this.formular.value).then(() => {
          Swal.fire({
            title: `Účastník úspešne pridaný.`,
            type: 'success',
            toast: true
          }).then(() => {
            this.pohlavie = null;
            this.datumNarodenia = '';
            this.formular.reset({
              id: null,
              cislo: '',
              pohlavie: null,
              meno: '',
              priezvisko: '',
              datumNarodenia: '',
              skola: '',
              trieda: '',
              adresa: {
                ulica: '',
                cislo: null,
                mesto: '',
                psc: ''
              },
              zastupca: '',
              telefon: '',
              kruzok: ''
            });
            jQuery(this.kruzok.nativeElement).dropdown('clear');
            this.submitnuty = false;
          });
        });
      } else {
        this.log(
          'aktualizujem ucastnika: ' +
            this.formular.get('meno').value +
            ' ' +
            this.formular.get('priezvisko').value
        );
        // this.dataService.updateUcastnik(this.formular.value, this.kruzky).then(() => {
        this.dataService.updateUcastnik(this.formular.value).then(() => {
          Swal.fire({
            title: 'Účastník úspešne upravený.',
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
