import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [ PrimengUiModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ AuthService, MessageService ]
})
export class LoginComponent {

  auth = inject(AuthService);
}
