import { Component, ElementRef, forwardRef, inject, Input, signal, ViewChild } from '@angular/core';
import { PlaylistsService } from '../../core/services/playlists.service';
import { CommonModule } from '@angular/common';
import { PreviewAssetsComponent } from '../preview-assets/preview-assets.component';
import { PreviewDesignLayoutComponent } from '../preview-design-layout/preview-design-layout.component';
import { ContentState } from '../../core/interfaces/playlist';

@Component({
  selector: 'app-preview-content-renderer',
  imports: [ CommonModule, PreviewAssetsComponent, forwardRef(() => PreviewDesignLayoutComponent) ],
  templateUrl: './preview-content-renderer.component.html',
  styleUrl: './preview-content-renderer.component.scss'
})
export class PreviewContentRendererComponent {
  
  @ViewChild('viewport') viewportElement!: ElementRef<HTMLDivElement>;
  
  @Input() contentData: any;
  @Input() autoPlay: boolean = false;

  playlistService = inject(PlaylistsService);
  
  content = signal<ContentState>({
    index: 0,
    currentContent: signal<any>(null),
    isPlaying: signal<boolean>(false),
    fadeIn: signal<boolean>(false),
    progress: signal<number>(0),
    currentTransition: signal<any>(null),
  });

  ngOnInit() {
    this.playlistService.onPlayContent(this.contentData);
    this.content.set(this.playlistService.onGetCurrentContent(this.contentData.id)());
  }

  trackById(index: number, item: any): any {
    return { id: index, contentId: item.contentId } 
  }
    
  get onProgressUpdate() { return this.playlistService.onProgressUpdate; }

}
