import { Component, inject, signal } from '@angular/core'
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module'
import { ActivatedRoute, Router } from '@angular/router'
import { StorageService } from '../../../core/services/storage.service'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-login',
  imports: [PrimengUiModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [],
})
export class LoginComponent {
  token = signal<any>(null)
  route = inject(ActivatedRoute)
  router = inject(Router)
  authService = inject(AuthService)

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  })

  slides: any[] = [
    {
      image:
        'https://nyxsys.ph/assets/images/business%20solutions/b2bindustries/digital%20media%20owners.png',
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

  constructor(private message: MessageService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['id']
      if (token) {
        this.tokenValue.set(token)
      }
    })
  }

  ngOnDestroy() {
    this.loginForm.reset()
  }

  onClickLogin() {
    this.onLogin()
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.message.add({
        summary: 'Login Error',
        detail: 'Please input required fields (*)',
        icon: 'pi pi-info-circle',
        severity: 'error',
      })
      return
    }

    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: (res) => {
        console.log('Login successful', res)
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        console.error('Login failed', err)
        this.message.add({
          summary: 'Authentication Failed',
          detail: 'Invalid email or password.',
          icon: 'pi pi-info-circle',
          severity: 'error',
        })
      },
    })

    // if (this.token()) {
    //   this.message.add({
    //     severity: 'info',
    //     summary: 'Info',
    //     detail: 'This login is for customers only',
    //   })
    //   this.router.navigate(['/dashboard'])
    // } else {
    //   this.message.add({
    //     severity: 'info',
    //     summary: 'Info',
    //     detail: 'This login is for administrator only',
    //   })
    //   this.router.navigate(['/dashboard'])
    // }
  }

  onLogout() {
    this.authService.logout()
    const id = 'tenant12345'
    this.router.navigate(['/login'], { queryParams: id ? { id } : {} })
  }

  get tokenValue() {
    return this.token
  }
}
