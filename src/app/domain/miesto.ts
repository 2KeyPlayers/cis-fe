import { Identifikator } from './identifikator';

export interface IMiesto {
  _id?: string;
  nazov: string;
}

export class Miesto implements Identifikator, IMiesto {
  id: string;
  nazov: string;

  constructor(miesto: IMiesto) {
    this.id = miesto._id;
    this.nazov = miesto.nazov;
  }
}
