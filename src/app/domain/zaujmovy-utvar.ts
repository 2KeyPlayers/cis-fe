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

}

class KedyKde {
  den: Den;
  cas: string;
  miesto: Miesto;
}