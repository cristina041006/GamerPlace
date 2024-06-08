import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FavoriteAdd } from '../interfaces/favorite';
import { FavoriteService } from '../services/favorite.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Videogame } from '../interfaces/videogames';

@Component({
  selector: 'app-favoriteList',
  standalone: true,
  templateUrl: './favoriteList.component.html',
  imports: [CommonModule, FormsModule, RouterLink],
  styleUrls: ['./favoriteList.component.css']
})
export class FavoriteListComponent implements OnInit {
/**Componente para listar los juegos favoritos del usuario logueado */

/**Costructor llamando a los servicios */
  constructor(private authService: AuthService, private favoriteService: FavoriteService) { }

  //Variables
  username: any = this.authService.usernameSignal //Usuario logueado
  favorites: Videogame[] = [] //Donde almacenaremos los videojuegos

  /**
   * Metodo que se ejecutara al iniciarse el componente y que se tarera todos los videojuegos favoritos del
   * usuario logueado
   */
  ngOnInit() {
    if(this.username()!=""){
      this.favoriteService.getFavorites(this.username()).subscribe({
        next: (favoritesList) =>{
          this.favorites = favoritesList;
        }
      })
    }

  }

}
