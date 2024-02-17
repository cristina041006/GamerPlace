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

  addNewGame(game: Omit<Videogame, "idVideogame" | "quality" | "namePlataform" | "idUser" | "username" | "deletGame" | "listCategory" | "image">, file: File, categories: String[]): Observable<Videogame>{
    const formData: FormData = new FormData();
    formData.append('image', file);
    const blobGame = new Blob([JSON.stringify(game)], {
      type: 'application/json'
    })
    const blobCategories = new Blob([JSON.stringify(categories)], {
      type: 'application/json'
    })
    formData.append('videogame', blobGame);
    formData.append('categories', blobCategories);
    return this.http.post<Videogame>(`${this.baseUrl}/addVideogame`, formData);
  }

  editGame(game: Omit<Videogame, "quality" | "namePlataform" | "idUser" | "username" | "deletGame" | "listCategory" | "image">, file: File, categories: String[], id: string): Observable<Videogame>{
    const formData: FormData = new FormData();
    formData.append('image', file);
    const blobGame = new Blob([JSON.stringify(game)], {
      type: 'application/json'
    })
    const blobCategories = new Blob([JSON.stringify(categories)], {
      type: 'application/json'
    })
    formData.append('videogame', blobGame);
    formData.append('categories', blobCategories);
    return this.http.put<Videogame>(`${this.baseUrl}/editVideogame/${id}`, formData);
  }

}
