import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UtilityService } from '../../core/services/utility.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-toolbar',
  imports: [ PrimengUiModule, RouterModule ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  providers: [ AuthService, MessageService ]
})
export class ToolbarComponent {
  
  auth = inject(AuthService);
  utils = inject(UtilityService);
  storage = inject(StorageService);

  onClickToggleDarkTheme() {
    const isDark: boolean = this.utils.isDarkTheme();

    if (isDark) {
      this.utils.setLightTheme();
      this.storage.set('theme', 'light');
    } else {
      this.utils.setDarkTheme();
      this.storage.set('theme', 'dark');
    }
  }
}
