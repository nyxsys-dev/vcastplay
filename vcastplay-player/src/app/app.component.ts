import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimengModule } from './core/modules/primeng/primeng.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , PrimengModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'vcastplay-player';
}
