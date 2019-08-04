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
    return this.status == AppStatus.OK;
  }

  get loading(): boolean {
    return this.status == AppStatus.LOADING;
  }

  get failed(): boolean {
    return this.status == AppStatus.FAILED;
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
    this.zaujmoveUtvaryCollection = this.db.collection('utvary');
  }

  // Autentifikacia

  get uzivatelPrihlaseny(): boolean {
    return this.klient.auth.isLoggedIn;
  }

  prihlasenie(email: string, heslo: string): Promise<StitchUser> {
    const credential = new UserPasswordCredential(email, heslo);
    return this.klient.auth.loginWithCredential(credential);
    // .then(authedUser => {
    //   console.log(`uzivatel uspesne prihlaseny: ${authedUser.id}`);
    //   this.uzivatel = authedUser;
    // })
    // .catch(err => console.error(`prihlasenie zlyhalo: ${err}`));
  }

  potvrdenieEmailu(): Promise<void> {
    Stitch.initializeDefaultAppClient('cvrcek-anlki');
    // Parse the URL query parameters
    const url = window.location.search;
    const params = new URLSearchParams(url);
    const token = params.get('token');
    const tokenId = params.get('tokenId');

    // Confirm the user's email/password account
    const klient = Stitch.defaultAppClient.auth
        .getProviderClient(UserPasswordAuthProviderClient.factory);

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
    const klient = Stitch.defaultAppClient.auth
      .getProviderClient(UserPasswordAuthProviderClient.factory);

    return klient.resetPassword(token, tokenId, heslo);
    // .then(() => {
    //   console.log('heslo uspesne zmenene');
    // }).catch(err => {
    //   console.log("Error resetting password:", err);
    // });
  }

  // Miesta

  public getMiesta(aktualizujStatus: boolean = true): Promise<Miesto[]> {
    if (aktualizujStatus) { this.setStatus(AppStatus.LOADING); }

    return this.miestaCollection.find({}).asArray()
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
        // catchError(this.handleError('getMiesta', []))
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
    return this.db.collection('miesta').insertOne(miesto)
      .then(data => {
        miesto.id = data.insertedId;
        this.log('miesto pridane: ' + data.insertedId);
      });
  }

  public async updateMiesto(miesto: Miesto): Promise<void> {
    const query = { "name": "legos" };
    const update = {
      "$set": {
        "name": "blocks",
        "price": 20.99,
        "category": "toys"
      }
    };
    const options = { "upsert": false };

    this.miestaCollection.updateOne(query, update, options)
      .then(result => {
        const { matchedCount, modifiedCount } = result;
        if(matchedCount && modifiedCount) {
          console.log(`Successfully updated the item.`)
        }
      })
      .catch(err => console.error(`Failed to update the item: ${err}`))
          return .updateOne(miesto.id, miesto as IMiesto)
      .then(data => {
        miesto.id = data.insertedId;
        this.log('miesto upravne: ' + data.insertedId);
      });
      // .catch(error => this.log(error));
  }

  public async deleteMiesto(id: string): Promise<void> {
    // TODO: !!!
    // this.miesta = this.miesta.filter(miesto => miesto.id != id);
    // this.log('miesto odstranene: ' + id);
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     this.log('prazdny promise');
    //     resolve();
    //   }, 500);
    // });
    return this.miestaRef
      .remove(id)
      .then(_ => {
        this.miesta = this.miesta.filter(miesto => miesto.id != id);
        this.log('miesto odstranene: ' + id);
      })
      .catch(error => this.log(error));
  }

  // Veduci

  public getVeduci(aktualizujStatus: boolean = true): Observable<Veduci[]> {
    if (aktualizujStatus) this.setStatus(AppStatus.LOADING);

    // return this.httpClient.get<Veduci[]>('assets/mock/veduci.json').pipe(
    this.veduciRef = this.db.list<any>('veduci');
    return this.veduciRef.snapshotChanges().pipe(
      map(data => (this.veduci = data.map(vodca => new Veduci(vodca.payload.val(), vodca.payload.key)))),
      tap(_ => {
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.sortVeduci();
        this.log('veduci nacitani');
      })
      // catchError(this.handleError('getVeduci', []))
    );
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
    return this.veduci.find(vodca => vodca.id == id);
  }

  public checkVeduci(id: string, meno: string, priezvisko: string): boolean {
    if (!this.veduci) {
      return true;
    }
    let vodca = this.veduci.find(vodca => vodca.celeMeno == meno + ' ' + priezvisko);
    if (!vodca) {
      return true;
    } else {
      return vodca.id == id;
    }
  }

  public insertVeduci(veduci: Veduci): PromiseLike<void> {
    return this.veduciRef
      .push({
        titul: veduci.titul,
        meno: veduci.meno,
        priezvisko: veduci.priezvisko
      })
      .then(data => {
        this.log('veduci pridany: ' + data.key);
      });
  }

  public async updateVeduci(veduci: Veduci): Promise<void> {
    return this.veduciRef
      .update(veduci.id, {
        titul: veduci.titul,
        meno: veduci.meno,
        priezvisko: veduci.priezvisko
      })
      .then(_ => {
        this.log('veduci upraveny: ' + veduci.id);
      })
      .catch(error => this.log(error));
  }

  public async deleteVeduci(id: string): Promise<void> {
    return this.veduciRef
      .remove(id)
      .then(_ => {
        this.veduci = this.veduci.filter(vodca => vodca.id != id);
        this.log('veduci odstraneny: ' + id);
      })
      .catch(error => this.log(error));
  }

  // Zaujmove utvary

  public getZaujmoveUtvary(aktualizujStatus: boolean = true): Observable<ZaujmovyUtvar[]> {
    if (aktualizujStatus) this.setStatus(AppStatus.LOADING);

    // return this.httpClient.get<ZaujmovyUtvar[]>('assets/mock/zaujmove-utvary.json').pipe(
    this.zaujmoveUtvaryRef = this.db.list<any>('zaujmove-utvary');
    return this.zaujmoveUtvaryRef.snapshotChanges().pipe(
      map(
        data =>
          (this.zaujmoveUtvary = data.map(
            zaujmovyUtvar => new ZaujmovyUtvar(zaujmovyUtvar.payload.val(), zaujmovyUtvar.payload.key)
          ))
      ),
      tap(_ => {
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.sortZaujmoveUtvary();
        this.log('zaujmove utvary nacitane');
      })
      // catchError(this.handleError('getZaujmoveUtvary', []))
    );
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
    return this.zaujmoveUtvary.find(zaujmovyUtvar => zaujmovyUtvar.id == id);
  }

  public checkZaujmovyUtvar(id: string, nazov: string): boolean {
    if (!this.zaujmoveUtvary) {
      return true;
    }
    let zaujmovyUtvar = this.zaujmoveUtvary.find(zaujmovyUtvar => zaujmovyUtvar.nazov == nazov);
    if (!zaujmovyUtvar) {
      return true;
    } else {
      return zaujmovyUtvar.id == id;
    }
  }

  public insertZaujmovyUtvar(zaujmovyUtvar: ZaujmovyUtvar): PromiseLike<void> {
    return this.zaujmoveUtvaryRef
      .push({
        // ikona: zaujmovyUtvar.ikona,
        nazov: zaujmovyUtvar.nazov,
        veduci: {
          id: zaujmovyUtvar.veduci
        }
      })
      .then(data => {
        this.log('zaujmovy utvar pridany: ' + data.key);
      });
  }

  public async updateZaujmovyUtvar(zaujmovyUtvar: ZaujmovyUtvar): Promise<void> {
    return this.zaujmoveUtvaryRef
      .update(zaujmovyUtvar.id, {
        // ikona: zaujmovyUtvar.ikona,
        nazov: zaujmovyUtvar.nazov,
        veduci: {
          id: zaujmovyUtvar.veduci
        }
      })
      .then(_ => {
        this.log('zaujmovy utvar upraveny: ' + zaujmovyUtvar.id);
      })
      .catch(error => this.log(error));
  }

  public async deleteZaujmovyUtvar(id: string): Promise<void> {
    return this.zaujmoveUtvaryRef
      .remove(id)
      .then(_ => {
        this.zaujmoveUtvary = this.zaujmoveUtvary.filter(zaujmovyUtvar => zaujmovyUtvar.id != id);
        this.log('zaujmovy utvar odstraneny: ' + id);
      })
      .catch(error => this.log(error));
  }

  private appendVeducich() {
    this.zaujmoveUtvary.forEach(zaujmovyUtvar => {
      // TODO: was .map before
      let veduci = this.findVeduci(zaujmovyUtvar.veduci.id);
      zaujmovyUtvar.veduci = veduci;
    });
  }

  // Ucastnici

  public getUcastnici(aktualizujStatus: boolean = true): Observable<Ucastnik[]> {
    if (aktualizujStatus) this.setStatus(AppStatus.LOADING);

    // return this.httpClient.get<Ucastnik[]>('assets/mock/ucastnici.json').pipe(
    this.ucastniciRef = this.db.list<any>('ucastnici');
    return this.ucastniciRef.snapshotChanges().pipe(
      map(data => (this.ucastnici = data.map(ucastnik => new Ucastnik(ucastnik.payload.val(), ucastnik.payload.key)))),
      tap(_ => {
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.sortUcastnici();
        this.log('ucastnici nacitani');
      })
      // catchError(this.handleError('getUcastnici', []))
    );
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
    let cislo: string = Math.max.apply(Math, this.ucastnici.map(ucastnik => ucastnik.cislo));
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
    return this.ucastnici.find(ucastnik => ucastnik.id == id);
  }

  public checkUcastnikoveCislo(id: string, cislo: string): boolean {
    if (!this.ucastnici) {
      return true;
    }
    let ucastnik = this.ucastnici.find(ucastnik => ucastnik.cislo == cislo);
    if (!ucastnik) {
      return true;
    }
    return ucastnik.id == id;
  }

  public checkUcastnik(id: string, meno: string, priezvisko: string, datum?: string): boolean {
    if (!this.ucastnici) {
      return true;
    }
    let ucastnik = this.ucastnici.find(ucastnik => ucastnik.celeMeno == meno + ' ' + priezvisko);
    if (!ucastnik) {
      return true;
    } else {
      if (ucastnik.datumNarodenia != datum) {
        return true;
      }
      return ucastnik.id == id;
    }
  }

  private getUcastnikoveKruzky(kruzky: IKruzok[]): Array<any> {
    let ucastnikoveKruzky = null;
    if (kruzky) {
      ucastnikoveKruzky = new Array<any>();
      kruzky.forEach(kruzok =>
        ucastnikoveKruzky.push({
          id: kruzok.id,
          vyskaPoplatku: kruzok.vyskaPoplatku,
          poplatky: kruzok.poplatky
        })
      );
    }
    return ucastnikoveKruzky;
  }

  public insertUcastnik(ucastnik: Ucastnik, kruzky: IKruzok[]): PromiseLike<void> {
    return this.ucastniciRef
      .push({
        cislo: ucastnik.cislo,
        pohlavie: ucastnik.pohlavie,
        meno: ucastnik.meno,
        priezvisko: ucastnik.priezvisko,
        datumNarodenia: ucastnik.datumNarodenia,
        skola: ucastnik.skola,
        trieda: ucastnik.trieda,
        adresa: {
          ulica: ucastnik.adresa.ulica,
          cislo: ucastnik.adresa.cislo,
          mesto: ucastnik.adresa.mesto,
          psc: ucastnik.adresa.psc
        },
        zastupca: ucastnik.zastupca,
        telefon: ucastnik.telefon,
        kruzky: this.getUcastnikoveKruzky(kruzky)
      })
      .then(data => {
        this.log('ucastnik pridany: ' + data.key);
      });
  }

  public async updateUcastnik(ucastnik: Ucastnik, kruzky: IKruzok[]): Promise<void> {
    return this.ucastniciRef
      .update(ucastnik.id, {
        cislo: ucastnik.cislo,
        pohlavie: ucastnik.pohlavie,
        meno: ucastnik.meno,
        priezvisko: ucastnik.priezvisko,
        datumNarodenia: ucastnik.datumNarodenia,
        skola: ucastnik.skola,
        trieda: ucastnik.trieda,
        adresa: {
          ulica: ucastnik.adresa.ulica,
          cislo: ucastnik.adresa.cislo,
          mesto: ucastnik.adresa.mesto,
          psc: ucastnik.adresa.psc
        },
        zastupca: ucastnik.zastupca,
        telefon: ucastnik.telefon,
        kruzky: this.getUcastnikoveKruzky(kruzky)
      })
      .then(_ => {
        this.log('ucastnik upraveny: ' + ucastnik.id);
      })
      .catch(error => this.log(error));
  }

  public async deleteUcastnik(id: string): Promise<void> {
    return this.ucastniciRef
      .remove(id)
      .then(_ => {
        this.ucastnici = this.ucastnici.filter(ucastnik => ucastnik.id != id);
        this.log('ucastnik odstraneny: ' + id);
      })
      .catch(error => this.log(error));
  }

  private appendNazvyKruzkov() {
    this.ucastnici.forEach(ucastnik => {
      // TODO: was .map before
      if (ucastnik.kruzky) {
        ucastnik.kruzky.forEach(kruzok => {
          let zaujmovyUtvar = this.findZaujmovyUtvar(kruzok.id);
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

  // public getAll(): Observable<Array<User>> {
  //   return this.http.get<Array<User>>('http://localhost:8081/ims-users/resources/users');
  // }

  // public get(id: number): Observable<User> {
  //   return this.http.get<User>(`http://localhost:8081/ims-users/resources/users/${id}`);
  // }

  // public getAll(): Observable<Array<Issue>> {
  //   return this.http.get<Array<Issue>>('http://localhost:8082/ims-issues/resources/issues', {
  //       headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`)
  //   });
  // }

  // public get(id: number): Observable<any> {
  //   return this.http.get(`http://localhost:8082/ims-issues/resources/issues/${id}`);
  // }

  // public getComments(id: number): Observable<any> {
  //   return this.http.get(`http://localhost:8083/ims-comments/resources/comments/${id}`);
  // }

  // public addComment(id: number, comment: Comment) : Observable<any> {
  //   return this.http.post(`http://localhost:8083/ims-comments/resources/comments/${id}`, comment ,
  //     { responseType: 'text' }
  //   );
  // }

  // public add(issue: Issue): Observable<any> {
  //   return this.http.post('http://localhost:8082/ims-issues/resources/issues', issue
  //   // ,
  //     // { responseType: 'text' }
  //   );
  // }

  // public update(issue: Issue): Observable<any> {
  //   return this.http.put(`http://localhost:8082/ims-issues/resources/issues/${issue.id}`, issue);
  // }

  // public delete(id: number): Observable<any> {
  //   return this.http.delete(`http://localhost:8082/ims-issues/resources/issues/${id}`,
  //     { responseType: 'text' }
  //   );
  // }
}
