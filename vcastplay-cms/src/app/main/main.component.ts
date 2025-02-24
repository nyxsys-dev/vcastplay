import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../component/toolbar/toolbar.component';

@Component({
  selector: 'app-main',
  imports: [ RouterOutlet, ToolbarComponent ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
