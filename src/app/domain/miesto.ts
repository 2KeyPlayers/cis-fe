export interface IMiesto {

  id?: string;
  nazov: string;

}

export class Miesto implements IMiesto {

  id: string;
  nazov: string;

  constructor(miesto: IMiesto, id?: string) {
    this.id = (id ? id : miesto.id);
    this.nazov = miesto.nazov;
  }

}
