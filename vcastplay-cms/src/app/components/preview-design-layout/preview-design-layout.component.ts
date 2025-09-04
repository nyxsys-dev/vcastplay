import { Component, ElementRef, forwardRef, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayout } from '../../core/interfaces/design-layout';
import { DesignLayoutService } from '../../core/services/design-layout.service';
import { PreviewContentRendererComponent } from '../preview-content-renderer/preview-content-renderer.component';
import * as fabric from 'fabric';

@Component({
  selector: 'app-preview-design-layout',
  imports: [ PrimengUiModule, forwardRef(() => PreviewContentRendererComponent) ],
  templateUrl: './preview-design-layout.component.html',
  styleUrl: './preview-design-layout.component.scss',
  standalone: true,
})
export class PreviewDesignLayoutComponent {
  
  @ViewChild('previewCanvas', { static: true }) canvasElement!: ElementRef<any>;

  @Input() designLayout!: DesignLayout;
  @Input() isViewOnly: boolean = false;
  @Input() currentPlaying: any;

  designLayoutService = inject(DesignLayoutService);
  canvas: fabric.Canvas | any = null;

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
    // if (this.canvas) this.canvas.dispose();
    this.onRenderCanvas();
  }

  ngOnDestroy(): void {
    this.canvasElement.nativeElement.remove();
    this.designLayoutService.onStopVideosInCanvas(this.canvas);
  }

  onRenderCanvas() {
    this.canvas = this.designLayoutService.onPreloadCanvas(this.canvasElement.nativeElement, this.designLayout)
  }

  get canvasHTMLLayers() { return this.designLayoutService.canvasHTMLLayers; }
}
