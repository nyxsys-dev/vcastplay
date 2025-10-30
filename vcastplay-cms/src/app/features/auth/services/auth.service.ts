import { inject, Injectable } from '@angular/core'
import { ApiService } from '../../../core/api/api.service'
import { retry, tap } from 'rxjs'
import { LoginResponse } from '../interfaces/login-response.interface'
import { StorageService } from '../../../core/services/storage.service'

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'authToken'
  private readonly REFRESH_TOKEN_KEY = 'refreshToken'
  private readonly storage = inject(StorageService)

  constructor(private readonly apiService: ApiService) {}

  login(email: string, password: string) {
    return this.apiService
      .post<LoginResponse>(
        'v1/tenants/auth/login',
        { email, password },
        {
          'x-tenant-id': 'p5ywxz9s8o4phikoe5zg92oz', // To Fix
        }
      )
      .pipe(
        tap((res) => {
          this.storage.set(this.TOKEN_KEY, res.accessToken)
          if (res.refreshToken) {
            this.storage.set(this.REFRESH_TOKEN_KEY, res.refreshToken)
          }
        })
      )
  }

  logout(): void {
    this.storage.remove(this.TOKEN_KEY)
    this.storage.remove(this.REFRESH_TOKEN_KEY)
  }

  getToken(): string | null {
    return this.storage.get(this.TOKEN_KEY)
  }

  isLoggedIn(): boolean {
    return !!this.getToken()
  }
}
