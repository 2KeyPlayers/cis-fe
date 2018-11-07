import { ZaujmovyUtvar, IZaujmovyUtvar } from './zaujmovy-utvar';

export interface IUcastnik {

  $id?: string;
  pohlavie: EPohlavie;
  meno: string;
  priezvisko: string;
  datumNarodenia: Date;
  skola: string;
  trieda: string;
  adresa: Adresa;
  zastupca: string;
  telefon: string;

  zaujmoveUtvary: IZaujmovyUtvar[];

}

export class Ucastnik implements IUcastnik {

  $id: string;
  pohlavie: EPohlavie;
  meno: string;
  priezvisko: string;
  datumNarodenia: Date;
  skola: string;
  trieda: string;
  adresa: Adresa;
  zastupca: string;
  telefon: string;

  zaujmoveUtvary: ZaujmovyUtvar[];

  constructor(ucastnik: IUcastnik, id?: string) {
    this.$id = (id ? id : ucastnik.$id);
    this.pohlavie = ucastnik.pohlavie;
    this.meno = ucastnik.meno;
    this.priezvisko = ucastnik.priezvisko;
    this.datumNarodenia = new Date(ucastnik.datumNarodenia);
    this.skola = ucastnik.skola;
    this.trieda = ucastnik.trieda;
    this.adresa = new Adresa(ucastnik.adresa);
    this.zastupca = ucastnik.zastupca;
    this.telefon = ucastnik.telefon;
  }

  get vek(): number {
    if (this.datumNarodenia) {
      let rozdiel = Math.abs(Date.now() - this.datumNarodenia.getTime());
      return Math.floor((rozdiel / (1000 * 3600 * 24)) / 365);
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

enum EPohlavie {

  M,
  Z

}

class Adresa {

  ulica: string;
  cislo: number;
  mesto: string;
  psc: string;

  constructor(adresa: any) {
    this.ulica = adresa.ulica;
    this.cislo = adresa.cislo;
    this.mesto = adresa.mesto;
    this.psc = adresa.pcs;
  }

}
