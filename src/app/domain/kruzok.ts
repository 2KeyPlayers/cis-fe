export interface IKruzok {

  id: string;
  nazov: string;
  vyskaPoplatku: number;
  poplatky: number;
  
}

export class Kruzok implements IKruzok {

  static BITY = [1, 2, 4, 8, 16, 32, 64, 128, 256];

  id: string;
  nazov: string;
  vyskaPoplatku: number;
  poplatky: number;

  constructor(id: string, nazov?: string) {
    this.id = id;
    this.nazov = nazov;
    this.vyskaPoplatku = 3;
    this.poplatky = 0;
  }

  zmenVyskuPoplatu() {
    this.vyskaPoplatku = (this.vyskaPoplatku + 3) % 12;
    if (this.vyskaPoplatku == 0) {
      this.vyskaPoplatku = 3;
    }
  }

  skontrolujPoplatok(index: number): boolean {
    if (index >= 0 && index < Kruzok.BITY.length) {
      return (this.poplatky & Kruzok.BITY[index]) == Kruzok.BITY[index];
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