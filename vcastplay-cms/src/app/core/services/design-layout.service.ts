import { computed, inject, Injectable, signal } from '@angular/core';
import { DesignLayout, HtmlLayer } from '../interfaces/design-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as fabric from 'fabric';


interface GuideLine {
  line: fabric.Line;
}

@Injectable({
  providedIn: 'root'
})
export class DesignLayoutService {

  router = inject(Router);
  
  private canvas!: fabric.Canvas;
  private guides: GuideLine[] = [];
  private alignThreshold = 5; // pixels for snapping/align detection

  private designSignal = signal<DesignLayout[]>([]);
  designs = computed(() => this.designSignal());

  isEditMode = signal<boolean>(false);
  loadingSignal = signal<boolean>(false);
  showApprove = signal<boolean>(false);
  showCanvasSize = signal<boolean>(false);

  DEFAULT_SCALE = signal<number>(0.45);
  SELECTION_STYLE = signal<any>({
    borderColor: '#36A2EB',
    cornerColor: '#36A2EB',
    cornerStyle: 'circle',
    cornerSize: 6,
    transparentCorners: false
  })

  selectedDesign = signal<DesignLayout | null>(null);
  selectedArrDesign = signal<DesignLayout[]>([]);
  
  rows = signal<number>(8);
  totalRecords = signal<number>(0);
  zoomLevel = signal<number>(1);

  designForm: FormGroup = new FormGroup({
    id: new FormControl(0, { nonNullable: true }),
    name: new FormControl('New Design', [ Validators.required ]),
    description: new FormControl('This is a new design', [ Validators.required ]),
    canvas: new FormControl(null),
    htmlLayers: new FormControl(null),
    color: new FormControl('#ffffff', { nonNullable: true }),
    approvedInfo: new FormGroup({
      approvedBy: new FormControl('Admin'),
      approvedOn: new FormControl(new Date()),
      remarks: new FormControl(''),
    }),
    status: new FormControl('active'),
    isActive: new FormControl(false),
    screen: new FormControl(null, [ Validators.required ]),
  });

  canvasProps: any = {
    zoom: false,
    drag: false,
  }

  selectedColor = signal<string>('#000000');
  canvasActiveObject = signal<any>(null);
  canvasHTMLLayers = signal<HtmlLayer[]>([]);

  constructor() { }

  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  getCanvas(): fabric.Canvas {
    return this.canvas;
  }

  onLoadDesigns() {
    this.designSignal.set([
      {
        id: 1,
        name: 'Default',
        description: 'Default design layout',
        canvas: null,
        status: 'active',
        createdOn: new Date(),
        updatedOn: new Date()
      }
    ])
  }

  onGetDesigns() {
    if (this.designs().length == 0) this.onLoadDesigns();
    return this.designs();
  }

  onSaveDesign(design: DesignLayout) {
    const canvas = this.getCanvas();
    const htmlLayers = this.canvasHTMLLayers();
    const data = canvas.toObject(['html']);    
    
    const tempData = this.designs();
    const { id, status, ...info } = design;
    const index = tempData.findIndex(item => item.id == design.id);

    if (index !== -1) tempData[index] = { ...design, canvas: JSON.stringify(data), htmlLayers, updatedOn: new Date() };
    else tempData.push({ id: tempData.length + 1, status: 'pending', ...info, 
      canvas: JSON.stringify(data), htmlLayers, createdOn: new Date(), updatedOn: new Date(), approvedInfo: { approvedBy: '', approvedOn: null, remarks: '' } });

    this.designSignal.set([...tempData]);
    this.totalRecords.set(this.designs().length);
    /**CALL POST API */
  }

  onEditDesign(canvasElement: HTMLCanvasElement, design: DesignLayout) {
    const { screen, canvas }: any = design;
    const [ width, height ] = screen.displaySettings.resolution.split('x').map(Number);
    
    const canvasData = JSON.parse(canvas);
    const newCanvas = new fabric.Canvas(canvasElement, {
      width: width * this.DEFAULT_SCALE(), 
      height: height * this.DEFAULT_SCALE(), 
      backgroundColor: canvasData.background,
      selection: false,
      preserveObjectStacking: true,
    });
    
    newCanvas.loadFromJSON(canvasData, () => {
      setTimeout(() => {
        const objects = newCanvas.getObjects();
        objects.forEach((obj: any, index: number) => { 
          if (!obj.html) return;
          const html: any = obj.html;
          const alreadyExists = this.canvasHTMLLayers().find(item => item.id == html.id);
                
          if (!alreadyExists ) {
            const htmlLayer = this.createHtmlLayerFromObject(obj, html.id, html.content);
            this.canvasHTMLLayers().push(htmlLayer);
          }
        });        

        this.setCanvas(newCanvas);
        this.registerCanvasEvents(newCanvas);
        this.registerAlignmentGuides(newCanvas);
        this.syncDivsWithFabric(newCanvas);
        newCanvas.requestRenderAll();        
      }, 50);
    });
  }

