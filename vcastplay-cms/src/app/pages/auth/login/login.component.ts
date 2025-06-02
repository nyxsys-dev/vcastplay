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

  slides: any[] = [
    {
      image: 'https://nyxsys.ph/assets/images/business%20solutions/b2bindustries/digital%20media%20owners.png',
      text: 'Engage Instantly. Inform Clearly.',
    },
    {
      image: 'https://nyxsys.ph/assets/images/business%20solutions/b2bindustries/healthcare.jpg',
      text: 'Smart Displays for Smarter Communication.',
    },
    {
      image: 'https://nyxsys.ph/assets/images/business%20solutions/b2bindustries/hospitality.jpg',
      text: 'Your Message, Everywhere, Anytime.',
    },
    {
      image: 'https://nyxsys.ph/assets/images/business%20solutions/b2bindustries/education.jpg',
      text: 'Dynamic Content. Real-Time Impact.',
    },
    {
      image: 'https://nyxsys.ph/assets/images/business%20solutions/b2bindustries/retail.jpg',
      text: 'Visual Solutions That Speak Louder.',
    },
  ]
}
