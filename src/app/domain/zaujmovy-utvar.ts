// import { Miesto, IMiesto } from './miesto';
// import { EDen } from './den';
import { Veduci, IVeduci } from './veduci';
import { Identifikator } from './identifikator';

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

export interface IZaujmovyUtvar {
  _id?: string;
  ikona?: string;
  nazov: string;
  veduci: IVeduci;
  // idVeduceho: string;
  // kedyKde?: Array<IKedyKde>;
}

export class ZaujmovyUtvar implements Identifikator, IZaujmovyUtvar {
  id: string;
  ikona?: string;
  nazov: string;
  veduci: Veduci;
  // idVeduceho: string;
  // kedyKde?: Array<KedyKde>;

  constructor(zaujmovyUtvar: IZaujmovyUtvar) {
    this.id = zaujmovyUtvar._id;
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
