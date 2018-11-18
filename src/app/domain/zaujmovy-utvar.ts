import { Miesto, IMiesto } from './miesto';
import { EDen } from './den';
import { Veduci, IVeduci } from './veduci';

export interface IZaujmovyUtvar {

  id: string;
  ikona?: string;
  nazov: string;
  veduci: any;
  // idVeduceho: string;
  // kedyKde?: Array<IKedyKde>;
  
}

export class ZaujmovyUtvar implements IZaujmovyUtvar {

  id: string;
  ikona?: string;
  nazov: string;
  veduci: IVeduci;
  // idVeduceho: string;
  // kedyKde?: Array<KedyKde>;

  constructor(zaujmovyUtvar: IZaujmovyUtvar, id?: string) {
    this.id = (id ? id : zaujmovyUtvar.id);
    this.ikona = zaujmovyUtvar.ikona;
    this.nazov = zaujmovyUtvar.nazov;
    if (zaujmovyUtvar.veduci) {
      this.veduci = new Veduci(zaujmovyUtvar.veduci);
    }
    // if (zaujmovyUtvar.idVeduceho) {
    //   this.veduci = {
    //     id : this.idVeduceho,
    //     meno: null,
    //     priezvisko: null
    //   }
    // }
    // if (zaujmovyUtvar.kedyKde) {
    //   this.kedyKde = zaujmovyUtvar.kedyKde.map(kk => new KedyKde(kk));
    // }
  }

}

// interface IKedyKde {

//   id?: string;
//   den: EDen;
//   cas: string;
//   miesto: IMiesto;

// }

// class KedyKde implements IKedyKde {

//   den: EDen;
//   cas: string;
//   miesto: IMiesto;

//   constructor(data: any) {
//     this.den = data.den;
//     this.cas = data.cas;
//     this.miesto = new Miesto(data.miesto);
//   }

// }