export interface IVeduci {

  id: string;
  titul?: string;
  meno: string;
  priezvisko: string;

}

export class Veduci implements IVeduci {

  id: string;
  titul?: string;
  meno: string;
  priezvisko: string;

  constructor(veduci: IVeduci, id?: string) {
    this.id = (id ? id : veduci.id);
    this.titul = veduci.titul;
    this.meno = veduci.meno;
    this.priezvisko = veduci.priezvisko;
  }

  get celeMeno(): string {
    return `${this.meno} ${this.priezvisko}`;
  }

}
