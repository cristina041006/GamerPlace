import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { User, UserEdit, UserLogin, UserPasswordEdit, UserWithLogin } from '../interfaces/User';
import { Observable, catchError, map, of, take, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ImageService } from './image.service';
import { Videogame } from '../interfaces/videogames';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
/**Servicio donde vamos a tener todos los metodos relacionados con el usuario */

  private baseUrl : string= "https://proyectoapi-cristina041006.onrender.com";
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
    }else{
      this.usernameSignal.update((a)=>"");
      this.rolSignal.update((a)=>"")
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
   * Metodo para cerrar sesion borrando el 
   * item Authorization del localStorage
   */
  logout(){
    if(localStorage.getItem("Authorization")!=null){
      localStorage.removeItem("Authorization")
      localStorage.removeItem("shop")
      this.renew()
    }
  }

  /**
   * Metodo para poder convertir al usuario loguado
   * en un usuario vendedor y cambiar asi su rol. Se llamara
   * otra vez a renew para actualiar su token
   * @param user 
   * @returns 
   */
  becomeAseller(user: UserLogin): Observable<any|Boolean>{
    return this.http.post<any>(`${this.baseUrl}/seller`, user).pipe(
      tap(resp => {
        this.singin(user).subscribe((response)=>{
          if(response==true){
            this.renew()
          }
        })
      }),
      map(resp=>true),
      catchError(error => of(error))
    )
  }

  /**
   * Metodo que que devuelve los videojuegosque vende un usuario vendedor
   * @param user 
   * @returns 
   */
  getListGameSeller(user: string): Observable<Videogame[]>{
    return this.http.get<Videogame[]>(`${this.baseUrl}/listGames?user=${user}`)
  }


  /**
   * Metodo para validar que el token este en el localStorage y 
   * lo descrifra
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

  /**
   * Metodo que comprueba si hay alguien logueado en la pagina
   * @returns 
   */
  isLogged(){
    return this.validateToken()!=null? true: false
  }

  /**
   * Metodo que comprueba si hay alguien logeado en 
   * la pagina ademas de comporbar que el rol
   * que tiene ese usuario es admin
   * @returns 
   */
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

  /**
   * Metodo que comprueba si hay alguien logeado en 
   * la pagina ademas de comporbar que el rol
   * que tiene ese usuario es userSeller
   * @returns 
   */
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

  /**
   * * Metodo que comprueba si hay alguien logeado en 
   * la pagina ademas de comporbar que el rol
   * que tiene ese usuario es user
   * @returns 
   */
  isUser(){
    const token =this.validateToken()
    if(token!=null){
      this.renew()
      if(this.rolSignal()!="" && this.rolSignal()=="user"){
        return true;
      }else{
        return false;
      }
    }else{
      return false
    }
  }

  getUser():Observable<UserWithLogin>{
    return this.http.get<UserWithLogin>(`${this.baseUrl}/getUser?username=${this.usernameSignal()}`)
  }

  editUser(user : UserEdit):Observable<UserWithLogin>{
    return this.http.put<UserWithLogin>(`${this.baseUrl}/editProfile/${this.usernameSignal()}`, user)
  }

  /**
   * Peticion para modificar la contraseña de un usuario, pasandole la actual, la nueva
   * y el nombre de usuario
   * @param user 
   * @returns un usuario completo actualizado sin la contraseña
   */
  editPassword(user: UserPasswordEdit): Observable<UserWithLogin>{
    return this.http.put<UserWithLogin>(`${this.baseUrl}/editPassword/${this.usernameSignal()}`, user)
  }

}
