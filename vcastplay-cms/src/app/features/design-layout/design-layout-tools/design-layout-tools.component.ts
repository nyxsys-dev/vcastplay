import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayoutService } from '../design-layout.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-design-layout-tools',
  imports: [ PrimengUiModule ],
  templateUrl: './design-layout-tools.component.html',
  styleUrl: './design-layout-tools.component.scss'
})
export class DesignLayoutToolsComponent {

  @Output() resetDragPosition = new EventEmitter<void>();

  designLayoutService = inject(DesignLayoutService);

  shapeItems: MenuItem[] = [
    { label: 'Circle', command: () => this.onClickAddShape('circle'), image: 'assets/icons/circle.png' },
    { label: 'Rectangle', command: () => this.onClickAddShape('rectangle'), image: 'assets/icons/rectangle.png' },
    { label: 'Triangle', command: () => this.onClickAddShape('triangle'), image: 'assets/icons/triangle.png' },
    { label: 'Ellipse', command: () => this.onClickAddShape('ellipse'), image: 'assets/icons/ellipse.png' },
  ]

  textItems: MenuItem[] = [
    { label: 'Text', command: () => this.onClickAddText() },
    { label: 'Marquee', command: () => this.onClickTextMarquee() },
  ]

  onClickSelection() {
    const canvas = this.designLayoutService.getCanvas();
    this.resetDragPosition.emit();
    this.designLayoutService.onSelection(canvas);
  }

  onClickAddText() {
    const canvas = this.designLayoutService.getCanvas();
    this.resetDragPosition.emit();
    this.designLayoutService.onAddTextToCanvas(canvas, 'Enter text here', this.selectedColor());
  }

  onClickAddShape(type: string) {
    const canvas = this.designLayoutService.getCanvas();
    this.resetDragPosition.emit();
    this.designLayoutService.onAddShapeToCanvas(canvas, type, this.selectedColor());
  }
  
  onClickAddContents() {
    this.resetDragPosition.emit();
    this.showContents.set(!this.showContents());
    this.designLayoutService.onSetCanvasProps('content', false, 'default');
  }

  onClickAddLine() {
    const canvas = this.designLayoutService.getCanvas();
    this.resetDragPosition.emit();
    this.designLayoutService.onAddLineToCanvas(canvas, this.selectedColor());
  }

  onClickPan() {
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onPan(canvas);
  }

  onClickMove() {
    this.resetDragPosition.emit();
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onMove(canvas);
  }

  onClickZoom() {
    this.resetDragPosition.emit();
    const canvas = this.designLayoutService.getCanvas();
    this.zoomControl.patchValue(canvas.getZoom());
    canvas.discardActiveObject();
    this.designLayoutService.onSetCanvasProps('zoom', true, 'default');
  }

  onClickTextMarquee() {
    this.showInputMarquee.set(true)
  }

  onUnSelectAllLayers() {
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onUnSelectAllLayers(canvas);
  }
  
  onChangeColor(event: any) {
    this.designLayoutService.onChangeColor(event.value);
  }
  
  get zoomControl() { return this.designLayoutService.zoomControl; }
  get showContents() { return this.designLayoutService.showContents; }
  get selectedColor() { return this.designLayoutService.selectedColor; }
  get objectPropsForm() { return this.designLayoutService.objectPropsForm; }
  get showInputMarquee() { return this.designLayoutService.showInputMarquee; }
}
