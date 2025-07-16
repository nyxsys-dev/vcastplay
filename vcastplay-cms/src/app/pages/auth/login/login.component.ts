import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-login',
  imports: [ PrimengUiModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ AuthService, MessageService ]
})
export class LoginComponent {

  auth = inject(AuthService);
  storage = inject(StorageService);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params['id'];
      if (token) {
        this.tokenValue.set(token);
        this.storage.set('id', token);
      }
    });
  }

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

  ngOnDestroy() {
    this.auth.loginForm.reset();
  }

  onClickLogin() {
    this.auth.onLogin();
  }

  get tokenValue() { return this.auth.token; }
}
