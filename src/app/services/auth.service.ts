import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User, UserLogin } from '../interfaces/User';
import { Observable, catchError, map, of, take, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ImageService } from './image.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }
  public usernameSignal = signal('');
  public rolSignal = signal('')



  storageUser(resp: any){
    localStorage.setItem('Authorization', resp.token);
    console.log(jwtDecode(resp.token));
    
  }

  renew(){
    const token: any = jwtDecode(localStorage.getItem("Authorization") || '')
    console.log(token.sub);
    this.usernameSignal.update(()=>token.sub)
    this.rolSignal.update(()=>token.role)
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

  signup(user: User): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/signup`, user)
  }

  validateToken(){
    const headers: HttpHeaders = new HttpHeaders().set('Authorization', localStorage.getItem("Authorization") || '')
  }
}
