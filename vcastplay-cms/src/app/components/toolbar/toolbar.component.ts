import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { MenuItem } from 'primeng/api';
import { UtilityService } from '../../core/services/utility.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [ PrimengUiModule, RouterModule ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  
}
