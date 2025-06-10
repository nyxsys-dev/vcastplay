import { Component, inject, Input, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { Assets } from '../../../core/interfaces/assets';
import { PlaylistService } from '../../../core/services/playlist.service';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-timeline-item',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.scss'
})
export class TimelineItemComponent {

  @Input() asset!: Assets;

  showConfig = signal<boolean>(false);

  utils = inject(UtilityService);
  playlistService = inject(PlaylistService);

  currentPlaying() {
    return (this.asset.code == this.playlistService.currentContent()?.code) && this.playlistService.currentContent()
  }

  onClickRemove(asset: Assets) {
    const { id } = asset;
    const contents = this.contents?.value
    this.contents?.setValue(contents.filter((item: Assets) => item.id !== id));
  }

  onClickHide() {
    this.showConfig.set(!this.showConfig());
  }

  get contents() {
    return this.playlistService.contents;
  }

  get isPlaying() {
    return this.playlistService.isPlaying;
  }

}
