import { Injectable, signal } from '@angular/core';
import { DesignLayout, HtmlLayer } from '../interfaces/design-layout';
import * as fabric from 'fabric';

@Injectable({
  providedIn: 'root'
})
export class DesignLayoutService {
  
  private canvas!: fabric.Canvas;
  private animFrameId!: number;
  
  zoomLevel: number = 1;
  defaultScale: number = 0;
  defaultResolution: any;
  canvasHTMLLayers = signal<HtmlLayer[]>([]);

  constructor() { }

  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  getCanvas(): fabric.Canvas {
    return this.canvas;
  }

  removeCanvas() {
    if (this.canvas) this.canvas.dispose();    
  }

  onPreloadCanvas(viewport: any, canvasContainer: any, design: DesignLayout) {
    const canvas: any = this.initCanvas(viewport, canvasContainer, design, { renderOnAddRemove: true, autoPlayVideos: true, isViewOnly: true, registerEvents: true });
    this.setCanvas(canvas);
    return canvas;
  }
  
  onScaleCanvas(parentElement: any, canvasContainer: any) {
    const canvas = this.getCanvas();
    if (!canvas) return;

    const { width, height } = this.defaultResolution;    

    // Calculate scale factor based on parent element
    const bounds = parentElement.getBoundingClientRect();

    const scaleX = bounds.width / width;
    const scaleY = bounds.height / height;

    this.defaultScale = Math.min(scaleX, scaleY);;

    const totalScale = this.defaultScale * this.zoomLevel;
    this.updateCanvasSize(canvasContainer, totalScale, totalScale);
  }

  onAddVideoToCanvas(canvas: fabric.Canvas, data: any, fabricObject?: fabric.Object | any) {
    const { width, height }: any = data.fileDetails.resolution;
    
    const video = document.createElement('video');
    const videoSource = document.createElement('source');

    video.appendChild(videoSource);
    videoSource.src = data.link;

    video.width = width;
    video.height = height;
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.preload = 'auto';
    video.load();
    video.play().catch(err => console.warn('Video play failed:', err));;

    const videoObj: any = new fabric.FabricImage(video, { 
      left: fabricObject?.left ?? 0,
      top: fabricObject?.top ?? 0,
      originX: fabricObject?.originX ?? 'top',
      originY: fabricObject?.originY ?? 'left',
      scaleX: fabricObject?.scaleX ?? 0.2,
      scaleY: fabricObject?.scaleY ?? 0.2,
      objectCaching: false,
      data,
      zIndex: fabricObject?.zIndex ?? 0
    });

    videoObj.setControlsVisibility({ mtr: false, tl: false, tr: false, mt: false, ml: false, mb: false, mr: false, bl: false });
    // canvas.insertAt(videoObj.zIndex, videoObj);
    canvas.add(videoObj);

    videoObj.set('data', { ...data, element: video });
    
    video.addEventListener('loadeddata', () => {
      canvas.renderAll();
    });

    this.onStartVideoRender(canvas);
  }
  
  onStartVideoRender(canvas: fabric.Canvas) {
    // if (this.animFrameId) return;
    const render = () => {      
      canvas.requestRenderAll();
      this.animFrameId = requestAnimationFrame(render);
    }

    if (!this.animFrameId) this.animFrameId = requestAnimationFrame(render);
  }
  
  onPlayVideosInCanvas(canvas: fabric.Canvas) {
    const objects = canvas.getObjects();
    objects.forEach((object: any) => {
      const data = object.data;
      if (data && data?.type == 'video' && data.element instanceof HTMLVideoElement) {
        data.element.play().catch((err: any) => {
          console.warn('Autoplay blocked for video:', err);
        });
      }
    });
    this.onStartVideoRender(canvas);
  }

  onStopVideosInCanvas(canvas: fabric.Canvas) {
    if (!canvas) return;
    const objects = canvas.getObjects();
    objects.forEach((object: any) => {
      const data = object.data;
      if (data && data?.type == 'video' && data.element instanceof HTMLVideoElement) {        
        data.element.pause();
        data.element.currentTime = 0;
      }
    });

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = 0;
    canvas.requestRenderAll();
  }

  private onInitFabricCanvas(viewport: HTMLElement, container: HTMLElement, resolution: { width: number, height: number }, backgroundColor: string = '#ffffff') {
    const canvasElement = document.createElement('canvas');
    // container.style.width = resolution.width + 'px';
    // container.style.height = resolution.height + 'px';
    container.appendChild(canvasElement);

    // Calculate scale factor based on parent element
    const bounds = viewport.getBoundingClientRect();
    const scaleX = bounds.width / resolution.width;
    const scaleY = bounds.height / resolution.height;
    const scale = Math.min(scaleX, scaleY); 

    // Calculate new dimensions for container & canvas
    const newWidth = resolution.width * scale;
    const newHeight = resolution.height * scale;
    
    // Apply new size to container
    container.style.width = `${newWidth}px`;
    container.style.height = `${newHeight}px`;
  
    this.defaultScale = scale;
    this.defaultResolution = resolution;
    
    return new fabric.Canvas(canvasElement, { 
      width: newWidth,
      height: newHeight,
      backgroundColor,
      selection: false,
      preserveObjectStacking: true,
    });
  }

