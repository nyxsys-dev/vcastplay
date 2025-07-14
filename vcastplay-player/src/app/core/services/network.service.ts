import { effect, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  networkStat = signal<boolean>(navigator.onLine);

  constructor() { }

  isOnline() {
    return this.networkStat();
  }

  isOffline() {
    return !this.networkStat();
  }
}
