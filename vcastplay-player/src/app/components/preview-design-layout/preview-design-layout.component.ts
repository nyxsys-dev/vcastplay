import { ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener, inject, Input, ViewChild } from '@angular/core';
import { DesignLayout } from '../../core/interfaces/design-layout';
import { DesignLayoutService } from '../../core/services/design-layout.service';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { PreviewContentRendererComponent } from '../preview-content-renderer/preview-content-renderer.component';
import * as fabric from 'fabric';

@Component({
  selector: 'app-preview-design-layout',
  imports: [ PrimengModule, forwardRef(() => PreviewContentRendererComponent) ],
  templateUrl: './preview-design-layout.component.html',
  styleUrl: './preview-design-layout.component.scss'
})
export class PreviewDesignLayoutComponent {

  // @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLDivElement>;
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  @Input() viewport!: any;
  // @Input() canvasContainer!: ElementRef<HTMLDivElement>;

  @Input() designLayout!: DesignLayout;
  @Input() isViewOnly: boolean = false;
  @Input() currentPlaying: any;
  @Input() autoPlay: boolean = false;

  designLayoutService = inject(DesignLayoutService);
  canvas: fabric.Canvas | any = null;

  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const canvasContainer = this.canvasContainer.nativeElement; 
    this.designLayoutService.onScaleCanvas(this.viewport, canvasContainer);
  }

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { }

  ngOnChanges() {
    // Promise.resolve().then(() => this.onPlayVideoInCanvas())
  }

  ngAfterViewInit(): void {  
    this.onRenderCanvas()  
  }

  ngOnDestroy(): void {
    this.canvasContainer.nativeElement.remove();
    this.designLayoutService.onStopVideosInCanvas(this.canvas);
    this.designLayoutService.removeCanvas();
    this.canvas = null;
  }

  onRenderCanvas() {
    Promise.resolve().then(() => {
      this.canvas = this.designLayoutService.onPreloadCanvas(this.viewport, this.canvasContainer.nativeElement, this.designLayout)
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

  get canvasHTMLLayers() { return this.designLayoutService.canvasHTMLLayers; }
}
