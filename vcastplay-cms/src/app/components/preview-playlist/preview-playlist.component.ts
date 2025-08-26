import { Component, inject, Input, signal } from '@angular/core';
import { ContentState, Playlist } from '../../core/interfaces/playlist';
import { PlaylistService } from '../../core/services/playlist.service';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { PreviewContentComponent } from '../preview-content/preview-content.component';
import { PreviewDesignLayoutComponent } from '../preview-design-layout/preview-design-layout.component';

@Component({
  selector: 'app-preview-playlist',
  imports: [PrimengUiModule, PreviewContentComponent, PreviewDesignLayoutComponent ],
  templateUrl: './preview-playlist.component.html',
  styleUrl: './preview-playlist.component.scss',
})
export class PreviewPlaylistComponent {

  @Input() playlist!: Playlist;
  @Input() showControls: boolean = true;
  @Input() autoPlay: boolean = false;

  playlistService = inject(PlaylistService);

  content = signal<ContentState>({
    index: 0,
    currentContent: signal<any>(null),
    isPlaying: signal<boolean>(false),
    fadeIn: signal<boolean>(false),
    progress: signal<number>(0),
    currentTransition: signal<any>(null),
  });

  ngOnInit() {
    if (this.autoPlay) {
      this.content.set(this.playlistService.onGetCurrentContent(this.playlist.id)());
    }
  }

  onClickPlayPreview() {    
    if (!this.content().isPlaying()) {
      this.playlistService.onPlayContent(this.playlist);
      this.content.set(this.playlistService.onGetCurrentContent(this.playlist.id)());      
    } else {
      this.playlistService.onStopContent(this.playlist.id);
    }
  }
  
  getTransitionClasses() {    
    const { type } = this.content().currentTransition() ?? '';
    const fadeIn = this.content().fadeIn();    
    return {
      'transition-all duration-500 ease-in-out': true,
      'w-full h-full flex justify-center items-center': true,
      [`${type?.opacity ? 'opacity-0' : ''} ${type?.x ?? ''}`]: !fadeIn,
      [`${type?.opacity ? 'opacity-100' : ''} ${type?.y ?? ''}`]: fadeIn
    };
  }

  get onProgressUpdate() { return this.playlistService.onProgressUpdate; }
}
