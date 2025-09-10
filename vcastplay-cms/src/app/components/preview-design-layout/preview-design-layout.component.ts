import { Component, ElementRef, forwardRef, HostListener, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { PlaylistMainPlayerComponent } from '../../pages/playlist/playlist-main-player/playlist-main-player.component';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayout } from '../../core/interfaces/design-layout';
import { DesignLayoutService } from '../../core/services/design-layout.service';
import * as fabric from 'fabric';
import { PreviewContentRendererComponent } from '../preview-content-renderer/preview-content-renderer.component';

@Component({
  selector: 'app-preview-design-layout',
  imports: [ PrimengUiModule, forwardRef(() => PreviewContentRendererComponent) ],
  templateUrl: './preview-design-layout.component.html',
  styleUrl: './preview-design-layout.component.scss',
  standalone: true,
})
export class PreviewDesignLayoutComponent {
  
  // @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLDivElement>;
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  @Input() viewport!: any;
  // @Input() canvasContainer!: ElementRef<HTMLDivElement>;

  @Input() designLayout!: DesignLayout;
  @Input() isViewOnly: boolean = false;
  @Input() currentPlaying: any;

  designLayoutService = inject(DesignLayoutService);
  canvas: fabric.Canvas | any = null;

  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {   
    const viewport = this.viewport.nativeElement;
    const canvasContainer = this.canvasContainer.nativeElement; 
    this.designLayoutService.onScaleCanvas(viewport, canvasContainer);
  }

  ngOnInit(): void { }

  ngOnChanges() {
    if (!this.currentPlaying) {
      this.designLayoutService.onStopVideosInCanvas(this.canvas);
      return;
    }
    const { contentId } = this.currentPlaying;
    if (contentId == this.designLayout.contentId) {
      console.log('Now playing', this.designLayout.name);
      this.designLayoutService.onPlayVideosInCanvas(this.canvas);
    }
  }

  ngAfterViewInit(): void {    
    this.onRenderCanvas();
  }

  ngOnDestroy(): void {
    this.canvasContainer.nativeElement.remove();
    this.designLayoutService.onStopVideosInCanvas(this.canvas);
  }

  onRenderCanvas() {
    const viewport = this.viewport.nativeElement;
    const canvasContainer = this.canvasContainer.nativeElement;
    this.canvas = this.designLayoutService.onPreloadCanvas(viewport, canvasContainer, this.designLayout);    
  }

  get canvasHTMLLayers() { return this.designLayoutService.canvasHTMLLayers; }
}
