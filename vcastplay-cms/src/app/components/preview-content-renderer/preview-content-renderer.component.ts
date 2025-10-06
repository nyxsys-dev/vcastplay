import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input } from '@angular/core';
import { PreviewAssetsComponent } from '../preview-assets/preview-assets.component';
import { PlaylistService } from '../../features/playlist/playlist.service';
import { PreviewDesignLayoutComponent } from '../preview-design-layout/preview-design-layout.component';

@Component({
  selector: 'app-preview-content-renderer',
  imports: [ CommonModule, PreviewAssetsComponent, forwardRef(() => PreviewDesignLayoutComponent) ],
  templateUrl: './preview-content-renderer.component.html',
  styleUrl: './preview-content-renderer.component.scss',
  standalone: true
})
export class PreviewContentRendererComponent {

  @Input() content: any;

  playlistService = inject(PlaylistService);
    
  get onProgressUpdate() { return this.playlistService.onProgressUpdate; }

}
