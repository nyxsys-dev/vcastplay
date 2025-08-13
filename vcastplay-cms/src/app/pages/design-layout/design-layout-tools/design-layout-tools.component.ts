import { Component, inject, Input, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayoutService } from '../../../core/services/design-layout.service';

@Component({
  selector: 'app-design-layout-tools',
  imports: [ PrimengUiModule ],
  templateUrl: './design-layout-tools.component.html',
  styleUrl: './design-layout-tools.component.scss'
})
export class DesignLayoutToolsComponent {

  @Input() canvasElement!: HTMLCanvasElement;

  designLayoutService = inject(DesignLayoutService);

  onClickSelection() {
    this.designLayoutService.onSelection();
  }

  onClickAddText() {
    this.designLayoutService.onAddTextToCanvas('Enter text here', this.selectedColor());
  }

  onClickAddRectangle() {
    this.designLayoutService.onAddRectangleToCanvas(this.selectedColor());
  }
  
  onClickAddContents() {
    this.showContents.set(!this.showContents());
    this.designLayoutService.onSetCanvasProps('content', false, 'default');
  }

  onClickAddLine() {
    this.designLayoutService.onAddLineToCanvas(this.selectedColor());
  }

  onClickPan() {
    this.designLayoutService.onPan();
  }

  onClickMove() {
    this.designLayoutService.onMove();
  }

  onClickZoom() {
    const canvas = this.designLayoutService.getCanvas();
    canvas.discardActiveObject();
    this.designLayoutService.onZoomCanvas(1.1);
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
