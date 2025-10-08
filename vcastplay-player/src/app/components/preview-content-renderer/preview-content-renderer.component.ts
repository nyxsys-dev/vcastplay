import { Component, forwardRef, inject, Input, signal } from '@angular/core';
import { PlaylistsService } from '../../core/services/playlists.service';
import { CommonModule } from '@angular/common';
import { PreviewAssetsComponent } from '../preview-assets/preview-assets.component';
import { PreviewDesignLayoutComponent } from '../preview-design-layout/preview-design-layout.component';
import { ContentState } from '../../core/interfaces/playlist';
import { environment } from '../../../environments/environment.development';
import { UtilsService } from '../../core/services/utils.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-preview-content-renderer',
  imports: [ CommonModule, PreviewAssetsComponent, forwardRef(() => PreviewDesignLayoutComponent) ],
  templateUrl: './preview-content-renderer.component.html',
  styleUrl: './preview-content-renderer.component.scss'
})
export class PreviewContentRendererComponent {
  
  @Input() viewport: any;
  @Input() contentData: any;
  @Input() autoPlay: boolean = false;

  playlistService = inject(PlaylistsService);
  utils = inject(UtilsService);
  storage = inject(StorageService);
  
  timeout: number = environment.timeout;
  content = signal<ContentState>({
    index: 0,
    currentContent: signal<any>(null),
    isPlaying: signal<boolean>(false),
    fadeIn: signal<boolean>(false),
    progress: signal<number>(0),
    currentTransition: signal<any>(null),
  });

  ngOnChanges() {
    if (this.autoPlay) {
      const content: any = this.contentData;
      const platform = this.storage.get('platform');
      if (platform == 'desktop') {
        const files = ['asset'].includes(content.type) ? [ content ] : content.files;
        this.utils.onDownloadFiles(files).then((response: any) => {
          this.playlistService.onPlayContent(this.contentData);
          this.content.set(this.playlistService.onGetCurrentContent(this.contentData.id)());
        })
      } else {
        this.playlistService.onPlayContent(this.contentData);
        this.content.set(this.playlistService.onGetCurrentContent(this.contentData.id)());
      }
    }
  }

  ngAfterViewInit() { }

  trackById(index: number, item: any): any {
    return { id: index, contentId: item.contentId } 
  }
    
  get onProgressUpdate() { return this.playlistService.onProgressUpdate; }

}
