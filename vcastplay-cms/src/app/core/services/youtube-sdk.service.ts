import { Injectable } from '@angular/core';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeSdkService {
  
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() { }
  
  onLoadSDK(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>((resolve) => {
      if (window.YT && window.YT.Player) {
        this.initialized = true;
        resolve();
        return;
      }

      // Create script tag for YouTube API
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        this.initialized = true;
        resolve();
      };
    });

    return this.initPromise;
  }

  async onYoutubeParse(): Promise<void> {
    if (this.initialized) return;
    await this.initPromise;
  }
}
