import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayout } from '../../core/interfaces/design-layout';
import { DesignLayoutService } from '../../core/services/design-layout.service';

@Component({
  selector: 'app-preview-design-layout',
  imports: [ PrimengUiModule ],
  templateUrl: './preview-design-layout.component.html',
  styleUrl: './preview-design-layout.component.scss'
})
export class PreviewDesignLayoutComponent {
  
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;

  @Input() designLayout!: DesignLayout;

  designLayoutService = inject(DesignLayoutService);

  ngOnInit(): void {
    this.onRenderCanvas();
  }

  ngOnDestroy(): void {
    this.designLayoutService.onExitCanvas();
    this.canvasElement.nativeElement.remove();
  }

  onRenderCanvas() {
    this.designLayoutService.onEditDesign(this.canvasElement.nativeElement, this.designLayout);
  }
}
