import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Videogame } from '../../interfaces/videogames';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [FooterComponent, CommonModule, RouterLink],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
/**Codigo para mostrar los detalles e un videojuego */

  /**Constructor llamando al servicio de juego y a un route para poder navegar */
  constructor(private gameServices: GameService, private route: Router) {}

  //Variables
  @Input() id!: string //Id del videojuego pasado por ruta
  game! : Videogame //Donde vamos a introducir los datos capturados


  /**
   * Mtodo que se ejecutara justo al cargar la pagina la primera vez para conseguir
   * los datos del videojuego
   */
  ngOnInit(): void {
    //Comprobamos que nos pasaron la id y no mostramos un mensaje de error
    if(this.id){

      //Hacemos peticion
      this.gameServices.getOne(this.id).subscribe({
        next: (videogame) =>{
          //Si todo es correcto introducimos los datos rescatos a nuestra variable
          this.game = videogame
        },
        error: (error) => {
          //Si hay erroes se mostrara una alerta con los errores y si le damos a OK nos llevara a
          //la lista de videojuegos
          Swal.fire({
            title: "Error",
            text: error.error.message,
            icon: "error",
            confirmButtonText: "Close",
            confirmButtonColor:"#949494" 
          }).then((respuesta) =>{
            if(respuesta.isConfirmed){
              this.route.navigate(['videogames'])
            }
          })
        }
      })
      
    }else{
      Swal.fire({
        title: "Error",
        text: "Id necesaria en esta ruta",
        icon: "error",
        confirmButtonText: "Close",
        confirmButtonColor:"#949494" 
      }).then((respuesta) =>{
        if(respuesta.isConfirmed){
          this.route.navigate(['videogames'])
        }
      })

    }
  }

  /**
   * Metodo para poder borrar un videojuego desde los detalles pidiendo confirmacion
   * para evitar eliminacion accidentales
   */
  deleteOneGame(){
    //Mostramos alerta para que nos confirmen si queire borrar
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C24042",
      cancelButtonColor: "#949494",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        //Si haepta hacemos peticion para borrar 
        this.gameServices.deleteGame(this.id).subscribe({
          next: (game) =>{
            //Si todo va bien le mostramos un mensaje de exito y lo redirigimos a la lista
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              confirmButtonColor:"#43844B" 
            }).then((resultado)=>{
              this.route.navigate(["videogames"])
            })
          },
          error: (error)=>{
            //Si se produjo algun erro le mostramos una alerta con el mensaje de error corespondiente
            Swal.fire({
              title: "Error",
              text: error.error.message,
              icon: "error",
              confirmButtonText: "Close",
              confirmButtonColor:"#949494" 
            });   
          }
        })
      }
    });
  }
}
