import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, inject, Input, Output, ViewChild } from '@angular/core';
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

  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  @Input() viewport: any;
  @Input() designLayout!: DesignLayout;
  @Input() isViewOnly: boolean = false;
  @Input() currentPlaying: any;

  @Output() isDoneRendering = new EventEmitter<any>();

  designLayoutService = inject(DesignLayoutService);
  canvas: fabric.Canvas | any = null;

  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {    
    this.designLayoutService.onScaleCanvas(this.canvas, this.viewport, this.canvasContainer.nativeElement);
  }

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { }

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
      this.isDoneRendering.emit(this.canvas);
      this.cdr.detectChanges();
    })
  }
  
  trackById(index: number, item: any) {
    return item.id; // unique ID
  }
}
