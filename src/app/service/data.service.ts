import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import {
  Stitch,
  RemoteMongoClient,
  RemoteMongoDatabase,
  StitchAppClient,
  UserPasswordCredential,
  StitchUser,
  UserPasswordAuthProviderClient,
  RemoteMongoCollection
} from 'mongodb-stitch-browser-sdk';

import { Miesto, IMiesto } from './../domain/miesto';
import { Kruzok, IKruzok } from './../domain/kruzok';
import { Ucastnik, IUcastnik } from './../domain/ucastnik';
import { ZaujmovyUtvar, IZaujmovyUtvar } from './../domain/zaujmovy-utvar';
import { Veduci, IVeduci } from '../domain/veduci';

// const httpOptions = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
// };

export enum AppStatus {
  OK = 0,
  LOADING = 1,
  FAILED = 2
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  status: AppStatus;

  nadpis: string;
  typNadpisu: string;

  uzivatel: StitchUser;
  klient: StitchAppClient;
  db: RemoteMongoDatabase;

  miestaCollection: RemoteMongoCollection<IMiesto>;
  ucastniciCollection: RemoteMongoCollection<IUcastnik>;
  veduciCollection: RemoteMongoCollection<IVeduci>;
  zaujmoveUtvaryCollection: RemoteMongoCollection<IZaujmovyUtvar>;

  miesta: Miesto[];
  ucastnici: Ucastnik[];
  veduci: Veduci[];
  zaujmoveUtvary: ZaujmovyUtvar[];

  constructor() {
    this.status = AppStatus.OK;
  }

  public setStatus(status: AppStatus) {
    this.status = status;
    // TODO: error/warn if FAILED
    this.log('novy status: ' + this.status);
  }

  get ok(): boolean {
    return this.status === AppStatus.OK;
  }

  get loading(): boolean {
    return this.status === AppStatus.LOADING;
  }

  get failed(): boolean {
    return this.status === AppStatus.FAILED;
  }

  // Nadpis

  setNadpis(nadpis: string, typ: string): void {
    this.nadpis = nadpis;
    this.typNadpisu = typ;
  }

  // Stitch

  initDB() {
    this.klient = Stitch.initializeDefaultAppClient('cvrcek-anlki');
    this.db = this.klient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('databaza');

    this.miestaCollection = this.db.collection('miesta');
    this.ucastniciCollection = this.db.collection('ucastnici');
    this.veduciCollection = this.db.collection('veduci');
    this.zaujmoveUtvaryCollection = this.db.collection('zaujmove-utvary');
  }

  // Autentifikacia

  get uzivatelPrihlaseny(): boolean {
    return this.klient.auth.isLoggedIn;
  }

  prihlasenie(email: string, heslo: string): Promise<StitchUser> {
    const credential = new UserPasswordCredential(email, heslo);
    return this.klient.auth.loginWithCredential(credential);
  }

  odhlasenie(): Promise<void> {
    return this.klient.auth.logout();
  }

  potvrdenieEmailu(): Promise<void> {
    Stitch.initializeDefaultAppClient('cvrcek-anlki');
    // Parse the URL query parameters
    const url = window.location.search;
    const params = new URLSearchParams(url);
    const token = params.get('token');
    const tokenId = params.get('tokenId');

    // Confirm the user's email/password account
    const klient = Stitch.defaultAppClient.auth.getProviderClient(UserPasswordAuthProviderClient.factory);

    return klient.confirmUser(token, tokenId);
  }

  obnovaHesla(email: string): Promise<void> {
    const klient = this.klient.auth.getProviderClient(UserPasswordAuthProviderClient.factory);

    return klient.sendResetPasswordEmail(email);
    // .then(() => {
    //   console.log('e-mail na obnovu hesla uspesne odoslany');
    // }).catch(err => {
    //   console.log('chyba pri odosielani e-mailu na obnovu hesla:', err);
    // });
  }

