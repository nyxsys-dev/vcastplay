import { Component } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';

@Component({
  selector: 'app-toolbar',
  imports: [ PrimengUiModule ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {

}
