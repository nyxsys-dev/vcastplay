import { Component } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-toolbar',
  imports: [ PrimengUiModule ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  
}
