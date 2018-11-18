export interface IKruzok {

  id: string;
  nazov: string;
  vyskaPoplatku: number;
  poplatky: number;
  
}

export class Kruzok implements IKruzok {

  static BITS = [1, 2, 4, 8, 16, 32, 64, 128, 256];

  id: string;
  nazov: string;
  vyskaPoplatku: number;
  poplatky: number;

  constructor(id: string, nazov: string) {
    this.id = id;
    this.nazov = nazov;
    this.vyskaPoplatku = 3;
    this.poplatky = 0;
  }

  zmenVyskuPoplatu() {
    // console.log('menim vysku poplatku z ' + this.vyskaPoplatku);
    this.vyskaPoplatku = (this.vyskaPoplatku + 3) % 12;
    if (this.vyskaPoplatku == 0) {
      this.vyskaPoplatku = 3;
    }
  }

  skontrolujPoplatok(index: number): boolean {
    // console.log('kontrolujem poplatok pre ' + index);
    if (index >= 0 && index < Kruzok.BITS.length) {
      // console.log('poplatok je ' + (this.poplatky & Kruzok.BITS[index]));
      return (this.poplatky & Kruzok.BITS[index]) == Kruzok.BITS[index];
    }
    console.log('false');
    return false;
  }

  zmenPoplatok(index: number) {
    console.log('menim poplatok pre ' + index);
    if (index >= 0 && index < Kruzok.BITS.length) {
      this.poplatky = this.poplatky ^ Kruzok.BITS[index];
      console.log('poplatok je ' + this.poplatky);
    }
  }

  farbaPoplatku(index: number): string {
    // console.log('zistujem farbu poplatku pre ' + index + ': ' + this.skontrolujPoplatok(index));
    return this.skontrolujPoplatok(index) ? 'green' : '';
  }

}