import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ListComponent } from '../../videogame/list/list.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { GameService } from '../../services/game.service';
import { ListPageable, Videogame } from '../../interfaces/videogames';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { delay } from 'rxjs';

@Component({
  selector: 'app-nabvar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule, SearchComponent, MenuComponent, ListComponent],
  templateUrl: './nabvar.component.html',
  styleUrl: './nabvar.component.css'
})
export class NabvarComponent implements OnInit{

  constructor(private gameService: GameService, private router: Router, private authService: AuthService){}

  gameFind!: ListPageable | undefined
  name: string= "";
  username: any = this.authService.usernameSignal
  rol: any = this.authService.rolSignal
  eventSearch(menasje: string){
    this.gameFind = undefined
    this.name = menasje;
    if(this.name!==''){
      this.gameService.searchGame(menasje)
      .subscribe({
        next: (game) => {
            this.gameFind = game;
        },
        error: (error) => {
          this.gameFind = undefined
        }
      })

    }else{
      this.gameFind = undefined
    }
  }

  ngOnInit(): void {
    this.authService.renew()
    console.log(this.rol());
    
  }

  logout(){
    Swal.fire({
      title: "Are you sure you want logout?",
      text: "you lost your shop basket!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C24042",
      cancelButtonColor: "#949494",
      confirmButtonText: "Yes"
    }).then((result) => {
      if(result.isConfirmed){
        this.authService.logout()
        this.router.navigate([''])
      }
    })
  }
 
}
