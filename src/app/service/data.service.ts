import { Injectable, OnInit } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';

import { Miesto, IMiesto } from './../domain/miesto';
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
export class DataService implements OnInit {
  status: AppStatus;

  nadpis: string;
  typNadpisu: string;

  miestaRef: AngularFireList<any>;
  ucastniciRef: AngularFireList<any>;
  veduciRef: AngularFireList<any>;
  zaujmoveUtvaryRef: AngularFireList<any>;

  miesta: Miesto[];
  ucastnici: Ucastnik[];
  veduci: Veduci[];
  zaujmoveUtvary: ZaujmovyUtvar[];

  // constructor(private httpClient: HttpClient) {
  constructor(private db: AngularFireDatabase) {
    this.status = AppStatus.OK;
  }

  ngOnInit(): void {
    this.log('initializujem referencie');
  }

  public setStatus(status: AppStatus) {
    this.status = status;
    //TODO: error/warn if FAILED
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

  // Miesta

  public getMiesta(aktualizujStatus: boolean = true): Observable<Miesto[]> {
    if (aktualizujStatus)
      this.setStatus(AppStatus.LOADING);

    // return this.httpClient.get<Miesto[]>('assets/mock/miesta.json').pipe(
    this.miestaRef = this.db.list<any>('miesta');
    return this.miestaRef.snapshotChanges().pipe(
      map(
        (data) => (this.miesta = data.map(miesto => new Miesto(miesto.payload.val(), miesto.payload.key)))
      ),
      tap(_ => {
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.sortMiesta();
        this.log('miesta nacitane');
      })
      // catchError(this.handleError('getMiesta', []))
    );
  }

  public sortMiesta() {
    if (this.miesta) {
      this.miesta.sort((m1, m2) => {
        if (m1.nazov > m2.nazov) {
          return 1;
        } else if (m1.nazov < m2.nazov) {
          return -1;
        } else {
          return 0;
        }
      });
    }
  }

  public findMiesto(id: string): Miesto {
    if (!this.miesta) {
      return null;
    }
    return this.miesta.find(miesto => miesto.id == id);
  }

  public checkMiesto(id: string, nazov: string): boolean {
    if (!this.miesta) {
      return true;
    }
    let miesto = this.miesta.find(miesto => miesto.nazov == nazov);
    if (!miesto) {
      return true;
    } else {
      return miesto.id == id;
    }
  }

  // find the largest used ID
  // let newId: number = Math.max.apply(Math, this.miesta.map(miesto => miesto.id)) + 1;

  public insertMiesto(miesto: Miesto): PromiseLike<void> {
    // return this.httpClient.put<Miesto>('/miesto/nove', miesto, httpOptions).pipe(
    return this.miestaRef
      .push({
        nazov: miesto.nazov 
      })
      .then(data => {
        this.log('miesto pridane: ' + data.key);
      });
  }

  public async updateMiesto(miesto: Miesto): Promise<void> {
    // return this.httpClient.put<Miesto>('/miesto/nove', miesto, httpOptions).pipe(
    return this.miestaRef.update(miesto.id, {
      nazov: miesto.nazov
    })
    .then(_ => {
      this.log('miesto upravene: ' + miesto.id);
    })
    .catch(error => this.log(error));
  }

  public async deleteMiesto(id: string): Promise<void> {
    //TODO: !!!
    // this.miesta = this.miesta.filter(miesto => miesto.id != id);
    // this.log('miesto odstranene: ' + id);
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     this.log('prazdny promise');
    //     resolve();
    //   }, 500);
    // });
    return this.miestaRef.remove(id)
      .then(_ => {
        this.miesta = this.miesta.filter(miesto => miesto.id != id);
        this.log('miesto odstranene: ' + id);
      })
      .catch(error => this.log(error));
  }

  // Veduci

  public getVeduci(aktualizujStatus: boolean = true): Observable<Veduci[]> {
    if (aktualizujStatus)
      this.setStatus(AppStatus.LOADING);

    // return this.httpClient.get<Veduci[]>('assets/mock/veduci.json').pipe(
    this.veduciRef = this.db.list<any>('veduci');
    return this.veduciRef.snapshotChanges().pipe(
      map(
        (data) => (this.veduci = data.map(vodca => new Veduci(vodca.payload.val(), vodca.payload.key)))
      ),
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
    let vodca = this.veduci.find(vodca => vodca.celeMeno == (meno + ' ' + priezvisko));
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
    return this.veduciRef.update(veduci.id, {
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
    return this.veduciRef.remove(id)
      .then(_ => {
        this.veduci = this.veduci.filter(vodca => vodca.id != id);
        this.log('veduci odstraneny: ' + id);
      })
      .catch(error => this.log(error));
  }

  // Zaujmove utvary

  public getZaujmoveUtvary(aktualizujStatus: boolean = true): Observable<ZaujmovyUtvar[]> {
    if (aktualizujStatus)
      this.setStatus(AppStatus.LOADING);

    // return this.httpClient.get<ZaujmovyUtvar[]>('assets/mock/zaujmove-utvary.json').pipe(
    this.zaujmoveUtvaryRef = this.db.list<any>('zaujmove-utvary');
    return this.zaujmoveUtvaryRef.snapshotChanges().pipe(
      map(
        (data) => (this.zaujmoveUtvary = data.map(zaujmovyUtvar => new ZaujmovyUtvar(zaujmovyUtvar.payload.val(), zaujmovyUtvar.payload.key)))
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
    return this.zaujmoveUtvaryRef.update(zaujmovyUtvar.id, {
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
    return this.zaujmoveUtvaryRef.remove(id)
      .then(_ => {
        this.zaujmoveUtvary = this.zaujmoveUtvary.filter(zaujmovyUtvar => zaujmovyUtvar.id != id);
        this.log('zaujmovy utvar odstraneny: ' + id);
      })
      .catch(error => this.log(error));
  }

  private appendVeducich() {
    this.zaujmoveUtvary.map(zaujmovyUtvar => {
      let veduci = this.findVeduci(zaujmovyUtvar.veduci.id);
      zaujmovyUtvar.veduci = veduci;
    });
  }

  // Ucastnici

  public getUcastnici(aktualizujStatus: boolean = true): Observable<Ucastnik[]> {
    if (aktualizujStatus)
      this.setStatus(AppStatus.LOADING);

    // return this.httpClient.get<Ucastnik[]>('assets/mock/ucastnici.json').pipe(
    this.ucastniciRef = this.db.list<any>('ucastnici');
    return this.ucastniciRef.snapshotChanges().pipe(
      map(
        (data) => (this.ucastnici = data.map(ucastnik => new Ucastnik(ucastnik.payload.val(), ucastnik.payload.key)))
      ),
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
    let ucastnik = this.ucastnici.find(ucastnik => ucastnik.celeMeno == (meno + ' ' + priezvisko));
    if (!ucastnik) {
      return true;
    } else {
      if (ucastnik.datumNarodenia != datum) {
        return true;
      }
      return ucastnik.id == id;
    }
  }

  public insertUcastnik(ucastnik: Ucastnik): PromiseLike<void> {
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
        telefon: ucastnik.telefon
      })
      .then(data => {
        this.log('ucastnik pridany: ' + data.key);
      });
  }

  public async updateUcastnik(ucastnik: Ucastnik): Promise<void> {
    return this.ucastniciRef.update(ucastnik.id, {
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
      telefon: ucastnik.telefon
    })
    .then(_ => {
      this.log('ucastnik upraveny: ' + ucastnik.id);
    })
    .catch(error => this.log(error));
  }

  public async deleteUcastnik(id: string): Promise<void> {
    return this.ucastniciRef.remove(id)
      .then(_ => {
        this.ucastnici = this.ucastnici.filter(ucastnik => ucastnik.id != id);
        this.log('ucastnik odstraneny: ' + id);
      })
      .catch(error => this.log(error));
  }

  private appendZaujmoveUtvary() {
    this.zaujmoveUtvary.map(zaujmovyUtvar => {
      let veduci = this.findVeduci(zaujmovyUtvar.veduci.id);
      zaujmovyUtvar.veduci = veduci;
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
