import { Component, inject, Input, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { Assets } from '../../../core/interfaces/assets';
import { PlaylistService } from '../../../core/services/playlist.service';
import { UtilityService } from '../../../core/services/utility.service';
import { Playlist } from '../../../core/interfaces/playlist';

@Component({
  selector: 'app-playlist-item-content',
  imports: [ PrimengUiModule ],
  templateUrl: './playlist-item-content.component.html',
  styleUrl: './playlist-item-content.component.scss'
})
export class PlaylistItemContentComponent {
  
  @Input() playlist!: Playlist;
  @Input() asset!: any;

  showConfig = signal<boolean>(false);

  utils = inject(UtilityService);
  playlistService = inject(PlaylistService);

  onCurrentPlaying() {
    const content: any = this.playlistService.onGetCurrentContent(this.playlist.id)(); 
    const currentContent: any = content?.currentContent() ?? null;
    return content ? currentContent?.contentId == this.asset.contentId : false;
  }

  onClickRemove(asset: any) {
    const { contentId } = asset;
    const contents = this.contents?.value;
    this.contents?.setValue(contents.filter((item: any) => item.contentId !== contentId));
  }

  onClickHide() {
    this.showConfig.set(!this.showConfig());
  }

  get contents() { return this.playlistService.contents; }
  get isPlaying() { return this.playlistService.isPlaying; }
}
