import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryWithoutList } from '../interfaces/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
/*Servicio de catgeoria*/

  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }

  /**
   * Metodo para hacer la peticion y obtener todas las catgeorias
   * @returns  Observable de categorias sin su lista de gameCatgeory
   */
  getAll(): Observable<CategoryWithoutList[]>{
    return this.http.get<CategoryWithoutList[]>(`${this.baseUrl}/categories`)
  }


}
