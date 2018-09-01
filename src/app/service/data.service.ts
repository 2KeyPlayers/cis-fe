import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Miesto } from './../domain/miesto';
import { Ucastnik } from './../domain/ucastnik';
import { ZaujmovyUtvar } from './../domain/zaujmovy-utvar';
import { Veduci } from '../domain/veduci';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  miesta: Array<Miesto>;
  ucastnici: Array<Ucastnik>;
  veduci: Array<Veduci>;
  zaujmoveUtvary: Array<ZaujmovyUtvar>;

  constructor(private httpClient: HttpClient) {
 
  }

  public getMiesta(): Observable<Array<Miesto>> {
    return this.httpClient.get<Array<Miesto>>('/assets/mock/miesta.json');
  }

  public getUcastnici(): Observable<Array<Ucastnik>> {
    return this.httpClient.get<Array<Ucastnik>>('/assets/mock/ucastnici.json');
  }

  public getVeduci(): Observable<Array<Veduci>> {
    return this.httpClient.get<Array<Veduci>>('/assets/mock/veduci.json');
  }

  public getZaujmoveUtvary(): Observable<Array<ZaujmovyUtvar>> {
    return this.httpClient.get<Array<ZaujmovyUtvar>>('/assets/mock/zaujmove-utvary.json');
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
