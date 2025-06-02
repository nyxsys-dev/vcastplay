import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  router = inject(Router)
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
    rememberMe: new FormControl(false)
  });

  constructor(private message: MessageService) { }

  onLogin() {
    if (this.loginForm.invalid) {
      this.message.add({ summary: 'Login Error', detail: 'Please input required fields (*)', icon: 'pi pi-info-circle', severity: 'error' });
      return;
    }

    this.loginForm.reset();
    this.router.navigate(['/dashboard']);
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}
