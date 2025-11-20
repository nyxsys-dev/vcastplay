import { Component, inject, signal } from '@angular/core';
import { ComponentsModule } from '../core/modules/components/components.module';
import { PrimengUiModule } from '../core/modules/primeng-ui/primeng-ui.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UtilityService } from '../core/services/utility.service';

@Component({
  selector: 'app-main',
  imports: [ RouterLink, RouterOutlet, PrimengUiModule, ComponentsModule ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  utils = inject(UtilityService);

  showUpgrade = signal<boolean>(true);

  get menuItems() {
    return this.utils.modules();
  }
}
