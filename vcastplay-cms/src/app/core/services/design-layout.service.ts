import { computed, inject, Injectable, signal } from '@angular/core';
import { DesignLayout } from '../interfaces/design-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import * as fabric from 'fabric';

@Injectable({
  providedIn: 'root'
})
export class DesignLayoutService {

  router = inject(Router);
  
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

  designForm: FormGroup = new FormGroup({
    id: new FormControl(0, { nonNullable: true }),
    name: new FormControl('New Design', [ Validators.required ]),
    description: new FormControl('This is a new design', [ Validators.required ]),
    canvas: new FormControl(null),
    color: new FormControl('#808080', { nonNullable: true }),
    approvedInfo: new FormGroup({
      approvedBy: new FormControl('Admin'),
      approvedOn: new FormControl(new Date()),
      remarks: new FormControl(''),
    }),
    isActive: new FormControl(false),
    screen: new FormControl(null, [ Validators.required ]),
  });

  constructor() { }

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

  onSaveDesign(design: DesignLayout) { }

  onDeleteDesign(design: DesignLayout) { }

  onDuplicateDesign(design: DesignLayout) { }

  onCreateCanvas(canvasElement: HTMLCanvasElement, resolution: { width: number, height: number }, backgroundColor: string = '#ffffff') {
    const canvas = new fabric.Canvas(canvasElement, { 
      width: resolution.width * this.DEFAULT_SCALE(), 
      height: resolution.height * this.DEFAULT_SCALE(), 
      backgroundColor,
      selection: true 
    });

    this.registerSelectionEvents(canvas);
    return canvas
  }

  onZoomCanvas(canvas: fabric.Canvas, factor: number) {
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

  // onDisableMenu() {
  //   const fileMenu = this.layoutItems.find(menu => menu.label === 'File');
  //   if (fileMenu && fileMenu.items) {
  //     const saveItem = fileMenu.items.find(item => item.label === 'New');
  //     if (saveItem) {
  //       saveItem.disabled = !saveItem.disabled; // toggle enable/disable
  //     }
  //   }
  // }

  onAddTextToCanvas(canvas: fabric.Canvas, content: string) {
    const text = new fabric.Textbox(content, {
      left: 100,
      top: 100,
      fontSize: 16,
      fontFamily: 'Arial',
      fill: '#000000'
    })

    canvas.add(text);
  }

  private registerSelectionEvents(canvas: fabric.Canvas): void {
  canvas.on('selection:created', (e) => {
    const selected = e.selected?.[0];
    if (selected) {
      console.log('Layer selected:', selected);
    }
  });

  canvas.on('selection:updated', (e) => {
    const selected = e.selected?.[0];
    if (selected) {
      console.log('Layer re-selected:', selected);
    }
  });

  canvas.on('selection:cleared', () => {
    console.log('No layer selected');
  });
}
  

  // keepInsideCanvas(e: any): void {
  //   const obj = e.target;
  //   if (!obj) return;

  //   const canvasWidth = this.canvas.getWidth();
  //   const canvasHeight = this.canvas.getHeight();
  //   const bound = obj.getBoundingRect(true);

  //   // Left boundary
  //   if (bound.left < 0) obj.left -= bound.left;
  //   // Top boundary
  //   if (bound.top < 0) obj.top -= bound.top;
  //   // Right boundary
  //   if (bound.left + bound.width > canvasWidth)
  //     obj.left -= (bound.left + bound.width) - canvasWidth;
  //   // Bottom boundary
  //   if (bound.top + bound.height > canvasHeight)
  //     obj.top -= (bound.top + bound.height) - canvasHeight;

  //   obj.setCoords();
  // }

  onSaveCanvas(canvas: fabric.Canvas) {
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas.png';
    link.click();
  }
}
