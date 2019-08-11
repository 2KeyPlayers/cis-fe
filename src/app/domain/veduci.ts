import { Identifikator } from './identifikator';

export interface IVeduci {
  _id?: string;
  titul?: string;
  meno: string;
  priezvisko: string;
}

export class Veduci implements Identifikator, IVeduci {
  id: string;
  titul?: string;
  meno: string;
  priezvisko: string;

  constructor(veduci: IVeduci) {
    this.id = veduci._id;
    this.titul = veduci.titul;
    this.meno = veduci.meno;
    this.priezvisko = veduci.priezvisko;
  }

  get celeMeno(): string {
    return `${this.meno} ${this.priezvisko}`;
  }
}