  onDeleteDesign(design: DesignLayout) { }

  onDuplicateDesign(design: DesignLayout) { }

  onCreateCanvas(canvasElement: HTMLCanvasElement, resolution: { width: number, height: number }, backgroundColor: string = '#ffffff') {
    const canvas = new fabric.Canvas(canvasElement, { 
      width: resolution.width * this.DEFAULT_SCALE(), 
      height: resolution.height * this.DEFAULT_SCALE(), 
      backgroundColor,
      selection: false,
      preserveObjectStacking: true,
    });

    this.registerCanvasEvents(canvas);
    this.setCanvas(canvas);
    this.registerAlignmentGuides(canvas);
    this.syncDivsWithFabric(canvas);
    canvas.renderAll();
  }

  onExitCanvas() {
    this.designForm.reset();
    this.canvas.clear();
    this.canvas.dispose();
    this.canvas = undefined as any;
    this.router.navigate(['/layout/design-layout-library']);
  }

  onZoomCanvas(factor: number) {
    const canvas = this.getCanvas();
    const zoom = canvas.getZoom() * factor;
    const { width, height } = this.canvasDimensions(canvas);
    const canvasWidth = width * factor;
    const canvasHeight = height * factor;      

    if ((canvasWidth * zoom) <= 250) return;

    // Resize the canvas DOM and internal drawing buffer
    canvas.setDimensions({ width: canvasWidth, height: canvasHeight });

    // Scale every object proportionally
    canvas.getObjects().forEach(obj => {
      obj.scaleX! *= factor;
      obj.scaleY! *= factor;
      obj.left! *= factor;
      obj.top! *= factor;
      obj.setCoords();
    });

    canvas.renderAll();
  }

  onSelection() {
    this.canvas.selection = true;
    this.canvasProps.drag = false;
    this.canvas.defaultCursor = 'pointer';
  }

  onPan() {
    this.canvasProps.drag = true;
    this.canvas.selection = false; 
    this.canvas.discardActiveObject();
    this.canvas.defaultCursor = 'grab';
  }

  onMove() {
    this.canvas.discardActiveObject();
    this.canvasProps.drag = false;
    this.canvas.selection = false; 
    this.canvas.defaultCursor = 'pointer';
  }

  onChangeColor(color: string) {
    const activeObject: any = this.canvas.getActiveObjects();
    activeObject.forEach((object: fabric.Object) => {
      if (object.type === 'rect') object.set('fill', color);
    });
    this.canvas.requestRenderAll();
  }

  onLayerArrangement(position: string) {
    const object: any = this.canvas.getActiveObject();    
    switch (position) {
      case 'forward':
        this.canvas.bringObjectForward(object, true);
        break;
      case 'backward':
        this.canvas.sendObjectBackwards(object, true);
        break;
      case 'front':
        this.canvas.bringObjectToFront(object);
        break;
      default:
        this.canvas.sendObjectToBack(object);
        break;
    }
    this.canvas.discardActiveObject();
    this.canvas.setActiveObject(object);
    this.canvas.requestRenderAll();
  }

  // onDisableMenu() {
  //   const fileMenu = this.layoutItems.find(menu => menu.label === 'File');
  //   if (fileMenu && fileMenu.items) {
  //     const saveItem = fileMenu.items.find(item => item.label === 'New');
  //     if (saveItem) {
  //       saveItem.disabled = !saveItem.disabled; // toggle enable/disable
  //     }
  //   }
  // }

  onAddTextToCanvas(content: string = 'Enter text here', fill: string = '#000000') {
    const tempText = new fabric.FabricText(content, { fontSize: 12, fontFamily: 'Arial', fill });

    this.canvas.discardActiveObject();
    this.canvas.selection = false; 
    this.canvasProps.drag = false;
    this.canvas.defaultCursor = 'pointer';
    const text = new fabric.Textbox(content, {
      left: 100,
      top: 100,
      fontSize: 12,
      fontFamily: 'Arial',
      fill,
      editable: true,
      width: tempText.width
    })

    this.canvas.add(text);
  }

