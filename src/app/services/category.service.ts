import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryWithoutList } from '../interfaces/categories';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }

  getAll(): Observable<CategoryWithoutList[]>{
    return this.http.get<CategoryWithoutList[]>(`${this.baseUrl}/categories`)
  }


}
