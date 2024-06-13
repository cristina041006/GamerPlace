import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ListPageable, Videogame } from '../../interfaces/videogames';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { SearchComponent } from '../../shared/nabvar/search/search.component';
import { CategoryService } from '../../services/category.service';
import { CategoryWithoutList } from '../../interfaces/categories';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, SearchComponent, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{
/**Componente donde listaremos los videojuegos */

  /**Contructor donde inyectaremos el servicio del juego */
  constructor(private gameService: GameService, private categoryService: CategoryService){}

  @Input() filter!: string //variable rescatada desde el nabvar cuando estamos buscando
  @Input() second!: string //variable rescatada desde las rutas para saber si debemso listar los juegos nuevos o de segunda mano
  
  //Variables
  pageable!: ListPageable //Donde almacenaremos el pageable
  games : Videogame[] = [] //Donde almacenaremos los juegos
  numberSequence : number[] =[] //Secuencia de nuemeros para el paginado
  quality: string = ""
  listCategory: CategoryWithoutList[] = []
  categoryId!: number
  result: string = "Result"

  /**
   * Metodo que se ejutara cada vez que carguemos la pagina y los hara una pericion
   * Par recoger todos los videojeugos
   */
  ngOnInit(): void {
    console.log(this.filter);
    
    if(!this.filter){
      if(!this.second){
        this.quality = "new"
      }else{
        this.quality = "old"
      }
      this.gameService.getAllGame(this.quality).subscribe({
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
    }else{
      this.gameService.searchGame(this.filter).subscribe({
        next: (page) =>{
          this.pageable = page;
          this.games = page.content;
          if(page.pageable.pageNumber+6<page.totalPages){
            for(let i=1; i<page.pageable.pageNumber+6; i++){
              this.numberSequence.push(i);
            }
          }else{
            for(let i=1; i<page.totalPages; i++){
              this.numberSequence.push(i);
            }
          }
        }
      })
    }

  }

  /**
   * Metodo para pasar de pagina y hc¡acer la peticion 
   * @param numPage 
   */
  nexPage(numPage: number){
    if(!this.filter){
      if(!this.categoryId){
        //Hacemos la peticion    
        this.gameService.getAllGamePage(numPage, this.quality).subscribe({
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
            this.getSecuenceNumber(numPage);
          }
        })
      }else{
        this.gameService.getGameByCategoryPage(String(this.categoryId), this.quality, String(numPage)).subscribe({
          next: (page) =>{
            this.numberSequence= []
            this.pageable = page;
            this.games= page.content

            this.getSecuenceNumber(numPage)
          }
        })
      }

    }else{
      
      this.gameService.searchGamePage(this.filter, String(numPage)).subscribe({
        next: (page) =>{
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

  getCategories(){
    this.categoryService.getAll().subscribe({
      next: (list) => {
        this.listCategory = list
      }
    })
  }

  getGamesByCategory(){
    if(this.categoryId && String(this.categoryId)!=""){
      if(this.second){
        let quality="old"
      }else{
        let quality = "new"
      }
      this.gameService.getGameByCategory(String(this.categoryId), this.quality).subscribe({
        next: (page) => {
          this.numberSequence = [];
          this.pageable = page
          this.games = page.content
          this.result = page.content[0].listCategory[0].nameCategory
          for(let i=1; i<page.totalPages+1; i++){
            this.numberSequence.push(i);
          }
        },
        error: (error) => {
          Swal.fire({
            title: "Not games found",
            text: error.error.message,
            icon: "error",
            confirmButtonText: "Close",
            confirmButtonColor:"#949494" 
          }); 
        }
      })
    }else{
      this.gameService.getAllGame(this.quality).subscribe({
        next: (page) => {
          //Si todo va bien añadimos a las variables los juegos y el paginado
          this.pageable = page
          this.games = page.content
          this.result = "Result"
          //Calculamos la secuencia de numero para que solo nos aparezcan 5 numeros a partir de donde etsoy
          for(let i=1; i<page.pageable.pageNumber+6; i++){
            this.numberSequence.push(i);
          }
          
        }
      })
    }
  }

  getSecuenceNumber(numPage: number){
    if(!this.categoryId){
      if(this.pageable.pageable.pageNumber==0){
        for(let i=1; i<this.pageable.pageable.pageNumber+6; i++){
          this.numberSequence.push(i);
        }
      }else if(numPage+5<=this.pageable.totalPages){
        for(let i=this.pageable.pageable.pageNumber; i<this.pageable.pageable.pageNumber+6; i++){
          this.numberSequence.push(i);
        }
      }else{
        for(let i=this.pageable.pageable.pageNumber; i<this.pageable.totalPages+1; i++){
          this.numberSequence.push(i);
        }
      }
    }else{
      if(this.pageable.pageable.pageNumber==0){
        for(let i=1; i<this.pageable.totalPages+1; i++){
          this.numberSequence.push(i);
        }
      }else if(numPage+5<=this.pageable.totalPages){
        for(let i=this.pageable.pageable.pageNumber; i<this.pageable.pageable.pageNumber+6; i++){
          this.numberSequence.push(i);
        }
      }else{
        for(let i=this.pageable.pageable.pageNumber; i<this.pageable.totalPages+1; i++){
          this.numberSequence.push(i);
        }
      }
    }
  }

}
