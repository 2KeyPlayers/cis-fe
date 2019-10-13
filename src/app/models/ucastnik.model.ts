import { Kruzok } from './kruzok.model';
import { Utils } from '../services/utils';

export enum EPohlavie {
  M,
  Z
}

export interface Adresa {
  mesto: string;
  ulica?: string;
  cislo: number;
  psc?: string;

  // constructor(adresa: Adresa) {
  //   this.ulica = adresa.ulica;
  //   this.cislo = adresa.cislo;
  //   this.mesto = adresa.mesto;
  //   this.psc = adresa.psc;
  // }
}

export class Ucastnik {
  id: number;
  // tslint:disable-next-line: variable-name
  cislo_roznodnutia: number;
  pohlavie: EPohlavie;
  meno: string;
  priezvisko: string;
  // tslint:disable-next-line: variable-name
  datum_narodenia: string;

  adresa: Adresa;

  skola?: string;
  trieda?: string;
  zastupca?: string;
  telefon?: string;

  kruzky: Kruzok[];

  constructor(ucastnik: Ucastnik) {
    this.id = ucastnik.id;
    this.cislo_roznodnutia = ucastnik.cislo_roznodnutia;
    this.pohlavie = ucastnik.pohlavie;
    this.meno = ucastnik.meno;
    this.priezvisko = ucastnik.priezvisko;
    this.datum_narodenia = ucastnik.datum_narodenia;

    this.adresa = ucastnik.adresa;

    this.skola = ucastnik.skola;
    this.trieda = ucastnik.trieda;
    this.zastupca = ucastnik.zastupca;
    this.telefon = ucastnik.telefon;

    if (ucastnik.kruzky) {
      this.kruzky = new Array<Kruzok>();
      ucastnik.kruzky.forEach(kruzok => {
        this.kruzky.push(new Kruzok(kruzok));
      });
    }
  }

  get cisloRozhodnutia(): number {
    return this.cislo_roznodnutia;
  }

  set cisloRozhodnutia(cisloRozhodnutia: number) {
    this.cislo_roznodnutia = cisloRozhodnutia;
  }

  get datumNarodenia(): string {
    return this.datum_narodenia;
  }

  set datumNarodenia(datumNarodenia: string) {
    this.datum_narodenia = datumNarodenia;
  }

  get vek(): number {
    if (this.datum_narodenia) {
      const datum: Date = Utils.stringToDate(this.datum_narodenia);
      const rozdiel: number = Math.abs(Date.now() - datum.getTime());
      return Math.floor(rozdiel / (1000 * 3600 * 24) / 365);
    }
    return null;
  }

  get muz(): boolean {
    return this.pohlavie === EPohlavie.M;
  }

  get zena(): boolean {
    return this.pohlavie === EPohlavie.Z;
  }

  get celeMeno(): string {
    return `${this.meno} ${this.priezvisko}`;
  }
}
