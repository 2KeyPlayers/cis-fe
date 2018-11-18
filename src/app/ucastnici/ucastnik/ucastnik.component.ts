import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { IUcastnik } from '../../domain/ucastnik';
import { EPohlavie } from './../../domain/ucastnik';
import { ZaujmovyUtvar } from './../../domain/zaujmovy-utvar';
import { Kruzok } from './../../domain/kruzok';

import { DataService } from '../../service/data.service';
import { Utils } from './../../domain/utils';
import { BaseComponent } from '../../base.component';
import { UcastnikValidator } from 'src/app/validation/ucastnik.validator';

declare var jQuery: any;

@Component({
  selector: 'app-ucastnik',
  templateUrl: './ucastnik.component.html',
  styleUrls: ['./ucastnik.component.scss']
})
export class UcastnikComponent extends BaseComponent implements OnInit {
  @ViewChild('kalendar') kalendar: ElementRef;
  @ViewChild('adresa') adresa: ElementRef;
  @ViewChild('ostatne') ostatne: ElementRef;
  @ViewChild('utvary') utvary: ElementRef;
  @ViewChild('utvar') utvar: ElementRef;

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
        utvar: [null]
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
    jQuery(this.utvar.nativeElement).dropdown({
      clearable: true
    });
  }

  get f() {
    return this.formular.controls;
  }

  protected getData(): any {
    let id: string = this.activatedRoute.snapshot.paramMap.get('id');
    let ucastnik: IUcastnik = {
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
      telefon: ''
    };

    if (id != 'plus') {
      ucastnik = this.dataService.findUcastnik(id);
      if (ucastnik) {
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
          utvar: ''
        });
      }
    } else {
      let nasledujuceCislo = this.dataService.getNasledujuceCisloUcastnika();
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
    let cislo: string = this.formular.get('cislo').value;
    this.formular.patchValue({
      cislo: this.dataService.zmenCisloUcasnika(cislo, -1)
    });
  }
  pridajCislo() {
    let cislo: string = this.formular.get('cislo').value;
    this.formular.patchValue({
      cislo: this.dataService.zmenCisloUcasnika(cislo, 1)
    });
  }

  addKruzok() {
    if (this.formular.get('utvar').value) {
      let utvar = this.dataService.findZaujmovyUtvar(this.formular.get('utvar').value);
      let kruzok = new Kruzok(utvar.id, utvar.nazov);
      if (!this.kruzky.includes(kruzok)) {
        this.log('pridavam kruzok: ' + kruzok.nazov);
        this.kruzky.push(kruzok);
        jQuery(this.utvar.nativeElement).dropdown('clear');
      }
    }
  }
  deleteKruzok(index: number) {
    this.log('mazem kruzok: ' + index);
    swal({
      text: 'Naozaj vymazať?',
      icon: 'warning',
      buttons: [ 'Nie', 'Áno' ],
      dangerMode: true
    }).then((confirmed) => {
      if (confirmed) {
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
        this.formular.get('id').value == ''
      ) {
        this.log(
          'pridavam ucastnika: ' +
            this.formular.get('meno').value +
            ' ' +
            this.formular.get('priezvisko').value
        );
        this.dataService.insertUcastnik(this.formular.value).then(_ => {
          swal(`Účastník úspešne pridaný.`, {
            icon: 'success'
          }).then(_ => {
            this.pohlavie = null;
            this.datumNarodenia = '';
            this.formular.reset();
            this.formular.setValue({
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
              utvar: ''
            });
            jQuery(this.utvar.nativeElement).dropdown('clear');
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
        this.dataService.updateUcastnik(this.formular.value).then(_ => {
          swal('Účastník úspešne upravený.', {
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
