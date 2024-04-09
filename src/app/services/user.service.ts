import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserGetList, UserWithLogin } from '../interfaces/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
/**Servicio para los usuarios generares  */

  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }

  /**
   * Metodo para a traves de la peticion traer a todos los usuarios
   * normales o vendedores de la base de datos
   * @returns una lista de users
   */
  getAllUser():Observable<UserGetList[]>{
    return this.http.get<UserGetList[]>(`${this.baseUrl}/getAllUser`)
  }

  /**
   * Metodo para a traves de la peticion poder buscar a un usuarios por 
   * su username o por su email que empiecen por un conjuto de palabras
   * @param term 
   * @returns lista de usuarios encontrados
   */
  filterUser(term :string):Observable<UserGetList[]>{
    return this.http.get<UserGetList[]>(`${this.baseUrl}/filterUser?param=${term}`)
  }

  /**
   * Metodo para hacer la peticion y enviar a un usuario un email informandole de que su 
   * cuenta quiere ser cancelada o eliminada y que este la acepte o la rechace
   * @param username 
   * @returns el usuario afectado
   */
  sendCancelledEmail(username: string):Observable<UserWithLogin>{
    return this.http.delete<UserWithLogin>(`${this.baseUrl}/emailDelete/${username}`)
  }

}
