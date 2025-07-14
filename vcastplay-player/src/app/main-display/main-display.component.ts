import { Component, effect, inject, signal } from '@angular/core';
import { PrimengModule } from '../core/modules/primeng/primeng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NetworkService } from '../core/services/network.service';
import { UtilsService } from '../core/services/utils.service';
declare global {
  interface Window {
    system: {
      control: (action: string, app?: string) => Promise<string>;
      getSystemInfo: () => Promise<string>;
      checkForUpdates: () => void;
      // onUpdateAvailable: (callback: () => void) => void;
      // onUpdateDownloaded: (callback: () => void) => void;
      restartApp: () => void;
      isElectron: boolean
    },
  }
}
@Component({
  selector: 'app-main-display',
  imports: [ PrimengModule ],
  templateUrl: './main-display.component.html',
  styleUrl: './main-display.component.scss'
})
export class MainDisplayComponent {

  networkService = inject(NetworkService);
  utils = inject(UtilsService);

  loading = signal<boolean>(false);

  authForm: FormGroup = new FormGroup({
    code: new FormControl('', [ Validators.required ])
  });

  systemInfo: any;

  constructor() {
    window.addEventListener('online', () => this.networkStat.set(true));
    window.addEventListener('offline', () => this.networkStat.set(false));

    effect(() => {
      console.log('🧭 Network status changed:', this.networkStat());
      this.systemInfo = { ...this.systemInfo, coords: this.utils.location() };      
    })
  }

  ngOnInit() {
    console.log(this.isElectron ? 'Running in Electron' : 'Running in Browser');
    
    if (this.isElectron) this.loadSystemInfo();
  }

  onClickCheckUpdates() {
    window.system.checkForUpdates();
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
    this.loading.set(true);
    window.system.getSystemInfo()
      .then(response => {        
        this.systemInfo = response; 
        this.utils.requestLocation();        
        this.loading.set(false);
      })
      .catch(err => console.error(err));
  }

  get playerCode() { return this.authForm.get('code'); }
  get isElectron() { return window.system?.isElectron; }
  get networkStat() { return this.networkService.networkStat; }
}
