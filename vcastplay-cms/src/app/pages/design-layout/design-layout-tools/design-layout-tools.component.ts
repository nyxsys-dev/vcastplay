import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayoutService } from '../../../core/services/design-layout.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-design-layout-tools',
  imports: [ PrimengUiModule ],
  templateUrl: './design-layout-tools.component.html',
  styleUrl: './design-layout-tools.component.scss'
})
export class DesignLayoutToolsComponent {

  @Input() canvasElement!: HTMLCanvasElement;
  @Output() resetDragPosition = new EventEmitter<void>();

  designLayoutService = inject(DesignLayoutService);

  shapeItems: MenuItem[] = [
    { label: 'Circle', command: () => this.onClickAddShape('circle'), image: 'assets/icons/circle.png' },
    { label: 'Rectangle', command: () => this.onClickAddShape('rectangle'), image: 'assets/icons/rectangle.png' },
    { label: 'Triangle', command: () => this.onClickAddShape('triangle'), image: 'assets/icons/triangle.png' },
    { label: 'Ellipse', command: () => this.onClickAddShape('ellipse'), image: 'assets/icons/ellipse.png' },
  ]

  onClickSelection() {
    this.resetDragPosition.emit();
    this.designLayoutService.onSelection();
  }

  onClickAddText() {
    this.resetDragPosition.emit();
    this.designLayoutService.onAddTextToCanvas('Enter text here', this.selectedColor());
  }

  onClickAddShape(type: string) {
    this.resetDragPosition.emit();
    this.designLayoutService.onAddShapeToCanvas(type, this.selectedColor());
  }
  
  onClickAddContents() {
    this.resetDragPosition.emit();
    this.showContents.set(!this.showContents());
    this.designLayoutService.onSetCanvasProps('content', false, 'default');
  }

  onClickAddLine() {
    this.resetDragPosition.emit();
    this.designLayoutService.onAddLineToCanvas(this.selectedColor());
  }

  onClickPan() {
    this.designLayoutService.onPan();
  }

  onClickMove() {
    this.resetDragPosition.emit();
    this.designLayoutService.onMove();
  }

  onClickZoom() {
    this.resetDragPosition.emit();
    const canvas = this.designLayoutService.getCanvas();
    canvas.discardActiveObject();
    this.designLayoutService.onSetCanvasProps('zoom', true, 'default');
  }

  onUnSelectAllLayers() {
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onUnSelectAllLayers(canvas);
  }
  
  onChangeColor(event: any) {
    this.designLayoutService.onChangeColor(event.value);
  }
  
  get selectedColor() { return this.designLayoutService.selectedColor; }
  get showContents() { return this.designLayoutService.showContents; }
}
