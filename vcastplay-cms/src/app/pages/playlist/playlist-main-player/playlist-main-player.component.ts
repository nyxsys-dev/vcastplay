import { Component, effect, ElementRef, inject, Input, signal, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ContentState, Playlist } from '../../../core/interfaces/playlist';
import { PlaylistService } from '../../../core/services/playlist.service';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { PreviewDesignLayoutComponent } from '../../../components/preview-design-layout/preview-design-layout.component';
import { UtilityService } from '../../../core/services/utility.service';
import { DesignLayoutService } from '../../../core/services/design-layout.service';
import { PreviewAssetsComponent } from '../../../components/preview-assets/preview-assets.component';

@Component({
  selector: 'app-playlist-main-player',
  imports: [ PrimengUiModule, ComponentsModule, PreviewDesignLayoutComponent, PreviewAssetsComponent ],
  templateUrl: './playlist-main-player.component.html',
  styleUrl: './playlist-main-player.component.scss'
})
export class PlaylistMainPlayerComponent {

  @ViewChild('viewport') viewportElement!: ElementRef<HTMLDivElement>;

  @Input() playlist!: Playlist;
  @Input() showControls: boolean = true;
  @Input() autoPlay: boolean = false;
  
  playlistService = inject(PlaylistService);
  designLayoutService = inject(DesignLayoutService);
  utils = inject(UtilityService);

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
    if (!this.isPlaying()) {
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
  trackById(index: number, item: any): any {
    return { id: index, contentId: item.contentId } //item.contentId; // must be unique per item
  }
    
  get isPlaying() { return this.playlistService.isPlaying; }
  get onProgressUpdate() { return this.playlistService.onProgressUpdate; }
  get playlistContents() { return this.playlist.contents; }
  get playlistForm() { return this.playlistService.playListForm; }

  get isMobile() { return this.utils.isMobile; }
  get isTablet() { return this.utils.isTablet; }
  get isDesktop() { return this.utils.isDesktop; }
}
