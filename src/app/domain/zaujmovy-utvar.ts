import { Miesto } from './miesto';
import { Den } from './den';
import { Veduci } from './veduci';

/*
{
  "id": 1,
  "nazov": "Dielnicka",
  "veduci": 1,
  "kedyKde": [
    { "den": "Pon", "cas": "14:00", "miesto": 1" },
    { "den": "Str", "cas": "15:00", "miesto": 2 }
}
*/
export class ZaujmovyUtvar {

  id: number;
  ikona?: string;
  nazov: string;
  veduci: Veduci;
  kedyKde: Array<KedyKde>;

  constructor(data: any) {
    this.id = data.id;
    this.ikona = data.ikona;
    this.nazov = data.nazov;
    this.veduci = new Veduci(data.veduci);
    if (data.kedyKde) {
      this.kedyKde = data.kedyKde.map(kk => new KedyKde(kk));
    }
  }

}

class KedyKde {

  den: Den;
  cas: string;
  miesto: Miesto;

  constructor(data: any) {
    this.den = data.den;
    this.cas = data.cas;
    this.miesto = new Miesto(data.miesto);
  }

}