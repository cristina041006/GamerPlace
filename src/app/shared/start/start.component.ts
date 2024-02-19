import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ListPageable, Videogame } from '../../interfaces/videogames';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnInit{

  constructor(private gameService: GameService){}
  games!: Videogame[]
  pageable!: ListPageable

  ngOnInit(): void {
    
    this.gameService.getAllGame().subscribe({
      next: (page)=>{
        this.gameService.getAllGamePage(page.totalPages).subscribe({
          next: (game) =>{
            this.games = game.content
          }
        })
      }
    })

  }

}
