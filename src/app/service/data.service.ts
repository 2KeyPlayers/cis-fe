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

  miestaRef: AngularFireList<IMiesto>;
  ucastniciRef: AngularFireList<IUcastnik>;
  veduciRef: AngularFireList<IVeduci>;
  zaujmoveUtvaryRef: AngularFireList<IZaujmovyUtvar>;

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
    this.miestaRef = this.db.list<IMiesto>('miesta');
    return this.miestaRef.valueChanges().pipe(
      map(
        (data) => {
          this.miesta = data.map(miesto => new Miesto(miesto, miesto.$id));
          this.log('miesta namapovane');
          return this.miesta;
        }
      ),
      tap(_ => {
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.log('miesta nacitane');
      })
      // catchError(this.handleError('getMiesta', []))
    );
  }

  public findMiesto(id: string): Miesto {
    return this.miesta.find(miesto => miesto.$id == id);
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

  public updateMiesto(miesto: Miesto): Promise<void> {
    // return this.httpClient.put<Miesto>('/miesto/nove', miesto, httpOptions).pipe(
    return this.miestaRef.update(miesto.$id, miesto)
      .then(_ => {
        this.log('miesto upravene: ' + miesto.$id);
      })
      .catch(error => this.log(error));
  }

  public deleteMiesto(id: string): Promise<void> {
    return this.miestaRef.remove(id)
      .then(_ => {
        this.miesta = this.miesta.filter(miesto => miesto.$id != id);
        this.log('miesto odstranene: ' + id);
      })
      .catch(error => this.log(error));
  }

  // Veduci

  public getVeduci(aktualizujStatus: boolean = true): Observable<Veduci[]> {
    if (aktualizujStatus)
      this.setStatus(AppStatus.LOADING);

    // return this.httpClient.get<Veduci[]>('assets/mock/veduci.json').pipe(
    this.veduciRef = this.db.list<IVeduci>('veduci');
    return this.veduciRef.valueChanges().pipe(
      map(
        (data) =>
          (this.veduci = data.map(veduci => new Veduci(veduci, veduci.$id)))
      ),
      tap(_ => {
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.log('veduci nacitani');
      })
      // catchError(this.handleError('getVeduci', []))
    );
  }

  public findVeduci(id: string): Veduci {
    return this.veduci.find(vodca => vodca.$id == id);
  }

  // Zaujmove utvary

  public getZaujmoveUtvary(aktualizujStatus: boolean = true): Observable<ZaujmovyUtvar[]> {
    if (aktualizujStatus)
      this.setStatus(AppStatus.LOADING);

    // return this.httpClient.get<ZaujmovyUtvar[]>('assets/mock/zaujmove-utvary.json').pipe(
    this.zaujmoveUtvaryRef = this.db.list<IZaujmovyUtvar>('zaujmove-utvary');
    return this.zaujmoveUtvaryRef.valueChanges().pipe(
      map(
          (data) =>
            (this.zaujmoveUtvary = data.map(zaujmovyUtvar => new ZaujmovyUtvar(zaujmovyUtvar, zaujmovyUtvar.$id)))
      ),
      tap(_ => {
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.log('zaujmove utvary nacitane');
      })
      // catchError(this.handleError('getZaujmoveUtvary', []))
    );
  }

  private appendVeducich() {
    this.zaujmoveUtvary.map(zaujmovyUtvar => {
      let veduci = this.findVeduci(zaujmovyUtvar.veduci.$id);
      zaujmovyUtvar.veduci = veduci;
    });
  }

  // Ucastnici

  public getUcastnici(aktualizujStatus: boolean = true): Observable<Ucastnik[]> {
    if (aktualizujStatus)
      this.setStatus(AppStatus.LOADING);

    // return this.httpClient.get<Ucastnik[]>('assets/mock/ucastnici.json').pipe(
    this.ucastniciRef = this.db.list<IUcastnik>('ucastnici');
    return this.ucastniciRef.valueChanges().pipe(
      map(
        (data) =>
          (this.ucastnici = data.map(ucastnik => new Ucastnik(ucastnik, ucastnik.$id)))
      ),
      tap(_ => {
        if (aktualizujStatus) {
          this.setStatus(AppStatus.OK);
        }
        this.log('ucastnici nacitani');
      })
      // catchError(this.handleError('getUcastnici', []))
    );
  }

  private appendZaujmoveUtvary() {
    this.zaujmoveUtvary.map(zaujmovyUtvar => {
      let veduci = this.findVeduci(zaujmovyUtvar.veduci.$id);
      zaujmovyUtvar.veduci = veduci;
    });
  }

  public loadData(): Observable<boolean> {
    this.log('nahravam data');
    this.setStatus(AppStatus.LOADING);

    return combineLatest(
      this.getMiesta(false),
      this.getVeduci(false),
      this.getZaujmoveUtvary(false)
      // this.getUcastnici(false)
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
  //   return this.http.put(`http://localhost:8082/ims-issues/resources/issues/${issue.$id}`, issue);
  // }

  // public delete(id: number): Observable<any> {
  //   return this.http.delete(`http://localhost:8082/ims-issues/resources/issues/${id}`,
  //     { responseType: 'text' }
  //   );
  // }
}
