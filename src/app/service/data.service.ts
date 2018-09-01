import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, tap, map } from "rxjs/operators";

import { Miesto } from "./../domain/miesto";
import { Ucastnik } from "./../domain/ucastnik";
import { ZaujmovyUtvar } from "./../domain/zaujmovy-utvar";
import { Veduci } from "../domain/veduci";

@Injectable({
  providedIn: "root"
})
export class DataService {

  nadpis: string;
  typNadpisu: string;

  miesta: Miesto[];
  ucastnici: Ucastnik[];
  veduci: Veduci[];
  zaujmoveUtvary: ZaujmovyUtvar[];

  constructor(private httpClient: HttpClient) {}

  // Nadpis

  setNadpis(nadpis: string, typ: string) {
    this.nadpis = nadpis;
    this.typNadpisu = typ;
  }

  // Miesta

  public getMiesta(): Observable<Miesto[]> {
    return this.httpClient.get<Miesto[]>("/assets/mock/miesta.json").pipe(
      map((miesta: Miesto[]) => this.miesta = miesta.map(miesto => new Miesto(miesto))),
      tap(miesta => {
        this.log("miesta nacitane")
      }),
      catchError(this.handleError("getMiesta", []))
    );
  }

  // Ucastnici

  public getUcastnici(): Observable<Ucastnik[]> {
    return this.httpClient.get<Ucastnik[]>("/assets/mock/ucastnici.json").pipe(
      map((ucastnici: Ucastnik[]) => this.ucastnici = ucastnici.map(ucastnik => new Ucastnik(ucastnik))),
      tap(ucastnici => {
        this.log("ucastnici nacitani");
      }),
      catchError(this.handleError("getUcastnici", []))
    );
  }

  // Veduci

  public getVeduci(): Observable<Veduci[]> {
    return this.httpClient.get<Veduci[]>("/assets/mock/veduci.json").pipe(
      map((veduci: Veduci[]) => this.veduci = veduci.map(vodca => new Veduci(vodca))),
      tap(veduci => {
        this.log("veduci nacitani");
      }),
      catchError(this.handleError("getVeduci", []))
    );
  }

  // Zaujmove utvary

  public getZaujmoveUtvary(): Observable<ZaujmovyUtvar[]> {
    return this.httpClient.get<ZaujmovyUtvar[]>("/assets/mock/zaujmove-utvary.json").pipe(
      map((zaujmoveUtvary: ZaujmovyUtvar[]) => this.zaujmoveUtvary = zaujmoveUtvary.map(zaujmovyUtvar => new ZaujmovyUtvar(zaujmovyUtvar))),
      tap(zaujmoveUtvary => {
        this.log("zaujmove utvary nacitane");
      }),
      catchError(this.handleError("getZaujmoveUtvary", []))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
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
