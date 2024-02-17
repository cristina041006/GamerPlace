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

  constructor(private gameServices: GameService, private route: Router) {}
  @Input() id!: string
  game! : Videogame
  ngOnInit(): void {
    if(this.id){
      this.gameServices.getOne(this.id).subscribe({
        next: (videogame) =>{
          this.game = videogame
        }
      })
    }
  }

  deleteOneGame(){
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
        this.gameServices.deleteGame(this.id).subscribe({
          next: (game) =>{
            console.log(game); 
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
            Swal.fire({
              title: "Ups...",
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
