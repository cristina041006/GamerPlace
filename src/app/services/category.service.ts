import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryAdd, CategoryWithoutList, CategoryWithoutListSend } from '../interfaces/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
/*Servicio de catgeoria*/

  private baseUrl : string= "https://proyectoapi-cristina041006.onrender.com";
  constructor(private http : HttpClient) { }

  /**
   * Metodo para hacer la peticion y obtener todas las catgeorias
   * @returns  Observable de categorias sin su lista de gameCatgeory
   */
  getAll(): Observable<CategoryWithoutList[]>{
    return this.http.get<CategoryWithoutList[]>(`${this.baseUrl}/categories`)
  }

  /**
   * Metodo para hacer la peticion y borrar una categoria en concreto dependiendo
   * de su id
   * @param id 
   * @returns 
   */
  deleteCategory(id: number):Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/deleteCategory/${id}`)
  }

  /**
   * Metodo para hacer una peticion y editar una categoria ya existente
   * @param category 
   * @param id 
   * @returns json con la catgeoria editada
   */
  editCategory(category: CategoryWithoutListSend, id:number): Observable<CategoryWithoutListSend>{
    return this.http.put<CategoryWithoutListSend>(`${this.baseUrl}/editCategory/${id}`, category)
  }

  /**
   * Metodo para hacer una peticion y añadir una nueva categoria a la base de datos
   * @param category 
   * @returns json con la nueva categoria
   */
  addCategory(category: CategoryAdd): Observable<CategoryWithoutList>{
    return this.http.post<CategoryWithoutList>(`${this.baseUrl}/addCategory`, category);
  }


}
