import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ComponentsModule } from '../core/modules/components/components.module';

@Component({
  selector: 'app-main',
  imports: [ RouterOutlet, ComponentsModule ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  
}
