import { Component, EventEmitter, Output } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ListComponent } from '../../videogame/list/list.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { GameService } from '../../services/game.service';
import { ListPageable, Videogame } from '../../interfaces/videogames';

@Component({
  selector: 'app-nabvar',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, FormsModule, SearchComponent, MenuComponent, ListComponent],
  templateUrl: './nabvar.component.html',
  styleUrl: './nabvar.component.css'
})
export class NabvarComponent {

  constructor(private gameService: GameService, private router: Router){}

  gameFind!: ListPageable | undefined
  name: string= "";

  eventSearch(menasje: string){
    this.gameFind = undefined
    this.name = menasje;
    if(this.name!==''){
      this.gameService.searchGame(menasje).subscribe({
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
}
