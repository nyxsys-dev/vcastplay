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
    };
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
    effect(() => {
      this.systemInfo = { ...this.systemInfo, coords: this.utils.location() };      
    })
  }

  ngOnInit() {
    this.loadSystemInfo();
    const code = this.utils.genereteScreenCode(6);
    this.authForm.patchValue({ code });
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

  get playerCode() {
    return this.authForm.get('code');
  }
}
