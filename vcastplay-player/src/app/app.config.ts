import { ApplicationConfig, provideZoneChangeDetection, isDevMode, provideAppInitializer } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import myPreset from '../../public/assets/myPresets';
import { provideServiceWorker } from '@angular/service-worker';

import { initializeApp } from './core/interfaces/app-initializer';

// Use window.system to call functions from preload.js
declare global {
  interface Window {
    system: {
      control: (action: string, app?: string) => Promise<string>;
      getSystemInfo: () => Promise<string>;
      checkForUpdates: () => void;
      // onUpdateAvailable: (callback: () => void) => void;
      // onUpdateDownloaded: (callback: () => void) => void;
      restartApp: () => void;
      takeScreenshot: () => Promise<any>;
      downloadFiles: (files: any[]) => Promise<string>;
      onDownloadProgress: (callback: (data: any) => void) => void;
      onDeleteFolder: (path: string) => void;
      isElectron: boolean;
    },
    getDeviceDetails: (data: any) => void;
    receiveDataFromAndroid?: (data: any) => void;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG({
      theme: { 
        preset: myPreset,
        options: {
          darkModeSelector: '.my-app-dark',
        }
      }
    }),
    provideAnimationsAsync(), provideServiceWorker('ngsw-worker.js', {
      enabled: !window.system?.isElectron && !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    provideAppInitializer(initializeApp())
  ]
};
