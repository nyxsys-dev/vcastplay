import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, inject, Input, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { DesignLayout } from '../../core/interfaces/design-layout';
import { DesignLayoutService } from '../../core/services/design-layout.service';
import { PrimengModule } from '../../core/modules/primeng/primeng.module';
import { PreviewContentRendererComponent } from '../preview-content-renderer/preview-content-renderer.component';
import * as fabric from 'fabric';
import { UtilsService } from '../../core/services/utils.service';
import { PlatformService } from '../../core/services/platform.service';
import { StorageService } from '../../core/services/storage.service';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-preview-design-layout',
  imports: [ PrimengModule, forwardRef(() => PreviewContentRendererComponent) ],
  templateUrl: './preview-design-layout.component.html',
  styleUrl: './preview-design-layout.component.scss'
})
export class PreviewDesignLayoutComponent {

  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() viewport: any;
  @Input() contentData!: any;
  @Input() isViewOnly: boolean = false;
  @Input() currentPlaying: any;

  @Output() isDoneRendering = new EventEmitter<any>();
  
  private timeout: number = environment.timeout;

  designLayoutService = inject(DesignLayoutService);
  platformService = inject(PlatformService);
  indexedDB = inject(IndexedDbService);
  storage = inject(StorageService);
  utils = inject(UtilsService);

  canvas: fabric.StaticCanvas | any = null;
  playing = signal<boolean>(false);
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {    
    this.designLayoutService.onScaleCanvas(this.canvas, this.viewport, this.canvasContainer.nativeElement);
  }

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contentData'] && this.contentData) {
      if (this.canvas) {
        this.designLayoutService.onStopVideosInCanvas(this.canvas);
        this.designLayoutService.removeCanvas(this.canvas);
        this.canvas = null;

        const htmlCanvas = this.canvasContainer.nativeElement.querySelector('canvas') as HTMLCanvasElement;
        htmlCanvas.remove();
      }
      this.onRenderCanvas(this.contentData); 
    }  
  }

  ngAfterViewInit(): void {
    // this.onRenderCanvas()  
  }

  ngOnDestroy(): void {
    this.canvasContainer.nativeElement.remove();
    this.designLayoutService.onStopVideosInCanvas(this.canvas);
    this.designLayoutService.removeCanvas(this.canvas);
    this.canvas = null;
  }

  async onRenderCanvas(content: any) { 
    // setTimeout(async () => {
    // }, this.timeout);
    const platform = await this.storage.get('platform');
    const items: any = await this.indexedDB.getAllItems();      
    this.designLayoutService.onPreloadCanvas(this.viewport, this.canvasContainer.nativeElement, content, items, platform).then((canvas: any) => {
      this.playing.set(true);
      this.canvas = canvas;        
      this.designLayoutService.onPlayVideosInCanvas(canvas);
      this.isDoneRendering.emit(canvas);
      this.cdr.detectChanges();
    })
  }
  
  trackById(index: number, item: any) {
    return item.id; // unique ID
  }
  
  get platform() { return this.platformService.platform; }
}
