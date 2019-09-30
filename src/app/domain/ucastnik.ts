import { Kruzok } from './kruzok';
import { Utils } from './utils';

export enum EPohlavie {
  M,
  Z
}

// class Adresa {
//   ulica?: string;
//   cislo: number;
//   mesto: string;
//   psc: string;

//   constructor(adresa: Adresa) {
//     this.ulica = adresa.ulica;
//     this.cislo = adresa.cislo;
//     this.mesto = adresa.mesto;
//     this.psc = adresa.psc;
//   }
// }

export class Ucastnik {
  id: number;
  // tslint:disable-next-line: variable-name
  cislo_roznodnutia: number;
  pohlavie: EPohlavie;
  meno: string;
  priezvisko: string;
  datumNarodenia: string;
  // tslint:disable-next-line: variable-name
  mesto_obec: string;
  // tslint:disable-next-line: variable-name
  ulica_cislo: string;

  // adresa: Adresa;

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
    this.datumNarodenia = ucastnik.datumNarodenia;
    this.mesto_obec = ucastnik.mesto_obec;
    this.ulica_cislo = ucastnik.ulica_cislo;

    // this.adresa = new Adresa(ucastnik.adresa);

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

  get mestoObec(): string {
    return this.mesto_obec;
  }

  set mestoObec(mestoObec: string) {
    this.mesto_obec = mestoObec;
  }

  get ulicaCislo(): string {
    return this.ulica_cislo;
  }

  set ulicaCislo(ulicaCislo: string) {
    this.ulica_cislo = ulicaCislo;
  }

  get vek(): number {
    if (this.datumNarodenia) {
      const datum: Date = Utils.stringToDate(this.datumNarodenia);
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
