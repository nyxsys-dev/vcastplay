import { Component, inject, Input, signal } from '@angular/core';
import { ContentState, Playlist } from '../../core/interfaces/playlist';
import { PlaylistService } from '../../core/services/playlist.service';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { PreviewContentRendererComponent } from '../preview-content-renderer/preview-content-renderer.component';

@Component({
  selector: 'app-preview-playlist',
  imports: [ PrimengUiModule, PreviewContentRendererComponent ],
  templateUrl: './preview-playlist.component.html',
  styleUrl: './preview-playlist.component.scss',
  standalone: true
})
export class PreviewPlaylistComponent {

  @Input() playlist!: Playlist;

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
    const currentContent = this.playlistService.onGetCurrentContent(this.playlist.id)();
    this.content.set(currentContent);
  }

  ngOnDestroy() {
    this.playlistService.onStopContent(this.playlist.id);
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
