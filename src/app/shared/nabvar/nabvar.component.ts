import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ListComponent } from '../../videogame/list/list.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nabvar',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './nabvar.component.html',
  styleUrl: './nabvar.component.css'
})
export class NabvarComponent {

}
