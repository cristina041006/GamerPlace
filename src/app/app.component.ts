import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NabvarComponent } from './shared/nabvar/nabvar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MenuComponent } from './shared/menu/menu.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FloatingCircleComponent } from './shared/floating-circle/floating-circle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NabvarComponent, FooterComponent, MenuComponent, NgxUiLoaderModule, FloatingCircleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GamerPlace';
}
