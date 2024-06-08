import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FavoriteAdd } from '../interfaces/favorite';
import { Observable, map } from 'rxjs';
import { Videogame } from '../interfaces/videogames';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
/**Servicio de favoritos */

private baseUrl : string= "http://localhost:8080";
constructor(private http : HttpClient) { }

/**
 * Peticion para añadir un videojuego a la lista de favoritos de un usuario
 * @param favorite 
 * @returns json con el favorito
 */
addFavorite(favorite: FavoriteAdd): Observable<FavoriteAdd>{
  return this.http.post<FavoriteAdd>(`${this.baseUrl}/addFavorite`, favorite);
}

/**
 * Peticion para borrar un videojuego de la lista de favoritos de un usuario
 * @param idVideogame 
 * @param username 
 * @returns json con el favortio borrado
 */
deleteFavorite(idVideogame: number, username:string): Observable<FavoriteAdd>{
  return this.http.delete<FavoriteAdd>(`${this.baseUrl}/deleteFavorite/${username}?idVideogame=${idVideogame}`)
}

/**
 * Peticion para traer todos los videojuegos favoritos de un usuario 
 * @param username 
 * @returns json con los videojuegos favoritos
 */
getFavorites(username: string): Observable<Videogame[]>{
  return this.http.get<Videogame[]>(`${this.baseUrl}/getFavorites/${username}`)
}

/**
 * Peticion para saber si un videojuego esta en la lista 
 * de favoritos de un usuario
 * @param username 
 * @param idVideogame 
 * @returns true si esta false si no
 */
foundFavorite(username: string, idVideogame: number): Observable<boolean>{
  return this.http.get<FavoriteAdd[]>(`${this.baseUrl}/findFavorite/${username}?idVideogame=${idVideogame}`)
  .pipe(
    map(resp=> (resp.length != 0) ? true: false)
  )
}

}
