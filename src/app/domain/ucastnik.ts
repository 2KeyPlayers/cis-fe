import { ZaujmovyUtvar } from './zaujmovy-utvar';

/*
{
  "id": 1,
  "pohlavie": "M",
  "meno": "Janko",
  "priezvisko": "Hrasko",
  "datumNarodenia": "01-01-1980",
  "skola": "II. ZS",
  "trieda": "I.A",
  "adresa": {
    "ulica": "NLS",
    "cislo": "14",
    "mesto": "MnB",
    "psc": "04501"
  }
  "zastupca": "Jurko Hrasko",
  "telefon": "+421912345678",
  "zaujmoveUtvary": [
    { "id": 1 },
    { "id": 2 }
  ]
}
*/
export class Ucastnik {

  cast: string = 'Ucastnik';

  id: number;
  pohlavie: Pohlavie;
  meno: string;
  priezvisko: string;
  datumNarodenia: Date;
  skola: string;
  trieda: string;
  adresa: Adresa;
  zastupca: string;
  telefon: string;

  zaujmoveUtvary: ZaujmovyUtvar[];

  constructor(data: any) {
    this.id = data.id;
    this.pohlavie = data.pohlavie;
    this.meno = data.meno;
    this.priezvisko = data.priezvisko;
    this.datumNarodenia = new Date(data.datumNarodenia);
    this.skola = data.skola;
    this.trieda = data.trieda;
    this.adresa = new Adresa(data.adresa);
    this.zastupca = data.zastupca;
    this.telefon = data.telefon;
  }

  get vek(): number {
    if (this.datumNarodenia) {
      let rozdiel = Math.abs(Date.now() - this.datumNarodenia.getTime());
      return Math.floor((rozdiel / (1000 * 3600 * 24)) / 365);
    }
    return null;
  }

  get muz(): boolean {
    return this.pohlavie === Pohlavie.M;
  }

  get zena(): boolean {
    return this.pohlavie === Pohlavie.Z;
  }

}

enum Pohlavie {

  M,
  Z

}

class Adresa {

  ulica: string;
  cislo: number;
  mesto: string;
  psc?: string;

  constructor(data: any) {
    this.ulica = data.ulica;
    this.cislo = data.cislo;
    this.mesto = data.mesto;
    this.psc = data.pcs;
  }

}
