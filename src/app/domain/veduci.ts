import { Identifikator } from './identifikator';

export interface IVeduci {
  _id?: any;
  titul?: string;
  meno: string;
  priezvisko: string;
}

export class Veduci implements Identifikator, IVeduci {
  id: any;
  titul?: string;
  meno: string;
  priezvisko: string;

  constructor(veduci: IVeduci) {
    this.id = veduci._id;
    this.titul = veduci.titul;
    this.meno = veduci.meno;
    this.priezvisko = veduci.priezvisko;
  }

  get _id(): any {
    return this.id;
  }

  set _id(id: any) {
    this.id = id;
  }

  get celeMeno(): string {
    return `${this.meno} ${this.priezvisko}`;
  }
}
