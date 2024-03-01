import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlataformWithoutList } from '../interfaces/plataform';

@Injectable({
  providedIn: 'root'
})
export class PlataformService {
/**Servicio para las plataformas */

  private baseUrl : string= "https://proyectoapi-cristina041006.onrender.com";
  constructor(private http : HttpClient) { }

  /**
   * Metodo para hacer la peticion y devolver todas las plataformas sin su lista de vieojuegos 
   * @returns Observable con una lista de platafromas sin su lista de videojuegos
   */
  getAll(): Observable<PlataformWithoutList[]>{
    return this.http.get<PlataformWithoutList[]>(`${this.baseUrl}/plataform`)
  }

}
