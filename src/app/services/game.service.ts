import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListPageable, Videogame } from '../interfaces/videogames';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }


  getAllGame() : Observable<ListPageable>{
    return this.http.get<ListPageable>(this.baseUrl+"/videogames");
  }

  getAllGamePage(numPage: number): Observable<ListPageable> {
    return this.http.get<ListPageable>(this.baseUrl+"/videogames?pageNum="+numPage);
  }

  getOne(id:string): Observable<Videogame>{
    return this.http.get<Videogame>(`${this.baseUrl}/details/${id}`)
  }

  deleteGame(id:string): Observable<Videogame>{
    return this.http.delete<Videogame>(`${this.baseUrl}/deleteVideogame/${id}`)
  }

}
