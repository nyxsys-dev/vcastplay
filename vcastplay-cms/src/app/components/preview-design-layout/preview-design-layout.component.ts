import { Component, ElementRef, EventEmitter, forwardRef, HostListener, inject, Input, Output, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayout } from '../../core/interfaces/design-layout';
import { DesignLayoutService } from '../../features/design-layout/design-layout.service';
import * as fabric from 'fabric';
import { PreviewContentRendererComponent } from '../preview-content-renderer/preview-content-renderer.component';

@Component({
  selector: 'app-preview-design-layout',
  imports: [ PrimengUiModule, forwardRef(() => PreviewContentRendererComponent) ],
  templateUrl: './preview-design-layout.component.html',
  styleUrl: './preview-design-layout.component.scss',
})
export class PreviewDesignLayoutComponent {
  
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  @Input() viewport!: any;

  @Input() designLayout!: DesignLayout;
  @Input() isViewOnly: boolean = false;
  @Input() currentPlaying: any;

  @Output() canvasData: EventEmitter<any> = new EventEmitter<any>();

  designLayoutService = inject(DesignLayoutService);
  canvas: fabric.Canvas | any = null;

  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const canvasContainer = this.canvasContainer.nativeElement; 
    this.designLayoutService.onScaleCanvas(this.canvas, this.viewport, canvasContainer);
  }

  ngOnInit(): void { }

  ngOnChanges() {    
    Promise.resolve().then(() => this.onPlayVideoInCanvas())
  }

  ngAfterViewInit(): void {  
    this.onRenderCanvas()  
  }

  ngOnDestroy(): void {
    this.canvasContainer.nativeElement.remove();
    this.designLayoutService.onStopVideosInCanvas(this.canvas);    
  }

  onRenderCanvas() {
    Promise.resolve().then(() => {
      this.canvas = this.designLayoutService.onPreloadCanvas(this.viewport, this.canvasContainer.nativeElement, this.designLayout);
      this.canvasData.emit(this.canvas);
    })
  }

  onPlayVideoInCanvas() {    
    if (!this.viewport || !this.canvas) return;    
    
    if (!this.currentPlaying) {
      this.designLayoutService.onStopVideosInCanvas(this.canvas);
      return;
    }

    const { contentId } = this.currentPlaying;
    
    if (contentId == this.designLayout.contentId) {
      this.designLayoutService.onPlayVideosInCanvas(this.canvas);
    }
  }

  trackById(index: number, item: any) {
    return item.id; // unique ID
  }
}
