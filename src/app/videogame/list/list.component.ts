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

  constructor(private gameService: GameService){}
  pageable!: ListPageable
  games : Videogame[] = []
  numberSequence : number[] =[]

  ngOnInit(): void {
    this.gameService.getAllGame().subscribe({
      next: (page) => {
        console.log(page);
        this.pageable = page
        this.games = page.content
        console.log(this.games)
        for(let i=1; i<page.pageable.pageNumber+6; i++){
          this.numberSequence.push(i);
        }
        console.log(this.numberSequence);
        
      }
    })

  }

  nexPage(numPage: number){
    console.log(numPage);
    
    this.gameService.getAllGamePage(numPage).subscribe({
      next: (page)=>{
        this.numberSequence = [];
        this.pageable=page;
        this.games= page.content
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
        console.log(this.numberSequence);
        console.log(this.pageable.pageable.pageNumber);
        console.log(this.pageable.totalPages);
        
      }
    })
  }


}
