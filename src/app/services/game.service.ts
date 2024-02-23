import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListPageable, Videogame } from '../interfaces/videogames';

@Injectable({
  providedIn: 'root'
})
export class GameService {
/*Servicio de videojuego*/

  private baseUrl : string= "http://localhost:8080";
  constructor(private http : HttpClient) { }

  /**
   * Metodo para hacer peticion y obtener un pagebale con videojuegos correspondientes (10)
   * @returns Observable de listPageable
   */
  getAllGame() : Observable<ListPageable>{
    return this.http.get<ListPageable>(this.baseUrl+"/videogames");
  }

  /**
   * Metodo para hacer la peticion y obtener un pageable con los videojuegos correspondientes (10)
   * pero indicandole que pagina queremos mostrar a traves del atributo pageNum
   * @param numPage 
   * @returns Observable de listPageable
   */
  getAllGamePage(numPage: number): Observable<ListPageable> {
    return this.http.get<ListPageable>(this.baseUrl+"/videogames?pageNum="+numPage);
  }

  getAllGamePageSize(numPage: number, pageSize: number): Observable<ListPageable> {
    return this.http.get<ListPageable>(this.baseUrl+"/videogames?pageNum="+numPage+"&pageSize="+pageSize);
  }

  /**
   * Metod para hacer la peticion y obtener uno de los videojuegos segun du id
   * @param id 
   * @returns Observable de videojuego
   */
  getOne(id:string): Observable<Videogame>{
    return this.http.get<Videogame>(`${this.baseUrl}/details/${id}`)
  }

  /**
   * Metodo para hacer la peticion y borrar uno de los videojuegos segun su id
   * @param id 
   * @returns Observable con el videojuego borrado
   */
  deleteGame(id:string): Observable<Videogame>{
    return this.http.delete<Videogame>(`${this.baseUrl}/deleteVideogame/${id}`)
  }

  /**
   * Metodo para hacer la peticion y añadir un videojuego nuevo a la base de datos junto a sus 
   * categorias atraves de un formData
   * @param game 
   * @param file 
   * @param categories 
   * @returns Observable con el juego añadido
   */
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

  /**
   *  Metodo para hacer la peticion y editar un videojuego segun su id junto a sus nuevas o recientes
   * categorias atraves de un formData
   * @param game 
   * @param file 
   * @param categories 
   * @param id 
   * @returns Observable con el videojuego editado
   */
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

  searchGame(name: string): Observable<ListPageable>{
    return this.http.get<ListPageable>(`${this.baseUrl}/getVideogame?name=${name}`)
  }
  searchGamePage(name: string, pageNum: string): Observable<ListPageable>{
    return this.http.get<ListPageable>(`${this.baseUrl}/getVideogame?name=${name}&&pageNum=${pageNum}`)
  }

}
