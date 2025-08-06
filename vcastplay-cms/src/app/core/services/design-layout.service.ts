import { computed, inject, Injectable, signal } from '@angular/core';
import { DesignLayout } from '../interfaces/design-layout';
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

  canvasActiveObject = signal<any>(null);

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
    const data = canvas.toJSON();
    
    const tempData = this.designs();
    const { id, status, ...info } = design;
    const index = tempData.findIndex(item => item.id == design.id);

    if (index !== -1) tempData[index] = { ...design, canvas: JSON.stringify(data), updatedOn: new Date() };
    else tempData.push({ id: tempData.length + 1, status: 'pending', ...info, 
      canvas: JSON.stringify(data), createdOn: new Date(), updatedOn: new Date(), approvedInfo: { approvedBy: '', approvedOn: null, remarks: '' } });

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
      this.registerSelectionEvents(newCanvas);
      this.setCanvas(newCanvas);
      this.registerAlignmentGuides();
      newCanvas.requestRenderAll();
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

    this.registerSelectionEvents(canvas);
    this.setCanvas(canvas);
    this.registerAlignmentGuides();
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
    const canvasWidth = canvas.getWidth() * factor;
    const canvasHeight = canvas.getHeight() * factor;      

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
    const activeObject: any = this.canvas.getActiveObject();
    if (activeObject && activeObject.type === 'rect') {
      activeObject.set('fill', color);
      this.canvas.requestRenderAll();
    }
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
      editable: true
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
      width: 100,
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

  /**
   * ====================================================================================================================================
   * Private methods insert here
   * ====================================================================================================================================
   */
  private registerSelectionEvents(canvas: fabric.Canvas): void {
    canvas.on('selection:created', (e) => {
      const selectedObjects = e.selected || [];
      if (selectedObjects.length === 0) return;

      if (selectedObjects.length > 0) {
        const activeSelection = canvas.getActiveObject() as fabric.ActiveSelection;
        if (activeSelection) {
          activeSelection.set({borderColor: '#36A2EB',
            cornerColor: '#36A2EB',
            cornerStyle: 'circle',
            cornerSize: 6,
            transparentCorners: false
          })
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
        selected.set({
          borderColor: '#36A2EB',
          cornerColor: '#36A2EB',
          cornerStyle: 'circle',
          cornerSize: 6,
          transparentCorners: false
        })
      }
    });

    canvas.on('selection:cleared', () => {
      console.log('No layer selected');
    });
  }

  private registerAlignmentGuides() {
    this.canvas.on('object:moving', (e) => {
      const activeObject = e.target;
      if (!activeObject) return;

      this.clearGuides();

      const objects = this.canvas.getObjects().filter(o => o !== activeObject);
      const aCenter = activeObject.getCenterPoint();

      objects.forEach(obj => {
        const oCenter = obj.getCenterPoint();

        // Vertical alignment (center)
        if (Math.abs(aCenter.x - oCenter.x) < this.alignThreshold) {
          this.addVerticalGuide(oCenter.x);
        }

        // Horizontal alignment (center)
        if (Math.abs(aCenter.y - oCenter.y) < this.alignThreshold) {
          this.addHorizontalGuide(oCenter.y);
        }

        // Left alignment
        if (Math.abs((activeObject.left || 0) - (obj.left || 0)) < this.alignThreshold) {
          this.addVerticalGuide(obj.left || 0);
        }

        // Right alignment
        const aRight = (activeObject.left || 0) + (activeObject.width || 0) * (activeObject.scaleX || 1);
        const oRight = (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1);
        if (Math.abs(aRight - oRight) < this.alignThreshold) {
          this.addVerticalGuide(oRight);
        }

        // Top alignment
        if (Math.abs((activeObject.top || 0) - (obj.top || 0)) < this.alignThreshold) {
          this.addHorizontalGuide(obj.top || 0);
        }

        // Bottom alignment
        const aBottom = (activeObject.top || 0) + (activeObject.height || 0) * (activeObject.scaleY || 1);
        const oBottom = (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1);
        if (Math.abs(aBottom - oBottom) < this.alignThreshold) {
          this.addHorizontalGuide(oBottom);
        }
      });

      this.canvas.requestRenderAll();
    });

    this.canvas.on('mouse:up', () => {
      this.clearGuides();
      this.canvas.requestRenderAll();
    });
  }

  private addVerticalGuide(x: number) {
    const guide = new fabric.Line([x, 0, x, this.canvas.getHeight()], {
      stroke: '#4BC0C0',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    });
    this.canvas.add(guide);
    this.guides.push({ line: guide });
  }

  private addHorizontalGuide(y: number) {
    const guide = new fabric.Line([0, y, this.canvas.getWidth(), y], {
      stroke: '#4BC0C0',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    });
    this.canvas.add(guide);
    this.guides.push({ line: guide });
  }

  private clearGuides() {
    this.guides.forEach(g => this.canvas.remove(g.line));
    this.guides = [];
  }
}
