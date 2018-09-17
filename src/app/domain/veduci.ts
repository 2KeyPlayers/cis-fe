export class Veduci {

  id: number;
  titul?: string;
  meno: string;
  priezvisko: string;

  constructor(data: any) {
    this.id = data.id;
    this.titul = data.titul;
    this.meno = data.meno;
    this.priezvisko = data.priezvisko;
  }

  get celeMeno(): string {
    return `${this.meno} ${this.priezvisko}`;
  }

}
