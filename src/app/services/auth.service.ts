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
    if(localStorage.getItem("Authorization")!=null){
      const token: any = jwtDecode(localStorage.getItem("Authorization") || '')
      if(token!=''){
        this.usernameSignal.update((a)=>token.sub)
        this.rolSignal.update((a)=>token.role)
      }
    }
    
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
    const token = localStorage.getItem("Authorization");
    if(token){
      return jwtDecode(token)
    }else{
      return null;
    }
  }

  isLogged(){
    return this.validateToken()!=null? true: false
  }
  isAdmin(){
    const token =this.validateToken()
    if(token!=null){
      this.renew()
      if(this.rolSignal()!="" && this.rolSignal()=="admin"){
        return true;
      }else{
        return false;
      }
    }else{
      return false
    }
  }
  isSeller(){
    const token =this.validateToken()
    if(token!=null){
      this.renew()
      if(this.rolSignal()!="" && this.rolSignal()=="userSeller"){
        return true;
      }else{
        return false;
      }
    }else{
      return false
    }
  }

}
