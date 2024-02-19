import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from '../interfaces/User';
import { Observable, catchError, map, of, take, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }

  storageUser(resp: any){
    localStorage.setItem('Authorization', resp.token);
    console.log(jwtDecode(resp.token));
    
  }


  singin(userLogin: UserLogin): Observable<string|Boolean>{
    return this.http.post<any>(`${this.baseUrl}/signin`, userLogin)
    .pipe(
      tap(resp => {
        this.storageUser(resp)
      }),
      map(resp=>true),
      catchError(error => of(error))
    )
  }

  validateToken(){
    const headers: HttpHeaders = new HttpHeaders().set('Authorization', localStorage.getItem("Authorization") || '')
  }
}
