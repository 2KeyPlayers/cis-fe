export interface Platba {
  suma: number;
  datum: string;
  uzivatel: number; // ID Uzivatela
}

export class Kruzok {
  id: number;
  nazov: string;
  poplatok: number;
  stav: string;
  platby: Platba[];

  constructor(kruzok: Kruzok) {
    this.id = kruzok.id;
    this.nazov = kruzok.nazov;
    this.poplatok = kruzok.poplatok;
    this.stav = kruzok.stav;
    this.platby = kruzok.platby;
  }

  // zmenVyskuPoplatu() {
  //   this.vyskaPoplatku = (this.vyskaPoplatku + 3) % 12;
  //   if (this.vyskaPoplatku === 0) {
  //     this.vyskaPoplatku = 3;
  //   }
  // }

  // skontrolujPoplatok(index: number): boolean {
  //   if (index >= 0 && index < Kruzok.BITY.length) {
  //     return (this.poplatky & Kruzok.BITY[index]) === Kruzok.BITY[index];
  //   }
  //   console.log('false');
  //   return false;
  // }

  // zmenPoplatok(index: number) {
  //   if (index >= 0 && index < Kruzok.BITY.length) {
  //     this.poplatky = this.poplatky ^ Kruzok.BITY[index];
  //   }
  // }

  // farbaPoplatku(index: number): string {
  //   return this.skontrolujPoplatok(index) ? 'green' : 'basic';
  // }
}
