import { Component, inject, Input, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayoutService } from '../../../core/services/design-layout.service';
import * as fabric from 'fabric';

@Component({
  selector: 'app-design-layout-tools',
  imports: [ PrimengUiModule ],
  templateUrl: './design-layout-tools.component.html',
  styleUrl: './design-layout-tools.component.scss'
})
export class DesignLayoutToolsComponent {

  @Input() canvasElement!: HTMLCanvasElement;

  designLayoutService = inject(DesignLayoutService);

  selectedColor = signal<string>('#000000');

  onClickSelection() {
    this.designLayoutService.onSelection();
  }

  onClickAddText() {
    this.designLayoutService.onAddTextToCanvas('Enter text here', this.selectedColor());
  }

  onClickAddRectangle() {
    this.designLayoutService.onAddRectangleToCanvas(this.selectedColor());
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

  onChangeColor(event: any) {
    this.designLayoutService.onChangeColor(event.value);
  }
}
