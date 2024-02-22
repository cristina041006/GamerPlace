import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  @Output() evento = new EventEmitter<string>();
  name!: string 

  searchTerm(){
    if(this.name!=null){
      this.evento.emit(this.name)
    }
  }

}
