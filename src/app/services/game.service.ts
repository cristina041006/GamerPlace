import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListPageable, Videogame } from '../interfaces/videogames';

@Injectable({
  providedIn: 'root'
})
export class GameService {
/*Servicio de videojuego*/

  private baseUrl : string= "https://proyectoapi-cristina041006.onrender.com";
  constructor(private http : HttpClient) { }

  /**
   * Metodo para hacer peticion y obtener un pagebale con videojuegos correspondientes (10)
   * @returns Observable de listPageable
   */
  getAllGame(quality: string) : Observable<ListPageable>{
    return this.http.get<ListPageable>(this.baseUrl+"/videogames?quality="+quality);
  }

  /**
   * Metodo para hacer la peticion y obtener un pageable con los videojuegos correspondientes (10)
   * pero indicandole que pagina queremos mostrar a traves del atributo pageNum
   * @param numPage 
   * @returns Observable de listPageable
   */
  getAllGamePage(numPage: number, quality: string): Observable<ListPageable> {
    return this.http.get<ListPageable>(this.baseUrl+"/videogames?pageNum="+numPage+"&quality="+quality);
  }

  getAllGamePageSize(numPage: number, pageSize: number, quality: string): Observable<ListPageable> {
    return this.http.get<ListPageable>(this.baseUrl+"/videogames?pageNum="+numPage+"&pageSize="+pageSize+"&quality="+quality);
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
  addNewGame(game: Omit<Videogame, "idVideogame" | "quality" | "namePlataform" | "idUser" | "username" | "deletGame" | "listCategory">, categories: String[]): Observable<Videogame>{
    const formData: FormData = new FormData();
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
  editGame(game: Omit<Videogame, "quality" | "namePlataform" | "idUser" | "username" | "deletGame" | "listCategory">, categories: String[], id: string): Observable<Videogame>{
    const formData: FormData = new FormData();
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

  /**
   * Metodo para poder buscar un juego a partir de un 
   * conjunto de letras enviadas devolviendo una lista paginada
   * @param name 
   * @returns 
   */
  searchGame(name: string): Observable<ListPageable>{
    return this.http.get<ListPageable>(`${this.baseUrl}/getVideogame?name=${name}`)
  }

  /**
   *  Metodo para poder buscar un juego a partir de un 
   * conjunto de letras y elegir en la pagina que quieres estar devolviendo una lista paginada
   * @param name 
   * @param pageNum 
   * @returns 
   */
  searchGamePage(name: string, pageNum: string): Observable<ListPageable>{
    return this.http.get<ListPageable>(`${this.baseUrl}/getVideogame?name=${name}&&pageNum=${pageNum}`)
  }

  /**
   * Metodo para buscar un juego por su catgeoria devolviendo una lista paginada
   * @param idCatgeory 
   * @param quality 
   * @returns 
   */
  getGameByCategory(idCatgeory:string, quality: string): Observable<ListPageable>{
    return this.http.get<ListPageable>(`${this.baseUrl}/videogames?idCategory=${idCatgeory}&&quality=${quality}`)
  }

  /**
   * Metodo para buscar un juego por su catgeoria pudiendo elegir
   * en la pagina que quieres estra devolviendo una lista paginada
   * @param idCatgeory 
   * @param quality 
   * @param numPage 
   * @returns 
   */
  getGameByCategoryPage(idCatgeory:string, quality: string, numPage: string): Observable<ListPageable>{
    return this.http.get<ListPageable>(`${this.baseUrl}/videogames?idCategory=${idCatgeory}&&quality=${quality}&&pageNum=${numPage}`)
  }

}
