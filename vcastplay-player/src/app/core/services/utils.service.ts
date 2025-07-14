import { Injectable, signal } from '@angular/core';
import { Location } from '../interfaces/player';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  geoAPI: string = environment.geoAPI;
  isDev = signal<boolean>(!environment.production);
  systemInfo = signal<any>(null);
  isLoading = signal<boolean>(false);
  isElectron = signal<boolean>(false);
  location = signal<Location>({ 
    country: '',
    region: '',
    city: '',
    latitude: 0, 
    longitude: 0 
  });

  constructor(private http: HttpClient) { }

  requestLocation() {
    this.http.get(this.geoAPI).subscribe({
      next: (response: any) => {        
        this.location.set({ 
          country: response.country_name,
          region: response.region,
          city: response.city,
          latitude: response.latitude, 
          longitude: response.longitude 
        });
      }
    });
  }
  
  genereteScreenCode(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }
  
  
  send(action: string) {
    window.system.control(action)
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }

  sendApp(app: string) {
    window.system.control("open", app)
      .then(response => console.log(response));
  }

  closeApp(app: string) {
    window.system.control("close", app)
      .then(response => console.log(response));
  }

  loadSystemInfo() {
    window.system.getSystemInfo()
      .then(response => {        
        this.systemInfo.set(response); 
        this.requestLocation();       
      })
      .catch(err => console.error(err));
  }
}
