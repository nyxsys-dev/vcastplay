import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimengUiModule } from './core/modules/primeng-ui/primeng-ui.module';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, PrimengUiModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent { }
