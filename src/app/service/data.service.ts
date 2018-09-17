import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Miesto } from './../domain/miesto';
import { Ucastnik } from './../domain/ucastnik';
import { ZaujmovyUtvar } from './../domain/zaujmovy-utvar';
import { Veduci } from '../domain/veduci';

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

  miesta: Miesto[];
  ucastnici: Ucastnik[];
  veduci: Veduci[];
  zaujmoveUtvary: ZaujmovyUtvar[];

  constructor(private httpClient: HttpClient) {
    this.status = AppStatus.OK;
  }

  // Nadpis

  setNadpis(nadpis: string, typ: string) {
    this.nadpis = nadpis;
    this.typNadpisu = typ;
  }

  // Miesta

  public getMiesta(aktualizujStatus: boolean = true): Observable<Miesto[]> {
    this.status = AppStatus.LOADING;

    return this.httpClient.get<Miesto[]>('assets/mock/miesta.json').pipe(
      map((miesta: Miesto[]) => this.miesta = miesta.map(miesto => new Miesto(miesto))),
      tap(miesta => {
        if (aktualizujStatus) {
          this.status = AppStatus.OK;
        }
        this.log('miesta nacitane');
      }),
      catchError(this.handleError('getMiesta', []))
    );
  }

  // Veduci

  public getVeduci(aktualizujStatus: boolean = true): Observable<Veduci[]> {
    this.status = AppStatus.LOADING;

    return this.httpClient.get<Veduci[]>('assets/mock/veduci.json').pipe(
      map((veduci: Veduci[]) => this.veduci = veduci.map(vodca => new Veduci(vodca))),
      tap(veduci => {
        if (aktualizujStatus) {
          this.status = AppStatus.OK;
        }
        this.log('veduci nacitani');
      }),
      catchError(this.handleError('getVeduci', []))
    );
  }

  public findVeduci(id: number): Veduci {
    return this.veduci.find(vodca => vodca.id == id);
  }

  // Zaujmove utvary

  public getZaujmoveUtvary(aktualizujStatus: boolean = true): Observable<ZaujmovyUtvar[]> {
    this.status = AppStatus.LOADING;

    return this.httpClient.get<ZaujmovyUtvar[]>('assets/mock/zaujmove-utvary.json').pipe(
      map((zaujmoveUtvary: ZaujmovyUtvar[]) => this.zaujmoveUtvary = zaujmoveUtvary.map(zaujmovyUtvar => new ZaujmovyUtvar(zaujmovyUtvar))),
      tap(zaujmoveUtvary => {
        if (aktualizujStatus) {
          this.status = AppStatus.OK;
        }
        this.log('zaujmove utvary nacitane');
      }),
      catchError(this.handleError('getZaujmoveUtvary', []))
    );
  }

  private appendVeducich() {
    this.zaujmoveUtvary.map(zaujmovyUtvar => {
      let veduci = this.findVeduci(zaujmovyUtvar.veduci.id);
      zaujmovyUtvar.veduci = veduci;
    });
  }

  // Ucastnici

  public getUcastnici(aktualizujStatus: boolean = true): Observable<Ucastnik[]> {
    this.status = AppStatus.LOADING;

    return this.httpClient.get<Ucastnik[]>('assets/mock/ucastnici.json').pipe(
      map((ucastnici: Ucastnik[]) => this.ucastnici = ucastnici.map(ucastnik => new Ucastnik(ucastnik))),
      tap(ucastnici => {
        if (aktualizujStatus) {
          this.status = AppStatus.OK;
        }
        this.log('ucastnici nacitani');
      }),
      catchError(this.handleError('getUcastnici', []))
    );
  }

  public loadData(): Observable<boolean> {
    this.status = AppStatus.LOADING;

    return forkJoin(
      this.getMiesta(false),
      this.getVeduci(false),
      this.getZaujmoveUtvary(false),
      this.getUcastnici(false)
    ).pipe(
      catchError(this.handleError('loadData', false)),
      map(vysledok => {
        this.status = AppStatus.OK;

        // this.miesta = vysledok[0].map(miesto => new Miesto(miesto));
        // this.veduci = vysledok[1].map(vodca => new Veduci(vodca));
        // this.zaujmoveUtvary = vysledok[2].map(zaujmovyUtvar => new ZaujmovyUtvar(zaujmovyUtvar));
        // this.ucastnici = vysledok[3].map(ucastnik => new Ucastnik(ucastnik));
        
        this.appendVeducich();

        return true;
      })
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    this.status = AppStatus.FAILED;

    return (error: any): Observable<T> => {
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
