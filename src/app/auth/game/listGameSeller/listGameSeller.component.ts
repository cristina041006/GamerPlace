import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Videogame } from '../../../interfaces/videogames';
import { GameService } from '../../../services/game.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './listGameSeller.component.html',
  styleUrl: './listGameSeller.component.css'
})
export class ListGameSellerComponent implements OnInit{

  constructor(private authService: AuthService, private gameService: GameService ) {}

  listGames: Videogame[] = []
  username: any

  ngOnInit(): void {
    this.authService.renew()
    this.username = this.authService.usernameSignal
    this.authService.getListGameSeller(this.username()).subscribe({
      next: (list) =>{
        this.listGames = list
      }
    })
  }

  deleteGame(id: number){
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
        this.gameService.deleteGame(String(id)).subscribe({
          next: (game) =>{
            //Si todo va bien le mostramos un mensaje de exito y lo redirigimos a la lista
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
              confirmButtonColor:"#43844B" 
            }).then((resultado)=>{
              this.authService.getListGameSeller(this.username()).subscribe({
                next: (list) =>{
                  this.listGames = list
                }
              })
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
