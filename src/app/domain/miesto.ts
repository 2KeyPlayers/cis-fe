import { Identifikator } from './identifikator';

export interface IMiesto {
  _id?: any;
  nazov: string;
}

export class Miesto implements Identifikator, IMiesto {
  id: any;
  nazov: string;

  constructor(miesto: IMiesto) {
    this.id = miesto._id;
    this.nazov = miesto.nazov;
  }

  get _id(): any {
    return this.id;
  }

  set _id(id: any) {
    this.id = id;
  }
}