  onAddRectangleToCanvas(color: string = '#808080') {
    this.canvas.discardActiveObject();
    this.canvas.selection = false; 
    this.canvasProps.drag = false;
    this.canvas.defaultCursor = 'pointer';
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: color
    });

    this.canvas.add(rect);
  }

  onAddLineToCanvas(color: string = '#808080') {
    this.canvas.discardActiveObject();
    this.canvas.selection = false; 
    this.canvasProps.drag = false;
    this.canvas.defaultCursor = 'pointer';
    const line = new fabric.Line([50, 100, 250, 100], {
      stroke: color,
      strokeWidth: 1
    });

    this.canvas.add(line);
  }

  onAddHTMLToCanvas() {
    const length: number = this.canvasHTMLLayers().length;
    const rect = new fabric.Rect({
      left: 100 + length * 50,
      top: 100 + length * 50,
      width: 200,
      height: 100,
      fill: 'transparent',
      strokeWidth: 2,
      hasControls: true,
      selectable: true,
      lockRotation: true,
    });

    rect.setControlsVisibility({ mtr: false });

    this.canvas.add(rect);
    const htmlLayer = this.createHtmlLayerFromObject(rect, length + 1, `Layer ${length + 1}`);
    this.canvasHTMLLayers().push(htmlLayer);

    this.canvas.setActiveObject(rect);
    rect.set('html', htmlLayer);
  }

  onDuplicateLayer(canvas: fabric.Canvas) {
    const activeObject = canvas.getActiveObjects();
    if (!activeObject || activeObject.length === 0) return;

    const clones: fabric.Object[] = [];

    canvas.discardActiveObject();
    Promise.all(
      activeObject.map((object: fabric.Object) =>
        object.clone().then((cloned) => {
          cloned.set({
            left: object.left += 10,
            top: object.top += 10,
            evented: true,
            selectable: true,
            ...this.SELECTION_STYLE()
          });
          cloned.setCoords();
          canvas.add(cloned);
          clones.push(cloned);
        })
      )
    ).then(() => {
      const selection = new fabric.ActiveSelection(clones, { canvas });
      selection.setCoords();
      canvas.setActiveObject(selection);
      canvas.requestRenderAll();
    });
  }

  onSelectAllLayers(canvas: fabric.Canvas) {
    const objects = canvas.getObjects();
    if (objects && objects.length > 0) {
      const selection = new fabric.ActiveSelection(objects, { canvas });
      selection.set(this.SELECTION_STYLE());
      selection.setCoords();
      canvas.setActiveObject(selection);
      canvas.requestRenderAll();
    }
  }

  onRemoveLayer(canvas: fabric.Canvas) {
    const activeObject = canvas.getActiveObjects();
    if (!activeObject || activeObject.length === 0) return;

    canvas.remove(...activeObject);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  /**
   * ====================================================================================================================================
   * Private methods insert here
   * ====================================================================================================================================
   */

  private canvasDimensions(canvas: fabric.Canvas) {
    return { width: canvas.getWidth(), height: canvas.getHeight() }
  }
  
  private syncDivsWithFabric(canvas: fabric.Canvas) {
    const events = [
      'object:added',
      'object:moving',
      'object:scaling',
      'object:rotating',
      'object:modified',
      'selection:created',
      'selection:updated',
      'selection:cleared',
      'after:render'
    ];

    events.forEach((event: any) =>
      canvas.on(event, () => this.updateHtmlLayers())
    );
  }

  private updateHtmlLayers() {
    this.canvasHTMLLayers().forEach((layer, index) => {
      const obj = layer.fabricObject;
      const updated = this.createHtmlLayerFromObject(obj, index, layer.content);

      Object.assign(layer, updated);
    });
  }

  private createHtmlLayerFromObject(obj: fabric.Object, id: number, content: any) {
    const width = (obj.width || 0) * (obj.scaleX || 1);
    const height = (obj.height || 0) * (obj.scaleY || 1);
    const angle = obj.angle || 0;
    const center = obj.getCenterPoint();

    const rad = fabric.util.degreesToRadians(angle);
    const offsetX = -width / 2;
    const offsetY = -height / 2;
    const rotatedX = offsetX * Math.cos(rad) - offsetY * Math.sin(rad);
    const rotatedY = offsetX * Math.sin(rad) + offsetY * Math.cos(rad);

    const topLeftX = center.x + rotatedX;
    const topLeftY = center.y + rotatedY;

    return {
      id,
      top: topLeftY,
      left: topLeftX,
      width,
      height,
      rotation: angle,
      content,
      fabricObject: obj,
    };
  }

  
  private registerCanvasEvents(canvas: fabric.Canvas): void {
    canvas.on('selection:created', (e) => {
      const selectedObjects = e.selected || [];
      if (selectedObjects.length === 0) return;

      if (selectedObjects.length > 0) {
        const activeSelection = canvas.getActiveObject() as fabric.ActiveSelection;
        if (activeSelection) {
          activeSelection.set(this.SELECTION_STYLE())
        }
      } else {
        const selected = e.selected?.[0];
        if (selected) {
          if (selected.type === 'image') {
            console.log('Selected layer is an image');
          } else if (selected.type === 'textbox') {
            console.log('Selected layer is text');
          } else if (selected.type === 'video') {
            console.log('Selected layer is a video');
          } else if ((selected as any).customType === 'div') {
            console.log('Selected layer is a custom div');
          }
        }
      }

    });

    canvas.on('selection:updated', (e) => {
      const selected = e.selected?.[0];
      if (selected) {
        selected.set(this.SELECTION_STYLE())
      }
    });

    canvas.on('selection:cleared', () => {
      console.log('No layer selected');
    });

    canvas.on('object:moving', (e) => {
      const { width, height } = this.canvasDimensions(canvas);
      const obj: any = e.target;
      if (!obj || !obj.html) return;

      const boundX = width - obj.getScaledWidth();
      const boundY = height - obj.getScaledHeight();

      obj.left = Math.max(0, Math.min(obj.left || 0, boundX));
      obj.top = Math.max(0, Math.min(obj.top || 0, boundY));
    });

    canvas.on('object:scaling', (e) => {
      const { width, height } = this.canvasDimensions(canvas);
      const obj: any = e.target;
      console.log(obj.type);
      
      if (!obj || !obj.html) return;
      
      const canvasWidth = width;
      const canvasHeight = height;

      const maxWidth = canvasWidth - (obj.left ?? 0);
      const maxHeight = canvasHeight - (obj.top ?? 0);

      const scaledWidth = obj.width! * obj.scaleX!;
      const scaledHeight = obj.height! * obj.scaleY!;

      const MIN_WIDTH = 200;
      const MIN_HEIGHT = 100;

      // ✅ Clamp minimum size
      if (scaledWidth < MIN_WIDTH) obj.scaleX = MIN_WIDTH / obj.width!;
      if (scaledHeight < MIN_HEIGHT)obj.scaleY = MIN_HEIGHT / obj.height!;

      // ✅ Clamp maximum size (canvas bounds)
      if (scaledWidth > maxWidth) obj.scaleX = maxWidth / obj.width!;
      if (scaledHeight > maxHeight) obj.scaleY = maxHeight / obj.height!;

      canvas.requestRenderAll();
    })
  }

  private registerAlignmentGuides(canvas: fabric.Canvas) {
    canvas.on('object:moving', (e) => {
      const activeObject = e.target;
      if (!activeObject) return;

      this.clearGuides(canvas);

      const objects = canvas.getObjects().filter(o => o !== activeObject);
      const aCenter = activeObject.getCenterPoint();

      objects.forEach(obj => {
        const oCenter = obj.getCenterPoint();

        // Vertical alignment (center)
        if (Math.abs(aCenter.x - oCenter.x) < this.alignThreshold) {
          this.addVerticalGuide(canvas, oCenter.x);
        }

        // Horizontal alignment (center)
        if (Math.abs(aCenter.y - oCenter.y) < this.alignThreshold) {
          this.addHorizontalGuide(canvas, oCenter.y);
        }

        // Left alignment
        if (Math.abs((activeObject.left || 0) - (obj.left || 0)) < this.alignThreshold) {
          this.addVerticalGuide(canvas, obj.left || 0);
        }

        // Right alignment
        const aRight = (activeObject.left || 0) + (activeObject.width || 0) * (activeObject.scaleX || 1);
        const oRight = (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1);
        if (Math.abs(aRight - oRight) < this.alignThreshold) {
          this.addVerticalGuide(canvas, oRight);
        }

        // Top alignment
        if (Math.abs((activeObject.top || 0) - (obj.top || 0)) < this.alignThreshold) {
          this.addHorizontalGuide(canvas, obj.top || 0);
        }

        // Bottom alignment
        const aBottom = (activeObject.top || 0) + (activeObject.height || 0) * (activeObject.scaleY || 1);
        const oBottom = (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1);
        if (Math.abs(aBottom - oBottom) < this.alignThreshold) {
          this.addHorizontalGuide(canvas, oBottom);
        }
      });

      canvas.requestRenderAll();
    });

    canvas.on('mouse:up', () => {
      this.clearGuides(canvas);
      canvas.requestRenderAll();
    });
  }

  private addVerticalGuide(canvas: fabric.Canvas, x: number) {
    const guide = new fabric.Line([x, 0, x, canvas.getHeight()], {
      stroke: '#4BC0C0',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    });
    canvas.add(guide);
    this.guides.push({ line: guide });
  }

  private addHorizontalGuide(canvas: fabric.Canvas, y: number) {
    const guide = new fabric.Line([0, y, canvas.getWidth(), y], {
      stroke: '#4BC0C0',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    });
    canvas.add(guide);
    this.guides.push({ line: guide });
  }

  private clearGuides(canvas: fabric.Canvas) {
    this.guides.forEach(g => canvas.remove(g.line));
    this.guides = [];
  }
}
