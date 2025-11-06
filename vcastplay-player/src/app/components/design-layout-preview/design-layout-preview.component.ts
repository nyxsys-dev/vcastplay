import { Component, ElementRef, EventEmitter, forwardRef, HostListener, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DesignLayoutService } from '../../core/services/design-layout.service';
import { DesignLayout } from '../../core/interfaces/design-layout';
import { PlatformService } from '../../core/services/platform.service';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { StorageService } from '../../core/services/storage.service';
import { UtilsService } from '../../core/services/utils.service';
import { CommonModule } from '@angular/common';
import { PlaylistPreviewComponent } from '../playlist-preview/playlist-preview.component';
import { AssetPreviewComponent } from '../asset-preview/asset-preview.component';
import * as fabric from 'fabric';

@Component({
  selector: 'app-design-layout-preview',
  imports: [
    CommonModule,
    forwardRef(() => PlaylistPreviewComponent),
    forwardRef(() => AssetPreviewComponent)
  ],
  templateUrl: './design-layout-preview.component.html',
  styleUrl: './design-layout-preview.component.scss'
})
export class DesignLayoutPreviewComponent {
  
  // @Input() viewport: HTMLDivElement | any;
  // @Input() designLayout: DesignLayout | any;
  // @Input() isPlaying: boolean = false;

  // @Output() onCanvasChange = new EventEmitter<any>();

  // @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  // designlayoutService = inject(DesignLayoutService);
  // platformService = inject(PlatformService);
  // indexedDB = inject(IndexedDbService);
  // storage = inject(StorageService);
  // utils = inject(UtilsService);
  // canvas: fabric.Canvas | any;

  // @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   const canvasContainer = this.canvasContainer.nativeElement; 
  //   this.designlayoutService.onScaleCanvas(this.canvas, this.viewport, canvasContainer);
  // }

  // ngOnChanges(changes: SimpleChanges) {    
  //   if (changes['designLayout'] && changes['designLayout'].currentValue && this.isPlaying) this.onRenderCanvas();
  // }

  // ngOnDestroy() {
  //   Promise.resolve().then(() => {
  //     if (this.canvas) {
  //       this.designlayoutService.onStopVideosInCanvas(this.canvas);
  //       this.designlayoutService.removeCanvas(this.canvas);
  //       this.canvas = null;
  //     }
  //   })
  // }

  // async onRenderCanvas() {
  //   const platform = await this.storage.get('platform');
  //   const items: any = await this.indexedDB.getAllItems();   
  //   const container = this.canvasContainer.nativeElement;    
  //   Promise.resolve().then(() => {
  //     if (this.canvas) {
  //       this.designlayoutService.onStopVideosInCanvas(this.canvas);
  //       const canvasElement = document.querySelector('canvas');
  //       this.designlayoutService.removeCanvas(this.canvas);
  //       this.canvas = null
  //       canvasElement?.remove();
  //     }
  //     this.designlayoutService.onPreloadCanvas(this.viewport, container, this.designLayout, items, platform).then(async (canvas: any) => { 
  //       setTimeout(() => {
  //         this.canvas = canvas;        
  //         this.designlayoutService.onPlayVideosInCanvas(this.canvas);
  //         this.onCanvasChange.emit(this.canvas);
  //       }, 100);
  //     });
  //   })
  // }

  // trackById(index: number, item: any) {
  //   return item.id; // unique ID
  // }

  @Input() viewport: HTMLDivElement | any;
  @Input() designLayout: DesignLayout | any;
  @Input() isPlaying: boolean = false;

  @Output() onCanvasChange = new EventEmitter<any>();

  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef<HTMLDivElement>;

  designlayoutService = inject(DesignLayoutService);
  platformService = inject(PlatformService);
  indexedDB = inject(IndexedDbService);
  storage = inject(StorageService);
  utils = inject(UtilsService);
  private canvas: fabric.Canvas | any = null;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const canvasContainer = this.canvasContainer.nativeElement; 
    this.designlayoutService.onScaleCanvas(this.canvas, this.viewport, canvasContainer);
  }

  ngOnInit() { }

  async ngOnChanges(changes: SimpleChanges) {
    if (this.canvas && this.isPlaying) {
      Promise.resolve().then(() => {        
        this.designlayoutService.onPlayVideosInCanvas(this.canvas);
        this.onCanvasChange.emit(this.canvas);
      })
    } else if (this.canvas && !this.isPlaying) {
      this.designlayoutService.onStopVideosInCanvas(this.canvas);
    } else await this.onRenderCanvas();
  }

  ngOnDestroy() {    
    if (this.canvas) {
      this.designlayoutService.onStopVideosInCanvas(this.canvas);
      this.canvas = null;
    }
  }

  async onRenderCanvas() {    
    const platform = await this.storage.get('platform');
    const items: any = await this.indexedDB.getAllItems();  
    const container = this.canvasContainer.nativeElement;
    Promise.resolve().then(() => {
      this.designlayoutService.onPreloadCanvas(this.viewport, container, this.designLayout, items, platform).then(async (canvas: any) => {
        this.canvas = canvas;
        if (this.isPlaying) setTimeout(() => this.designlayoutService.onPlayVideosInCanvas(this.canvas), 100);
      });
    })
  }

  onRemoveCanvas() {
    if (this.canvas) {
      this.designlayoutService.removeCanvas(this.canvas);
      this.designlayoutService.onStopVideosInCanvas(this.canvas);
      this.canvas = null;
      // const canvasElement = document.querySelector('canvas');
      // canvasElement?.remove();
    }
  }

  trackById(index: number, item: any) {
    return item.id; // unique ID
  }

}
