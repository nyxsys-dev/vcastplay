import { Component, inject, Input } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { PreviewContentComponent } from '../../preview-content/preview-content.component';
import { PlaylistService } from '../../../core/services/playlist.service';

@Component({
  selector: 'app-playlist-preview',
  imports: [ PrimengUiModule, PreviewContentComponent ],
  templateUrl: './playlist-preview.component.html',
  styleUrl: './playlist-preview.component.scss'
})
export class PlaylistPreviewComponent {

  @Input() currentContent!: any

  playlistService = inject(PlaylistService);

  onClickPlayPreview() {
    if (this.isPlaying()) this.playlistService.onStopPreview();
    else this.playlistService.onPlayPreview();
  }
  
  getTransitionClasses() {
    const { type } = this.currentTransition ?? '';
    const fadeIn = this.playlistService.fadeIn();    
    return {
      'transition-all duration-500 ease-in-out': true,
      'w-full h-full flex justify-center items-center': true,
      [`${type?.opacity ? 'opacity-0' : ''} ${type?.x ?? ''}`]: !fadeIn,
      [`${type?.opacity ? 'opacity-100' : ''} ${type?.y ?? ''}`]: fadeIn
    };
  }

  get isPlaying() { return this.playlistService.isPlaying; }
  get currentTransition() { return this.playlistService.currentTransition(); }
  get onTimeUpdate() { return this.playlistService.onTimeUpdate; }
}
