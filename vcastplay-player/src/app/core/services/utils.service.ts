import { Injectable, signal } from '@angular/core';
import { Location } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  location = signal<Location>({ latitude: 0, longitude: 0 });

  constructor() { }

  requestLocation() {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      this.location.set({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    }, (err) => console.error(err), {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }
}
