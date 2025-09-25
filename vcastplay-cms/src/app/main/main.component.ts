import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentsModule } from '../core/modules/components/components.module';
import { UtilityService } from '../core/services/utility.service';
import { PrimengUiModule } from '../core/modules/primeng-ui/primeng-ui.module';
import { StorageService } from '../core/services/storage.service';
@Component({
  selector: 'app-main',
  imports: [ RouterOutlet, ComponentsModule, PrimengUiModule ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  utils = inject(UtilityService);
  storage = inject(StorageService);

  ngOnInit() {
    const isDarkTheme: boolean = this.storage.get('theme') == 'dark';
    if (isDarkTheme) this.utils.setDarkTheme();
  }
}
