import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ComponentsModule } from '../../core/modules/components/components.module';
import { UtilityService } from '../../core/services/utility.service';

@Component({
  selector: 'app-admin-main',
  imports: [ RouterOutlet, ComponentsModule ],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.scss'
})
export class AdminMainComponent {

  utils = inject(UtilityService);

  get menuItems() {
    return this.utils.adminModules();
  }
}
