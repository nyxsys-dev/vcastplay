import { Component, inject, Input, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { Assets } from '../../../core/interfaces/assets';
import { PlaylistService } from '../../../core/services/playlist.service';
import { UtilityService } from '../../../core/services/utility.service';
import { Playlist } from '../../../core/interfaces/playlist';
import { DesignLayout } from '../../../core/interfaces/design-layout';

@Component({
  selector: 'app-playlist-item-content',
  imports: [ PrimengUiModule ],
  templateUrl: './playlist-item-content.component.html',
  styleUrl: './playlist-item-content.component.scss'
})
export class PlaylistItemContentComponent {
  
  @Input() playlist!: Playlist;
  @Input() content!: Assets | DesignLayout;

  showConfig = signal<boolean>(false);

  utils = inject(UtilityService);
  playlistService = inject(PlaylistService);

  onCurrentPlaying() {
    const content: any = this.playlistService.onGetCurrentContent(this.playlist.id)(); 
    const currentContent: any = content?.currentContent() ?? null;    
    return content ? currentContent?.contentId == this.content.contentId : false;
  }

  onClickRemove(content: Assets | DesignLayout) {
    const { contentId } = content;
    const contents = this.contents?.value;
    const files = this.files?.value;
    this.contents?.setValue(contents.filter((item: any) => item.contentId !== contentId));
    this.files?.setValue(files.filter((item: any) => item.contentId !== contentId));
  }

  onClickHide() {
    this.showConfig.set(!this.showConfig());
  }

  get files() { return this.playlistService.files; }
  get contents() { return this.playlistService.contents; }
  get isPlaying() { return this.playlistService.isPlaying; }
}
