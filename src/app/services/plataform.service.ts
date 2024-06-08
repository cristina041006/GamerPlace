import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddPlataform, PlataformWithoutList, PlataformWithoutListSend } from '../interfaces/plataform';

@Injectable({
  providedIn: 'root'
})
export class PlataformService {
/**Servicio para las plataformas */

  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }

  /**
   * Metodo para hacer la peticion y devolver todas las plataformas sin su lista de vieojuegos 
   * @returns Observable con una lista de platafromas sin su lista de videojuegos
   */
  getAll(): Observable<PlataformWithoutList[]>{
    return this.http.get<PlataformWithoutList[]>(`${this.baseUrl}/plataform`)
  }

  /**
   * Metodo para hacer la peticion para borrar una plataforma a traves del id pasafo
   * @param id 
   * @returns json con la plataforma borrada
   */
  deletePlataform(id: number):Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deletePlataform/${id}`)
  }

  /**
   * Metodo para hacer la peticion para añadir una nueva plataforma cuyo nombre no
   * exista en la base de datos
   * @param plataform 
   * @returns json con la nueva plataforma
   */
  addPlataform(plataform: AddPlataform): Observable<PlataformWithoutList>{
    return this.http.post<PlataformWithoutList>(`${this.baseUrl}/addPlataform`, plataform);
  }


   /**
   * Metodo para hacer una peticion y editar una plataforma ya existente
   * @param category 
   * @param id 
   * @returns json con la plataforma editada
   */
  editPlataform(plataform: PlataformWithoutListSend, id: number): Observable<PlataformWithoutList>{
    return this.http.put<PlataformWithoutList>(`${this.baseUrl}/editPlataform/${id}`, plataform)
  }



}
