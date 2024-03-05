import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ListPageable, Videogame } from '../../interfaces/videogames';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnInit{
/**Componente donde vamos a cargar el index */

  /**Contructor donde llamaremos al servicio de game */
  constructor(private gameService: GameService){}

  //variable
  games!: Videogame[] //lista de videojuegos recientes
  pageable!: ListPageable //pagebale

  /**
   * Metodo que se ejecutara al cargar el componente y buscara los juegos nuevos mas recientes 
   * de la base de datos
   */
  ngOnInit(): void {

    //Buscamos todos los jeugos
    this.gameService.getAllGame("new").subscribe({
      next: (page)=>{
        //Buscamos los mas recientes
        console.log(page);
        
        this.gameService.getAllGamePage(page.totalPages-1, "new").subscribe({
          next: (game) =>{
            this.games = game.content
          }
        })
      }
    })

  }

}
