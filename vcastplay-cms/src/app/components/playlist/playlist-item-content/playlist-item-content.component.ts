import { Component, inject, Input, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { Assets } from '../../../core/interfaces/assets';
import { PlaylistService } from '../../../core/services/playlist.service';
import { UtilityService } from '../../../core/services/utility.service';
import { PreviewContentComponent } from '../../preview-content/preview-content.component';

@Component({
  selector: 'app-playlist-item-content',
  imports: [ PrimengUiModule, PreviewContentComponent ],
  templateUrl: './playlist-item-content.component.html',
  styleUrl: './playlist-item-content.component.scss'
})
export class PlaylistItemContentComponent {
  
  @Input() asset!: any;

  showConfig = signal<boolean>(false);

  utils = inject(UtilityService);
  playlistService = inject(PlaylistService);

  currentPlaying() {
    return (this.asset.contentId == this.currentContent()?.contentId) && this.currentContent()
  }

  onClickRemove(asset: Assets) {
    const { id } = asset;
    const contents = this.contents?.value
    this.contents?.setValue(contents.filter((item: Assets) => item.id !== id));
  }

  onClickHide() {
    this.showConfig.set(!this.showConfig());
  }

  get contents() { return this.playlistService.contents; }
  get isPlaying() { return this.playlistService.isPlaying; }
  get currentContent() { return this.playlistService.currentContent; }
}
