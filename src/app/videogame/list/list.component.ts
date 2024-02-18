import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ListPageable, Videogame } from '../../interfaces/videogames';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{
/**Componente donde listaremos los videojuegos */

  /**Contructor donde inyectaremos el servicio del juego */
  constructor(private gameService: GameService){}
  
  //Variables
  pageable!: ListPageable //Donde almacenaremos el pageable
  games : Videogame[] = [] //Donde almacenaremos los juegos
  numberSequence : number[] =[] //Secuencia de nuemeros para el paginado

  /**
   * Metodo que se ejutara cada vez que carguemos la pagina y los hara una pericion
   * Par recoger todos los videojeugos
   */
  ngOnInit(): void {
    this.gameService.getAllGame().subscribe({
      next: (page) => {
        //Si todo va bien añadimos a las variables los juegos y el paginado
        this.pageable = page
        this.games = page.content
        //Calculamos la secuencia de numero para que solo nos aparezcan 5 numeros a partir de donde etsoy
        for(let i=1; i<page.pageable.pageNumber+6; i++){
          this.numberSequence.push(i);
        }
        
      }
    })

  }

  /**
   * Metodo para pasar de pagina y hc¡acer la peticion 
   * @param numPage 
   */
  nexPage(numPage: number){
    //Hacemos la peticion    
    this.gameService.getAllGamePage(numPage).subscribe({
      next: (page)=>{
        //Si todo va bien vovlemos a poner los datos en sus variables correspondientes
        this.numberSequence = [];
        this.pageable=page;
        this.games= page.content

        /**
         * Calculamos la secuencia de nuemros segun:
         * Estamos en la primera pagina: Se mosyraran numeros del 1 al 5
         * Estamos en una pagina cualquiera: se mistrara nuemeros desde el nuemro
         * anterior al cual estamos y cinco mas
         * Estamos en las ultimas paginas: Se mostrarn 5 numeros menos de en la que estas
         */
        if(page.pageable.pageNumber==0){
          for(let i=1; i<page.pageable.pageNumber+6; i++){
            this.numberSequence.push(i);
          }
        }else if(numPage+5<=page.totalPages){
          for(let i=page.pageable.pageNumber; i<page.pageable.pageNumber+6; i++){
            this.numberSequence.push(i);
          }
        }else{
          for(let i=page.pageable.pageNumber; i<page.totalPages+1; i++){
            this.numberSequence.push(i);
          }
        }
      }
    })
  }


}
