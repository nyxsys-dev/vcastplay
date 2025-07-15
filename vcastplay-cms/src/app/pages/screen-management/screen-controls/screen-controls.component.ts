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

  onClickDisplayScreen() {
    this.screenService.onDisplayScreen();
  }

  onClickToggleAudio(value: boolean) {
    this.screenService.onToggleAudio(value);
  }

  onClickToggleFullscreen(value: boolean) {
    this.screenService.onToggleFullscreen(value);
  }

  onClickSyncTime() {
    this.screenService.onSyncTime();
  }

  onClickPlaybackContent() {
    this.screenService.onGetPlaybackContentLogs(true);
  }

  onClickClear(value: boolean) {
    this.screenService.onClickClear(value);
  }

  onClickOpenScreen() {
    this.screenService.onClickOpenScreen();
  }

  onClickCloseScreen() {
    this.screenService.onCloseScreen();
  }

  onClickRestartScreen() {
    this.screenService.onRestartScreen();
  }

  onClickShutdownScreen() {
    this.screenService.onShutdownScreen();
  }

  onClickBroadCastMessage() {
    this.screenService.onBroadCastMessage();
  }

  onClickAssignContents() {
    this.screenService.onAssignContents();
  }

  get isMobile() { return this.utils.isMobile(); }
  get toggleControls() { return this.screenService.toggleControls; }
}