  zmenaHesla(heslo: string): Promise<void> {
    // Parse the URL query parameters
    const url = window.location.search;
    const params = new URLSearchParams(url);

    const token = params.get('token');
    const tokenId = params.get('tokenId');

    // Confirm the user's email/password account
    const klient = Stitch.defaultAppClient.auth.getProviderClient(UserPasswordAuthProviderClient.factory);

    return klient.resetPassword(token, tokenId, heslo);
    // .then(() => {
    //   console.log('heslo uspesne zmenene');
    // }).catch(err => {
    //   console.log("chyba pri zmene hesla:", err);
    // });
  }

  // Miesta

  public getMiesta(aktualizujStatus: boolean = true): Promise<Miesto[]> {
    if (aktualizujStatus) {
      this.setStatus(AppStatus.LOADING);
    }

    return this.miestaCollection
      .find({})
      .asArray()
      .then(data => data.map(miesto => new Miesto(miesto)))
      .then(data => {
        this.log('miesta nacitane');
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.miesta = data;
        this.sortMiesta();
        return this.miesta;
      });
    // catchError(this.handleError('getMiesta', []));
  }

  public sortMiesta() {
    if (this.miesta) {
      this.miesta.sort((m1, m2) => (m1.nazov > m2.nazov ? 1 : -1));
    }
  }

  public findMiesto(id: string): Miesto {
    if (!this.miesta) {
      return null;
    }
    return this.miesta.find(miesto => miesto.id === id);
  }

  public checkMiesto(id: string, nazov: string): boolean {
    if (!this.miesta) {
      return true;
    }
    const miesto = this.miesta.find(m => m.nazov === nazov);
    if (!miesto) {
      return true;
    } else {
      return miesto.id === id;
    }
  }

  // find the largest used ID
  // let newId: number = Math.max.apply(Math, this.miesta.map(miesto => miesto.id)) + 1;

  public insertMiesto(miesto: Miesto): PromiseLike<void> {
    return this.miestaCollection
      .insertOne(miesto)
      .then(data => {
        miesto.id = data.insertedId;
        this.log('miesto pridane: ' + data.insertedId);
      });
    // .catch(err => console.error(`chyba pri vkladani mesta: ${err}`));
  }

