import { Component, inject, signal } from '@angular/core';
import { PrimengModule } from '../core/modules/primeng/primeng.module';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NetworkService } from '../core/services/network.service';
import { UtilsService } from '../core/services/utils.service';
declare global {
  interface Window {
    system: {
      control: (action: string, app?: string) => Promise<string>;
      getSystemInfo: () => Promise<string>;
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
constructor(private http: HttpClient) { }

  networkService = inject(NetworkService);
  utils = inject(UtilsService);

  loading = signal<boolean>(false);

  authForm: FormGroup = new FormGroup({
    code: new FormControl('', [ Validators.required ])
  });

  systemInfo: any;

  ngOnInit() {
    this.loadSystemInfo();
    this.utils.requestLocation();
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
        this.loading.set(false);
      })
      .catch(err => console.error(err));
  }
}
