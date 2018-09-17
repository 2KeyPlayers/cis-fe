export class Miesto {

  id: number;
  nazov: string;

  constructor(data: any) {
    this.id = data.id;
    this.nazov = data.nazov;
  }

}
