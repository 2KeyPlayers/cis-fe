/*
{
  "id": 1,
  "titul": "Mgr.",
  "meno": "Janko",
  "priezvisko": "Hrasko",
}
*/
export class Veduci {

  id: number;
  titul?: string;
  meno: string;
  priezvisko: string;

  constructor(data: any) {
    this.id = data.id;
    this.titul = data.titul;
    this.meno = data.meno;
    this.priezvisko = data.priezvisko;
  }
}
