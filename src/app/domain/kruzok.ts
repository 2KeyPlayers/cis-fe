import { Identifikator } from './identifikator';

export interface IKruzok {
  _id?: any;
  nazov: string;
  vyskaPoplatku?: number;
  poplatky?: number;
}

export class Kruzok implements Identifikator, IKruzok {
  static BITY = [1, 2, 4, 8, 16, 32, 64, 128, 256];

  id: any;
  nazov: string;
  vyskaPoplatku: number;
  poplatky: number;

  constructor(kruzok: IKruzok) {
    this.id = kruzok._id;
    this.nazov = kruzok.nazov;
    this.vyskaPoplatku = kruzok.vyskaPoplatku ? kruzok.vyskaPoplatku : 3;
    this.poplatky = kruzok.poplatky ? kruzok.poplatky : 0;
  }

  get _id(): any {
    return this.id;
  }

  set _id(id: any) {
    this.id = id;
  }

  zmenVyskuPoplatu() {
    this.vyskaPoplatku = (this.vyskaPoplatku + 3) % 12;
    if (this.vyskaPoplatku === 0) {
      this.vyskaPoplatku = 3;
    }
  }

  skontrolujPoplatok(index: number): boolean {
    if (index >= 0 && index < Kruzok.BITY.length) {
      return (this.poplatky & Kruzok.BITY[index]) === Kruzok.BITY[index];
    }
    console.log('false');
    return false;
  }

  zmenPoplatok(index: number) {
    if (index >= 0 && index < Kruzok.BITY.length) {
      this.poplatky = this.poplatky ^ Kruzok.BITY[index];
    }
  }

  farbaPoplatku(index: number): string {
    return this.skontrolujPoplatok(index) ? 'green' : 'basic';
  }
}