  private initCanvas(
    viewport: any,
    canvasElement: any, 
    design: DesignLayout, 
    options: { renderOnAddRemove: boolean, autoPlayVideos: boolean, isViewOnly?: boolean, registerEvents?: boolean }
  ) {
    try {
      const { screen, canvas }: any = design;
      const [ width, height ] = screen.displaySettings.resolution.split('x').map(Number);
      const canvasData = JSON.parse(canvas);

      const newCanvas = this.onInitFabricCanvas(viewport, canvasElement, { width, height }, canvasData.background);

      newCanvas.setZoom(this.defaultScale)

      if (!options.isViewOnly) this.setCanvas(newCanvas);

      newCanvas.loadFromJSON(canvasData, () => {
        setTimeout(() => {
          const objects = newCanvas.getObjects();

          // Sort objects by zIndex
          objects.sort((a: any, b: any) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

          objects.forEach((obj: any) => {
            if (obj.html) {
              const html: any = obj.html;
              const alreadyExists = this.canvasHTMLLayers().find(item => item.id === html.id);

              if (!alreadyExists) {
                const htmlLayer = this.createHtmlLayerFromObject(obj, html.id, html.content);
                this.canvasHTMLLayers().push(htmlLayer);
                // this.playlistService.onPlayContent(html.content);
              }

            } else if (obj.data) {
              const data: any = obj.data;

              if (data.type === 'video') {
                this.onAddVideoToCanvas(newCanvas, data, obj);
                newCanvas.remove(obj);
              }
            }
          });
        }, 0);

        // View-only canvas tweaks
        if (options.isViewOnly) {
          newCanvas.selection = false;
          newCanvas.skipTargetFind = true;
        }

        // Register events if required
        if (options.registerEvents) {
          this.syncDivsWithFabric(newCanvas);
        }

        newCanvas.requestRenderAll();
      });

      return newCanvas;
    } catch (error) {
      console.log('error on initCanvas', error);
      return null;
    }
  }
  
  private updateCanvasSize(canvasContainer: any, totalScale: number, zoomLevel: number) {
    const canvas = this.getCanvas();
    if (!canvas) return;
    const { width, height } = this.defaultResolution;

    const newContainerWidth = width * totalScale;
    const newContainerHeight = height * totalScale;

    canvasContainer.style.width = `${newContainerWidth}px`;
    canvasContainer.style.height = `${newContainerHeight}px`;

    const bounds = canvasContainer.getBoundingClientRect();
    const containerWidth = bounds.width;
    const containerHeight = bounds.height;

    canvas.setDimensions({ width: containerWidth, height: containerHeight });
    canvas.setZoom(zoomLevel);
    canvas.requestRenderAll();
  }
  
  private syncDivsWithFabric(canvas: fabric.Canvas) {
    const events = [
      'object:added',
      'object:moving',
      'object:scaling',
      'object:rotating',
      'object:modified',
      'object:removed',
      'selection:created',
      'selection:updated',
      'selection:cleared',
      'after:render'
    ];

    events.forEach((event: any) =>
      canvas.on(event, () => {        
        this.updateHtmlLayers()
      })
    );
  }

  private updateHtmlLayers() {
    this.canvasHTMLLayers().forEach((layer, index) => {
      const obj = layer.fabricObject;      
      const updated = this.createHtmlLayerFromObject(obj, index, layer.content);

      Object.assign(layer, updated);
    });
  }
  
  private createHtmlLayerFromObject(obj: fabric.Object | any, id: any, content: any) {
    const canvas = this.getCanvas();

    const zoom = canvas.getZoom();

    // Get real screen bounds
    const bounds = obj.getBoundingRect();
    
    const left = bounds.left * zoom;
    const top = bounds.top * zoom;
    const width = bounds.width * zoom;
    const height = bounds.height * zoom;
    const angle = obj.angle || 0;

    if (obj.html) obj.setControlsVisibility({ mtr: false, tl: false, tr: false, mt: false, ml: false, mb: false, mr: false, bl: false, });
    
    return {
      id,
      left,
      top,
      width,
      height,
      rotation: angle,
      content,
      fabricObject: obj,
    };
  }
}
