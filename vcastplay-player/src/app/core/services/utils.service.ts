import { Injectable, signal } from '@angular/core';
import { Location } from '../interfaces/player';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private secretKey = environment.secretKey;
  geoAPI: string = environment.geoAPI;
  appVersion = environment.version;
  isDev = signal<boolean>(!environment.production);
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

  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  decrypt(cipher: string): string {
    const bytes = CryptoJS.AES.decrypt(cipher, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  onDeleteFolder(path: string) {
    return window.system.onDeleteFolder(path);
  }

  onDownloadFiles(files: any[]): Promise<string> {
    return window.system.downloadFiles(files);
  }

  onGetDownloadProgessa(): Observable<any> {
    return new Observable((observer) => {
      window.system.onDownloadProgress((data) => {
        observer.next(data);
      });
    })
  }
  
  onGetEmbedUrl(url: string): any {
    if (url.includes('youtube') || url.includes('youtu.be')) {
      const videoId = this.extractYouTubeId(url);
      const link = `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=0&loop=0&fs=0&enablejsapi=1&disablekb=1&playsinline=1&showinfo=0`;
      return { link, videoId };
    }

    if (url.includes('facebook')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&autoplay=1&allowfullscreen=0`
    }

    if (url.includes('.html')) {
      return url
    }

    return ''
  }

  private extractYouTubeId(url: string): string {
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }
}
