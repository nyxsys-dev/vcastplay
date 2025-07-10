import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ScreenService } from '../../../core/services/screen.service';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-screen-controls',
  imports: [ PrimengUiModule ],
  templateUrl: './screen-controls.component.html',
  styleUrl: './screen-controls.component.scss'
})
export class ScreenControlsComponent {

  screenService = inject(ScreenService);
  utils = inject(UtilityService);

  onClickToggleControls() { 
    this.screenService.toggleControls.set(!this.screenService.toggleControls()); 
  }

  get toggleControls() { return this.screenService.toggleControls; }
}
