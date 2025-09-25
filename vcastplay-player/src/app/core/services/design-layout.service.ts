import { Injectable, signal } from '@angular/core';
import { DesignLayout, HtmlLayer } from '../interfaces/design-layout';
import * as fabric from 'fabric';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DesignLayoutService {
  
  private canvas!: fabric.Canvas;
  private animFrameId!: number;
  
  timeout: number = environment.timeout;
  zoomLevel: number = 1;
  defaultScale: number = 0;
  defaultResolution: any;

  constructor() { }

  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  getCanvas(): fabric.Canvas {
    return this.canvas;
  }

  removeCanvas(canvas?: fabric.Canvas) {
    if (canvas) {
      canvas.clear();
      canvas.dispose();
      canvas = undefined as any;
    }
    cancelAnimationFrame(this.animFrameId);
  }

  onPreloadCanvas(viewport: any, canvasContainer: any, design: DesignLayout) {
    return new Promise((resolve) => {
      this.initCanvas(viewport, canvasContainer, design, { renderOnAddRemove: true, autoPlayVideos: true, isViewOnly: true, registerEvents: true }).then((canvas: any) => {
        this.setCanvas(canvas);
        resolve(canvas);
      });
    })
  }
  
  onScaleCanvas(canvas: fabric.Canvas, parentElement: any, canvasContainer: any) {
    if (!canvas) return;

    const { width, height } = this.defaultResolution;
    const bounds = parentElement.getBoundingClientRect();
    const fitScale = Math.min(bounds.width / width, bounds.height / height);

    const totalZoom = fitScale * this.zoomLevel;
    this.updateCanvasSize(canvas, canvasContainer, totalZoom);
  }

  onAddVideoToCanvas(canvas: fabric.Canvas, data: any, fabricObject?: fabric.Object | any) {
    try {
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
      video.poster = '';
      video.currentTime = 1;
      video.load();
      
      video.addEventListener('loadeddata', () => {
        video.currentTime = 0;

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
        videoObj.set('data', { ...data, element: video });

        video.play().catch(err => console.warn('Video play failed:', err));

        canvas.insertAt(videoObj.zIndex, videoObj);
        canvas.requestRenderAll();
        // this.onStartVideoRender(canvas);
      });
      // canvas.add(videoObj);

      // video.load();
      // video.play().catch(err => console.warn('Video play failed:', err));
       

      // this.onStartVideoRender(canvas);    
      // video.remove();
    } catch (error) {
      console.error('Error adding video to canvas', error);
    }
  }
  
  onStartVideoRender(canvas: fabric.Canvas) {
    if (this.animFrameId) return;
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
    return new Promise((resolve, reject) => {
      try {
        const { screen, canvas, htmlLayers }: any = design;
        const [ width, height ] = screen.displaySettings.resolution.split('x').map(Number);
        const canvasData = JSON.parse(canvas);

        const newCanvas = this.onInitFabricCanvas(viewport, canvasElement, { width, height }, canvasData.background);

        newCanvas.setZoom(this.defaultScale)

        if (!options.isViewOnly) this.setCanvas(newCanvas);

        // setTimeout(() => {
          
        // }, this.timeout);
        newCanvas.loadFromJSON(canvasData, () => {
          requestAnimationFrame(() => {
            const objects = newCanvas.getObjects();

            // Sort objects by zIndex
            objects.sort((a: any, b: any) => (a.zIndex ?? 0) - (b.zIndex ?? 0));

            objects.forEach((obj: any) => {
              if (obj.html) {
                const html: any = obj.html;
                const alreadyExists = htmlLayers.find((item: HtmlLayer) => item.id === html.id);

                if (alreadyExists) this.syncDivsWithFabric(newCanvas, design);

              } else if (obj.data) {
                const data: any = obj.data;

                if (data.type == 'video') {
                  this.onAddVideoToCanvas(newCanvas, data, obj);
                  // newCanvas.remove(obj);
                }
              }
            });

            newCanvas.selection = false;
            newCanvas.skipTargetFind = true;

            this.syncDivsWithFabric(newCanvas, design);
            newCanvas.requestRenderAll();
            this.onPlayVideosInCanvas(newCanvas);
          })
        });

        resolve(newCanvas);
      } catch (error) {
        reject('Error initializing canvas: ' + error);
      }
    })
  }
  
  private updateCanvasSize(canvas: fabric.Canvas, canvasContainer: any, zoomLevel: number) {
    const { width, height } = this.defaultResolution;

    const newContainerWidth = width * zoomLevel;
    const newContainerHeight = height * zoomLevel;

    canvasContainer.style.width = `${newContainerWidth}px`;
    canvasContainer.style.height = `${newContainerHeight}px`;

    const bounds = canvasContainer.getBoundingClientRect();
    const containerWidth = bounds.width;
    const containerHeight = bounds.height;

    canvas.setDimensions({ width: containerWidth, height: containerHeight });
    canvas.setZoom(zoomLevel);
    canvas.requestRenderAll();
  }
  
  private syncDivsWithFabric(canvas: fabric.Canvas, design: DesignLayout) {
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
        this.updateHtmlLayers(canvas, design)
      })
    );
  }

  private updateHtmlLayers(canvas: fabric.Canvas, design: DesignLayout) {
    const { htmlLayers }: any = design; 
    const activeObjects: fabric.Object[] = canvas.getObjects();
    
    activeObjects.forEach((object: fabric.Object) => {
      const html = object.get('html');
      if (!html) return;

      const layer = htmlLayers.find((item: any) => item.id === html.id);

      if (layer) {        
        const updated = this.createHtmlLayerFromObject(object, layer.id, layer.content, layer.style, canvas);
        Object.assign(layer, updated);
      }
    })
  }

  private createHtmlLayerFromObject(obj: fabric.FabricObject, id: string, content: any, style: any, canvas: fabric.Canvas) {

    const zoom = canvas.getZoom();    

    // Get real screen bounds
    const bounds = obj.getBoundingRect();

    const html = obj.get('html');
    
    const left = bounds.left * zoom
    const top = bounds.top * zoom
    const width = bounds.width * zoom
    const height = bounds.height * zoom
    const angle = obj.angle || 0;

    if (html && !html.content.marquee) obj.setControlsVisibility({ mtr: false, tl: false, tr: false, mt: false, ml: false, mb: false, mr: false, bl: false, });
    
    return {
      id,
      left,
      top,
      width,
      height,
      rotation: angle,
      content,
      style,
      fabricObject: obj,
    };
  }
}
