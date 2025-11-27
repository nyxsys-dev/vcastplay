// Options 1:

import { ChangeDetectorRef, Component, computed, ElementRef, HostListener, inject, Input, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { Assets } from '../../assets/assets';
import { Playlist } from '../../playlist/playlist';
import { DesignLayoutService } from '../design-layout.service';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { Screen } from '../../screens/screen';
import { environment } from '../../../../environments/environment.development';
import { UtilityService } from '../../../core/services/utility.service';
import { DesignEditorService } from '../design-editor.service';
import { DesignLayout, LayerItem, SelectionBox } from '../design-layout';
import { v7 as uuidv7 } from 'uuid';
import interact from 'interactjs';

@Component({
  selector: 'app-design-editor',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './design-editor.component.html',
  styleUrl: './design-editor.component.scss',
})
export class DesignEditorComponent {

  @ViewChild('workspace') workspaceRef!: ElementRef<HTMLDivElement>;
  @ViewChild('artboard') artboardRef!: ElementRef<HTMLDivElement>

  @Input() items!: Assets | Playlist | any;

  designLayoutService = inject(DesignLayoutService);
  designEditorService = inject(DesignEditorService);
  utils = inject(UtilityService);
  
  iconPath: string = environment.iconPath;
  ARTBOARD_RESOLUTION: any;

  artboardObjects: LayerItem[] = [];

  isDragging: boolean = false;

  showContent: boolean = false;

  scale: number = 1;
  translateX: number = 0;
  translateY: number = 0;
  lastX: number = 0;
  lastY: number = 0;

  defaultScale: number = 1;
  defaultX: number = 0;
  defaultY: number = 0;

  // Selection
  isSelection: boolean = false;
  selectionBox: { x: number, y: number, w: number, h: number } | null = null;
  multiBox: SelectionBox | null = null;
  lastAngle: number = 0;

  currentObject: any;

  hasUnsavedChanges!: () => boolean

  @HostListener('window:resize')
  onResize() {
    if (this.ARTBOARD_RESOLUTION) this.onFitToWrapper();
  }
  
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.hasUnsavedData()) {
      $event.returnValue = true
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.onInitInteractBBox();
  }

  onInitInteractBBox() {
    interact('.multi-bbox, .item')
      .draggable({
        listeners: { move: (event) => this.onItemMove(event) },
        inertia: true
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: { move: (event) => this.onItemResize(event) },
      })

    interact('.multi-bbox .rotate-handle').draggable({
      listeners: { 
        // start: (event) => this.onItemRotateStart(event),
        move: (event) => this.onItemRotate(event),
        // end: () => this.onUpdateMultiBox()
        // end: (event) => this.onItemRotateEnd()
      },
      cursorChecker: () => 'grab'
    })
  }

  onArtboardFunction(event: MouseEvent) {
    if (this.isDragging) this.onStartPan(event);
    if (!this.isDragging) {
      this.onItemSelection(event);
    }
  }

  onItemRotate(event: any) {
    if (!this.multiBox) return; 
    
    const boxElement = document.querySelector('.multi-bbox');
    if (!boxElement) return;
    
    const rect = boxElement.getBoundingClientRect();
    
    // Find Center Point of multiBox
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const radians = Math.atan2(mouseY - centerY, mouseX - centerX);
    const degrees = (radians * (180 / Math.PI) + 90) % 360;
    
    // Incremental rotation
    const delta = degrees - this.multiBox.a;
    this.multiBox.a = degrees;

    // this.artboardObjects.filter(i => i.selected).forEach(item => {
    //   item.a = this.multiBox?.a || 0;
    // });
    
    // get group center
    const { cx, cy }: any = this.onCalculateGroupCenter();
    this.artboardObjects.filter(i => i.selected).forEach(item => {
      // get vector from item center to group center
      const itemCenterX = item.x + item.w / 2;
      const itemCenterY = item.y + item.h / 2;
      
      const dx = itemCenterX - cx;
      const dy = itemCenterY - cy;

      // Rotate the vector
      const rad = delta * Math.PI / 180;
      const rotatedX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const rotatedY = dx * Math.sin(rad) + dy * Math.cos(rad);

      // Update item position so the item rotates around group center
      item.x = cx + rotatedX - item.w / 2;
      item.y = cy + rotatedY - item.h / 2;

      // Optional: update individual rotation if needed
      item.a = (item.a || 0) + delta;
    })

    // this.onUpdateMultiBox();
  }

  onItemMove(event: any) {    
    const scale = this.scale;
    if (!this.multiBox) return; 
    
    // Get Mouse Position on a scaled artboard
    const dx = event.dx / scale;
    const dy = event.dy / scale;

    this.artboardObjects.filter(i => i.selected).forEach(item => {
      item.x += dx;
      item.y += dy;
    });

    this.onUpdateMultiBox();
  }

  onItemResize(event: any) {
    const scale = this.scale;
    if (!this.multiBox) return;

    // Get Mouse Position on a scaled artboard
    const deltaW = event.deltaRect.width / scale;
    const deltaH = event.deltaRect.height / scale;
    const deltaX = event.deltaRect.left / scale;
    const deltaY = event.deltaRect.top / scale;

    this.multiBox.w += deltaW;
    this.multiBox.h += deltaH;
    this.multiBox.x += deltaX;
    this.multiBox.y += deltaY;
    this.multiBox.cx = this.multiBox.x + this.multiBox.w / 2;
    this.multiBox.cy = this.multiBox.y + this.multiBox.h / 2;

    this.artboardObjects.filter(i => i.selected).forEach(item => {
      item.w += deltaW;
      item.h += deltaH;
      item.x += deltaX;
      item.y += deltaY;
    });
  }

  onItemSelection(event: any) {
    const scale = this.scale;
    const artboard = this.artboardRef.nativeElement;

    // Only allow when clicking the artboard itself
    if (event.target !== artboard) return;

    // Clear selection first
    this.onClearSelection();

    const rect = artboard.getBoundingClientRect();
    const startX = (event.clientX - rect.left) / this.scale;
    const startY = (event.clientY - rect.top) / this.scale;

    this.selectionBox = { x: startX, y: startY, w: 0, h: 0 };

    const move = (ev: MouseEvent) => {
      const currentX = (ev.clientX - rect.left) / scale;
      const currentY = (ev.clientY - rect.top) / scale;

      const x = Math.min(startX, currentX);
      const y = Math.min(startY, currentY);
      const w = Math.abs(currentX - startX);
      const h = Math.abs(currentY - startY);

      this.selectionBox = { x, y, w, h };

      // Select items
      this.artboardObjects.forEach(item => {
        item.selected =
          item.x < x + w &&
          item.x + item.w > x &&
          item.y < y + h &&
          item.y + item.h > y;
      });
    };

    const stop = () => {
      this.selectionBox = null;
      this.onUpdateMultiBox();
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
  }

  onItemClick(event: MouseEvent, item: LayerItem) {
    event.stopPropagation();
    if (event.ctrlKey || event.metaKey) {
      item.selected = !item.selected;
    } else {
      this.artboardObjects.forEach(i => i.selected = false);
      item.selected = true;
      this.currentObject = item;
    }
    this.onUpdateMultiBox();
  }

  onClearSelection() {
    this.currentObject = null;
    this.artboardObjects.forEach(i => i.selected = false);
    this.onUpdateMultiBox();
  }

  onUpdateMultiBox() {
    const selected = this.artboardObjects.filter(i => i.selected);

    if (selected.length === 0) {
      this.multiBox = null;

      this.currentObject = this.multiBox;
      return;
    }

    // -------- SINGLE SELECTION --------
    if (selected.length === 1) {
      const item = selected[0];
      const x = item.x;
      const y = item.y;
      const w = item.w;
      const h = item.h;

      this.multiBox = { x, y, w, h, a: item.a || 0, cx: x + w / 2, cy: y + h / 2, };
      this.currentObject = this.multiBox;
      return;
    }

    // -------- MULTI SELECTION --------
    const minX = Math.min(...selected.map(i => i.x));
    const minY = Math.min(...selected.map(i => i.y));
    const maxX = Math.max(...selected.map(i => i.x + i.w));
    const maxY = Math.max(...selected.map(i => i.y + i.h));

    const w = maxX - minX;
    const h = maxY - minY;

    this.multiBox = { x: minX, y: minY, w, h, a: this.multiBox?.a || 0, cx: minX + w / 2, cy: minY + h / 2, };
    this.currentObject = this.multiBox;
  }

  onCalculateGroupCenter() {
    let sumX: number = 0;
    let sumY: number = 0;

    this.artboardObjects.filter(i => i.selected).forEach(item => {
      sumX += item.x + item.w / 2;
      sumY += item.y + item.h / 2;
    });

    const centerX = sumX / this.artboardObjects.filter(i => i.selected).length;
    const centerY = sumY / this.artboardObjects.filter(i => i.selected).length;

    return { cx: centerX, cy: centerY };
  }

  canvasSizeChange(event: any) {
    if (!event) return;

    this.designForm.patchValue(event);
    const screen: Screen = event.screen;
    const [width, height]: any = screen?.displaySettings.resolution.split('x');

    this.ARTBOARD_RESOLUTION = { width, height };

    this.cdr.detectChanges();

    this.onFitToWrapper();
  }

  onApplyTransform() {
    const artboard = this.artboardRef.nativeElement;
    artboard.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  onFitToWrapper() {
    const workspace = this.workspaceRef.nativeElement;
    const artboard = this.ARTBOARD_RESOLUTION;

    const clientWidth = workspace.clientWidth;
    const clientHeight = workspace.clientHeight;

    const scaleX = clientWidth / artboard.width;
    const scaleY = clientHeight / artboard.height;

    this.scale = Math.min(scaleX, scaleY);
    this.translateX = (clientWidth - artboard.width * this.scale) / 2;
    this.translateY = (clientHeight - artboard.height * this.scale) / 2;

    // Save default
    this.defaultX = this.translateX;
    this.defaultY = this.translateY;
    this.defaultScale = this.scale;

    this.onApplyTransform();
  }

  onWheel(event: WheelEvent) {
    if (!event.ctrlKey) return;
    event.preventDefault();

    const artboard = this.artboardRef.nativeElement;

    const zoomSpeed = 0.1;
    const oldScale = this.scale;

    this.scale *= event.deltaY < 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
    this.scale=  Math.min(8, Math.max(0.1, this.scale));

    const rect = artboard.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.translateX -= (mouseX / oldScale - mouseX / this.scale);
    this.translateY -= (mouseY / oldScale - mouseY / this.scale);

    this.onApplyTransform();
  }

  onStartPan(event: MouseEvent) {
    if (!this.isDragging) return;

    const artboard = this.artboardRef.nativeElement;
    this.lastX = event.clientX;
    this.lastY = event.clientY;

    const move = (ev: MouseEvent) => {
      if (!this.isDragging) return;

      artboard.style.cursor = 'grabbing';
      this.translateX += ev.clientX - this.lastX;
      this.translateY += ev.clientY - this.lastY;

      this.lastX = ev.clientX;
      this.lastY = ev.clientY;

      this.onApplyTransform();
    }

    const stop = () => {
      artboard.style.cursor = 'grab';
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
    }

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
  }

  onReset() {
    this.scale = this.defaultScale;
    this.translateX = this.defaultX;
    this.translateY = this.defaultY;
    this.onApplyTransform();
  }

  onToolbarChange(event: any) {
    const { label, value } = event;
    const artboard = this.artboardRef.nativeElement;
    artboard.style.cursor = 'default';
    this.isDragging = false;
    this.isSelection = false;

    switch (label) {
      case 'Content':
        this.showContent = value;
        break;
      case 'Hand':
        artboard.style.cursor = 'grab';
        this.isDragging = value;
        break;
      case 'Select':
        this.isSelection = value;
        break;
      case 'Zoom':
        this.onReset();
        break;
      default:
        break;
    }
  }

  onSelectedContentChange(event: Assets | DesignLayout | any) {
    if (!event) return;
    const artboardRect = this.artboardRef.nativeElement.getBoundingClientRect();
    const randomX = Math.floor(Math.random() * (artboardRect.width / this.scale));
    const randomY = Math.floor(Math.random() * (artboardRect.height / this.scale));

    this.artboardObjects.push({ 
      id: uuidv7(),
      type: event.type,
      content: event,
      x: randomX,
      y: randomY,
      w: 100,
      h: 100,
      a: 0,
      selected: false,
      locked: false,
      hidden: false,
      zIndex: 0
    });
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }
  
  getIconPath(name: string): string {
    return `${this.iconPath}${this.isDarkTheme ? `${name}-white.png` : `${name}.png`}`
  }
  
  hasUnsavedData(): boolean {
    return this.designForm.invalid
  }

  get designForm() {
    return this.designEditorService.designForm
  }

  get showCanvasSize() {
    return this.designEditorService.showCanvasSize
  }

  get menuBarItems() {
    return this.designEditorService.menuBarItems;
  }

  get isDarkTheme() {
    return this.utils.isDarkTheme()
  }
}