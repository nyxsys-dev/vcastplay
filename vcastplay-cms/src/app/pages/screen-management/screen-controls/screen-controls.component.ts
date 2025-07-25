import { Component, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ScreenService } from '../../../core/services/screen.service';
import { UtilityService } from '../../../core/services/utility.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { Screen } from '../../../core/interfaces/screen';
import { AssetsService } from '../../../core/services/assets.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-screen-controls',
  imports: [ PrimengUiModule ],
  templateUrl: './screen-controls.component.html',
  styleUrl: './screen-controls.component.scss'
})
export class ScreenControlsComponent {

  assetService = inject(AssetsService);
  screenService = inject(ScreenService);
  broadcastService = inject(BroadcastService);
  utils = inject(UtilityService);

  confirmation = inject(ConfirmationService);
  message = inject(MessageService);

  onClickOpenContents() {
    const selectedScreens: Screen[] = this.selectMultipleScreens();
    if (selectedScreens.length == 0) {
      this.message.add({ severity:'error', summary: 'Error', detail: 'Please select at least one screen.' });
      return;
    }
  }

  onClickApplyContents() {
    this.message.add({ severity:'success', summary: 'Success', detail: 'Contents applied successfully!' });
  }

  onClickToggleControls() { 
    this.screenService.toggleControls.set(!this.screenService.toggleControls()); 
  }

  onClickOpenScreen() {
    const selectedScreens: Screen[] = this.selectMultipleScreens();
    if (selectedScreens.length == 0) {
      this.message.add({ severity:'error', summary: 'Error', detail: 'Please select at least one screen.' });
      return;
    }
    this.screenService.onClickOpenScreen();
  }

  onClickCloseScreen() {
    const selectedScreens: Screen[] = this.selectMultipleScreens();
    if (selectedScreens.length == 0) {
      this.message.add({ severity:'error', summary: 'Error', detail: 'Please select at least one screen.' });
      return;
    }
    this.screenService.onCloseScreen();
  }

  onClickRestartScreen() {
    const selectedScreens: Screen[] = this.selectMultipleScreens();
    if (selectedScreens.length == 0) {
      this.message.add({ severity:'error', summary: 'Error', detail: 'Please select at least one screen.' });
      return;
    }
    this.screenService.onRestartScreen();
  }

  onClickShutdownScreen() {
    const selectedScreens: Screen[] = this.selectMultipleScreens();
    if (selectedScreens.length == 0) {
      this.message.add({ severity:'error', summary: 'Error', detail: 'Please select at least one screen.' });
      return;
    }
    this.screenService.onShutdownScreen();
  }

  onClickBroadCastMessage() {
    const selectedScreens: Screen[] = this.selectMultipleScreens();
    if (selectedScreens.length == 0) {
      this.message.add({ severity:'error', summary: 'Error', detail: 'Please select at least one screen.' });
      return;
    }
    this.showBroadcast.set(true);
  }

  onClickAssignContents() {
    const selectedScreens: Screen[] = this.selectMultipleScreens();
    if (selectedScreens.length == 0) {
      this.message.add({ severity:'error', summary: 'Error', detail: 'Please select at least one screen.' });
      return;
    }
    this.screenService.onAssignContents();
  }

  get isMobile() { return this.utils.isMobile(); }
  get isTablet() { return this.utils.isTablet(); }
  get showBroadcast() { return this.screenService.showBroadcast; }
  get toggleControls() { return this.screenService.toggleControls; }
  get selectMultipleScreens() { return this.screenService.selectMultipleScreens; }

  get assetForm() { return this.assetService.assetForm; }
}