  public updateMiesto(miesto: Miesto): Promise<void> {
    const query = { _id: miesto.id };
    const update = {
      $set: {
        nazov: miesto.nazov
      }
    };
    const options = { upsert: false };

    return this.miestaCollection.updateOne(query, update, options).then(result => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log('miesto uspesne upravene' + miesto.id);
      }
    });
    // .catch(err => console.error(`chyba pri aktualizacii mesta: ${err}`));
  }

  public deleteMiesto(miesto: Miesto): Promise<void> {
    return this.miestaCollection.deleteOne({ _id: miesto.id }).then(() => {
      this.miesta = this.miesta.filter(m => m.id !== miesto.id);
      this.log('miesto odstranene: ' + miesto.id);
    });
    // .catch(err => console.error(`chyba pri mazani mesta: ${err}`));
  }

  // Veduci

  public getVeduci(aktualizujStatus: boolean = true): Promise<Veduci[]> {
    if (aktualizujStatus) {
      this.setStatus(AppStatus.LOADING);
    }

    return this.veduciCollection
      .find({})
      .asArray()
      .then(data => data.map(veduci => new Veduci(veduci)))
      .then(data => {
        this.log('veduci nacitani');
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.veduci = data;
        this.sortVeduci();
        return this.veduci;
      });
    // catchError(this.handleError('getVeduci', []));
  }

  public sortVeduci() {
    if (this.veduci) {
      this.veduci.sort((v1, v2) => {
        if (v1.priezvisko > v2.priezvisko) {
          return 1;
        } else if (v1.priezvisko < v2.priezvisko) {
          return -1;
        } else {
          if (v1.meno > v2.meno) {
            return 1;
          } else if (v1.meno < v2.meno) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    }
  }

  public findVeduci(id: string): Veduci {
    if (!this.veduci) {
      return null;
    }
    return this.veduci.find(vodca => vodca.id === id);
  }

  public checkVeduci(id: string, meno: string, priezvisko: string): boolean {
    if (!this.veduci) {
      return true;
    }
    const vodca = this.veduci.find(v => v.celeMeno === meno + ' ' + priezvisko);
    if (!vodca) {
      return true;
    } else {
      return vodca.id === id;
    }
  }

  public insertVeduci(veduci: Veduci): PromiseLike<void> {
    return this.veduciCollection
      .insertOne(veduci)
      .then(data => {
        veduci.id = data.insertedId;
        this.log('veduci pridany: ' + data.insertedId);
      });
      // .catch(err => console.error(`chyba pri vkladani veduceho: ${err}`));
  }

  public async updateVeduci(veduci: Veduci): Promise<void> {
    const query = { _id: veduci.id };
    const update = {
      $set: {
        titul: veduci.titul,
        meno: veduci.meno,
        priezvisko: veduci.priezvisko
      }
    };
    const options = { upsert: false };

    return this.veduciCollection.updateOne(query, update, options).then(result => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log('veduci uspesne upraveny' + veduci.id);
      }
    });
    // .catch(err => console.error(`chyba pri aktualizacii veduceho: ${err}`));
  }

  public async deleteVeduci(veduci: Veduci): Promise<void> {
    return this.veduciCollection.deleteOne({ _id: veduci.id }).then(() => {
      this.veduci = this.veduci.filter(v => v.id !== veduci.id);
      this.log('miesto odstranene: ' + veduci.id);
    });
    // .catch(err => console.error(`chyba pri mazani veduceho: ${err}`));
  }

  // Zaujmove utvary

  public getZaujmoveUtvary(aktualizujStatus: boolean = true): Promise<ZaujmovyUtvar[]> {
    if (aktualizujStatus) {
      this.setStatus(AppStatus.LOADING);
    }

    return this.zaujmoveUtvaryCollection
      .find({})
      .asArray()
      .then(data => data.map(utvar => new ZaujmovyUtvar(utvar)))
      .then(data => {
        this.log('zaujmove utvary nacitane');
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.zaujmoveUtvary = data;
        this.sortZaujmoveUtvary();
        return this.zaujmoveUtvary;
      });
    // catchError(this.handleError('getZaujmoveUtvary', []));
  }

  public sortZaujmoveUtvary() {
    if (this.zaujmoveUtvary) {
      this.zaujmoveUtvary.sort((zu1, zu2) => {
        if (zu1.nazov > zu2.nazov) {
          return 1;
        } else if (zu1.nazov < zu2.nazov) {
          return -1;
        } else {
          return 0;
        }
      });
    }
  }

  public findZaujmovyUtvar(id: string): ZaujmovyUtvar {
    if (!this.zaujmoveUtvary) {
      return null;
    }
    return this.zaujmoveUtvary.find(zaujmovyUtvar => zaujmovyUtvar.id === id);
  }

  public checkZaujmovyUtvar(id: string, nazov: string): boolean {
    if (!this.zaujmoveUtvary) {
      return true;
    }
    const zaujmovyUtvar = this.zaujmoveUtvary.find(zu => zu.nazov === nazov);
    if (!zaujmovyUtvar) {
      return true;
    } else {
      return zaujmovyUtvar.id === id;
    }
  }

  public insertZaujmovyUtvar(zaujmovyUtvar: ZaujmovyUtvar): PromiseLike<void> {
    return this.zaujmoveUtvaryCollection
      .insertOne(zaujmovyUtvar)
      .then(data => {
        zaujmovyUtvar.id = data.insertedId;
        this.log('zaujmovy utvar pridany: ' + data.insertedId);
      });
      // .catch(err => console.error(`chyba pri vkladani zaujmoveho utvaru: ${err}`));
  }

  public async updateZaujmovyUtvar(zaujmovyUtvar: ZaujmovyUtvar): Promise<void> {
    const query = { _id: zaujmovyUtvar.id };
    const update = {
      $set: {
        // ikona: zaujmovyUtvar.ikona,
        nazov: zaujmovyUtvar.nazov,
        veduci: {
          id: zaujmovyUtvar.veduci
        }
      }
    };
    const options = { upsert: false };

    return this.veduciCollection.updateOne(query, update, options).then(result => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log('zaujmovy utvar uspesne upraveny' + zaujmovyUtvar.id);
      }
    });
  }

  public deleteZaujmovyUtvar(zaujmovyUtvar: ZaujmovyUtvar): Promise<void> {
    return this.zaujmoveUtvaryCollection.deleteOne({ _id: zaujmovyUtvar.id }).then(() => {
      this.miesta = this.miesta.filter(zu => zu.id !== zaujmovyUtvar.id);
      this.log('zaujmovy utvar odstraneny: ' + zaujmovyUtvar.id);
    });
    // .catch(err => console.error(`chyba pri mazani zaujmoveho utvaru: ${err}`));
  }

  private appendVeducich() {
    this.zaujmoveUtvary.forEach(zaujmovyUtvar => {
      // TODO: was .map before
      const veduci = this.findVeduci(zaujmovyUtvar.veduci.id);
      zaujmovyUtvar.veduci = veduci;
    });
  }

  // Ucastnici

  public getUcastnici(aktualizujStatus: boolean = true): Promise<Ucastnik[]> {
    if (aktualizujStatus) {
      this.setStatus(AppStatus.LOADING);
    }

    return this.ucastniciCollection
      .find({})
      .asArray()
      .then(data => data.map(ucastnik => new Ucastnik(ucastnik)))
      .then(data => {
        this.log('ucastnici nacitani');
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.ucastnici = data;
        this.sortUcastnici();
        return this.ucastnici;
      });
    // catchError(this.handleError('getUcastnici', []));
  }

  public sortUcastnici() {
    if (this.ucastnici) {
      this.ucastnici.sort((u1, u2) => {
        if (u1.cislo > u2.cislo) {
          return 1;
        } else if (u1.cislo < u2.cislo) {
          return -1;
        } else {
          return 0;
        }
        // if (u1.priezvisko > u2.priezvisko) {
        //   return 1;
        // } else if (u1.priezvisko < u2.priezvisko) {
        //   return -1;
        // } else {
        //   if (u1.meno > u2.meno) {
        //     return 1;
        //   } else if (u1.meno < u2.meno) {
        //     return -1;
        //   } else {
        //     return 0;
        //   }
        // }
      });
    }
  }

  public getNasledujuceCisloUcastnika(): string {
    if (!this.ucastnici) {
      return '001';
    }
    const cislo: string = Math.max.apply(Math, this.ucastnici.map(ucastnik => ucastnik.cislo));
    return this.zmenCisloUcasnika(cislo, 1);
  }

  public zmenCisloUcasnika(cisloUcasnika: string, hodnota: number): string {
    let cislo: number = Number(cisloUcasnika);
    cislo = cislo + hodnota;
    return cislo.toString().padStart(3, '0');
  }

  public findUcastnik(id: string): Ucastnik {
    if (!this.ucastnici) {
      return null;
    }
    return this.ucastnici.find(ucastnik => ucastnik.id === id);
  }

  public checkUcastnikoveCislo(id: string, cislo: string): boolean {
    if (!this.ucastnici) {
      return true;
    }
    const ucastnik = this.ucastnici.find(u => u.cislo === cislo);
    if (!ucastnik) {
      return true;
    }
    return ucastnik.id === id;
  }

  public checkUcastnik(id: string, meno: string, priezvisko: string, datum?: string): boolean {
    if (!this.ucastnici) {
      return true;
    }
    const ucastnik = this.ucastnici.find(u => u.celeMeno === meno + ' ' + priezvisko);
    if (!ucastnik) {
      return true;
    } else {
      if (ucastnik.datumNarodenia !== datum) {
        return true;
      }
      return ucastnik.id === id;
    }
  }

  private getUcastnikoveKruzky(kruzky: IKruzok[]): Array<any> {
    let ucastnikoveKruzky = null;
    if (kruzky) {
      ucastnikoveKruzky = new Array<any>();
      kruzky.forEach(kruzok =>
        ucastnikoveKruzky.push({
          id: kruzok._id,
          vyskaPoplatku: kruzok.vyskaPoplatku,
          poplatky: kruzok.poplatky
        })
      );
    }
    return ucastnikoveKruzky;
  }

  // public insertUcastnik(ucastnik: Ucastnik, kruzky: IKruzok[]): PromiseLike<void> {
  public insertUcastnik(ucastnik: Ucastnik): PromiseLike<void> {
    // ucastnik.kruzky = this.getUcastnikoveKruzky(kruzky);
    return this.veduciCollection
      .insertOne(ucastnik)
      .then(data => {
        ucastnik.id = data.insertedId;
        this.log('ucastnik pridany: ' + data.insertedId);
      });
      // .catch(err => console.error(`chyba pri vkladani ucastnika: ${err}`));
  }

  // public async updateUcastnik(ucastnik: Ucastnik, kruzky: IKruzok[]): Promise<void> {
  public async updateUcastnik(ucastnik: Ucastnik): Promise<void> {
    // ucastnik.kruzky = this.getUcastnikoveKruzky(kruzky);
    const query = { _id: ucastnik.id };
    const update = {
      $set: {
        cislo: ucastnik.cislo,
        pohlavie: ucastnik.pohlavie,
        meno: ucastnik.meno,
        priezvisko: ucastnik.priezvisko,
        datumNarodenia: ucastnik.datumNarodenia,
        skola: ucastnik.skola,
        trieda: ucastnik.trieda,
        adresa: ucastnik.adresa,
        // adresa: {
        //   ulica: ucastnik.adresa.ulica,
        //   cislo: ucastnik.adresa.cislo,
        //   mesto: ucastnik.adresa.mesto,
        //   psc: ucastnik.adresa.psc
        // },
        zastupca: ucastnik.zastupca,
        telefon: ucastnik.telefon,
        kruzky: ucastnik.kruzky
      }
    };
    const options = { upsert: false };

    return this.ucastniciCollection.updateOne(query, update, options).then(result => {
      const { matchedCount, modifiedCount } = result;
      if (matchedCount && modifiedCount) {
        console.log('ucastnik uspesne upraveny' + ucastnik.id);
      }
    });
    // .catch(err => console.error(`chyba pri aktualizacii veduceho: ${err}`));
  }

  public async deleteUcastnik(ucastnik: Ucastnik): Promise<void> {
    return this.ucastniciCollection.deleteOne({ _id: ucastnik.id }).then(() => {
      this.miesta = this.miesta.filter(m => m.id !== ucastnik.id);
      this.log('ucastnik odstraneny: ' + ucastnik.id);
    });
    // .catch(err => console.error(`chyba pri mazani ucastnika: ${err}`));
  }

  private appendNazvyKruzkov() {
    this.ucastnici.forEach(ucastnik => {
      // TODO: was .map before
      if (ucastnik.kruzky) {
        ucastnik.kruzky.forEach(kruzok => {
          const zaujmovyUtvar = this.findZaujmovyUtvar(kruzok.id);
          kruzok.nazov = zaujmovyUtvar.nazov;
        });
      }
    });
  }

  public loadData(): Observable<boolean> {
    this.log('nahravam data');
    this.setStatus(AppStatus.LOADING);

    return combineLatest(
      this.getMiesta(false),
      this.getVeduci(false),
      this.getZaujmoveUtvary(false),
      this.getUcastnici(false)
    ).pipe(
      // map(([res1, res2, res3]) => {
      map(() => {
        this.log('pridavam dodatocne data');
        this.appendVeducich();
        this.appendNazvyKruzkov();
        // this.appendZaujmoveUtvary();
        // this.appendUcastnici();

        this.setStatus(AppStatus.OK);

        return true;
      }),
      catchError(this.handleError('loadData', false))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.setStatus(AppStatus.FAILED);

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(message);
  }
}
