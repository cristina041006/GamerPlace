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
/**Servicio donde vamos a tener todos los metodos relacionados con el usuario */

  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }
  public usernameSignal = signal('');
  public rolSignal = signal('')



  /**
   * Metodo para almacenar el token del uauario en el localStorage
   * @param resp 
   */
  storageUser(resp: any){
    localStorage.setItem('Authorization', resp.token);
    console.log(jwtDecode(resp.token));
    
  }

  /**
   * Metodo para recuperar el token del localStorage desencriptarlo y rellenar las variables
   * del username y rol
   */
  renew(){
    if(localStorage.getItem("Authorization")!=null){
      const token: any = jwtDecode(localStorage.getItem("Authorization") || '')
      if(token!=''){
        this.usernameSignal.update((a)=>token.sub)
        this.rolSignal.update((a)=>token.role)
      }
    }
    
  }

  /**
   * Metodo para que un usuario se pueda loguear, si la respuesta es correcta llamamos al metodo 
   * que almacena el token, si no mandamos un error
   * @param userLogin 
   * @returns 
   */
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

  /**
   * Metoto para poder registrar un nuevo uauruario
   * @param user 
   * @returns 
   */
  signup(user: User): Observable<User>{
    return this.http.post<User>(`${this.baseUrl}/signup`, user)
  }

  /**
   * Metodo
   * @returns 
   */
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
