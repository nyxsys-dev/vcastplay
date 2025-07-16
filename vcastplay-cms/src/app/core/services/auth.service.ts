import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token = signal<any>(null);
  storage = inject(StorageService);
  router = inject(Router);
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

    if (this.token()) {
      this.message.add({ severity: 'info', summary: 'Info', detail: 'This login is for customers only' });
      this.router.navigate(['/dashboard']);
    } else {
      this.message.add({ severity: 'info', summary: 'Info', detail: 'This login is for administrator only' });
      this.router.navigate(['/dashboard']);
    }
  }

  onLogout() {
    const id = this.storage.get('id');
    this.router.navigate(['/login'], { queryParams: id ? { id } : {} });
  }
}
