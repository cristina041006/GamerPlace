import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlataformWithoutList } from '../interfaces/plataform';

@Injectable({
  providedIn: 'root'
})
export class PlataformService {

  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }

  getAll(): Observable<PlataformWithoutList[]>{
    return this.http.get<PlataformWithoutList[]>(`${this.baseUrl}/plataform`)
  }

}
