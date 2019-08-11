import { Kruzok, IKruzok } from './kruzok';
import { Utils } from './utils';
import { Identifikator } from './identifikator';

export enum EPohlavie {
  M,
  Z
}

class Adresa {
  ulica?: string;
  cislo: number;
  mesto: string;
  psc: string;

  constructor(adresa: Adresa) {
    this.ulica = adresa.ulica;
    this.cislo = adresa.cislo;
    this.mesto = adresa.mesto;
    this.psc = adresa.psc;
  }
}

export interface IUcastnik {
  _id?: string;
  cislo: string;
  pohlavie: EPohlavie;
  meno: string;
  priezvisko: string;
  datumNarodenia: string;
  skola?: string;
  trieda?: string;
  adresa: Adresa;
  zastupca: string;
  telefon: string;

  kruzky?: IKruzok[];
}

export class Ucastnik implements Identifikator, IUcastnik {
  id: string;
  cislo: string;
  pohlavie: EPohlavie;
  meno: string;
  priezvisko: string;
  datumNarodenia: string;
  skola?: string;
  trieda?: string;
  adresa: Adresa;
  zastupca: string;
  telefon: string;

  kruzky: Kruzok[];

  constructor(ucastnik: IUcastnik) {
    this.id = ucastnik._id;
    this.cislo = ucastnik.cislo;
    this.pohlavie = ucastnik.pohlavie;
    this.meno = ucastnik.meno;
    this.priezvisko = ucastnik.priezvisko;
    this.datumNarodenia = ucastnik.datumNarodenia;
    this.skola = ucastnik.skola;
    this.trieda = ucastnik.trieda;
    this.adresa = new Adresa(ucastnik.adresa);
    this.zastupca = ucastnik.zastupca;
    this.telefon = ucastnik.telefon;

    if (ucastnik.kruzky) {
      this.kruzky = new Array<Kruzok>();
      ucastnik.kruzky.forEach(kruzok => {
        const k = new Kruzok(kruzok.id);
        k.vyskaPoplatku = kruzok.vyskaPoplatku;
        k.poplatky = kruzok.poplatky;
        this.kruzky.push(k);
      });
    }
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
