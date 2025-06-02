import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-toolbar',
  imports: [ PrimengUiModule, RouterModule ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  providers: [ AuthService, MessageService ]
})
export class ToolbarComponent {
  
  auth = inject(AuthService);
}
