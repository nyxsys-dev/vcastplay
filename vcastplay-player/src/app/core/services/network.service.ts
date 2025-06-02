import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  networkStat = signal<boolean>(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.networkStat.set(true));
    window.addEventListener('offline', () => this.networkStat.set(false));

    effect(() => {
      console.log('🧭 Network status changed:', this.networkStat());
    })
  }

  isOnline() {
    return this.networkStat();
  }

  isOffline() {
    return !this.networkStat();
  }
}
