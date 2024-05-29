import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddPlataform, PlataformWithoutList } from '../interfaces/plataform';

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

  addPlataform(plataform: AddPlataform): Observable<PlataformWithoutList>{
    return this.http.post<PlataformWithoutList>(`${this.baseUrl}/addPlataform`, plataform);
  }


}
