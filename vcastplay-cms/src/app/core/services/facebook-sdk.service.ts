import { Injectable } from '@angular/core';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FacebookSDKService {

  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() { }

  onLoadSDK(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>((resolve) => {
      if (window.FB) {
        this.initialized = true;
        resolve();
        return;
      }

      window.fbAsyncInit = () => {
        window.FB.init({
          appId: 'YOUR_APP_ID', // optional for basic embeds
          xfbml: true,
          version: 'v21.0',
        });
        this.initialized = true;
        resolve();
      };

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    });

    return this.initPromise;
  }

  onFacebookParse(element: HTMLElement) {
    if (!this.initialized || !window.FB) return;
    return window.FB.XFBML.parse(element || undefined);
  }
}
