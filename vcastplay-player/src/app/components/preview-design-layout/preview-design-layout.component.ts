import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, inject, Input, Output, signal, ViewChild } from '@angular/core';
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
  playing = signal<boolean>(false);
  
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
    this.designLayoutService.removeCanvas(this.canvas);
    this.canvas = null;
  }

  onRenderCanvas() {
    this.designLayoutService.onPreloadCanvas(this.viewport, this.canvasContainer.nativeElement, this.designLayout).then((canvas: any) => {
      this.playing.set(true);
      this.canvas = canvas;
      this.designLayoutService.onPlayVideosInCanvas(canvas);
      this.isDoneRendering.emit(canvas);
      this.cdr.detectChanges();
    })
    // Promise.resolve().then(() => {
    //   // this.designLayoutService.onPlayVideosInCanvas(this.canvas);
    // })
  }
  
  trackById(index: number, item: any) {
    return item.id; // unique ID
  }
}
