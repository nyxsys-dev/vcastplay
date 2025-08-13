import { Component, inject, Input, signal } from '@angular/core';
import { DesignLayoutService } from '../../../core/services/design-layout.service';
import { MenuItem } from 'primeng/api';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';

@Component({
  selector: 'app-rect-properties',
  imports: [ PrimengUiModule ],
  templateUrl: './rect-properties.component.html',
  styleUrl: './rect-properties.component.scss'
})
export class RectPropertiesComponent {

  @Input() lineProps: boolean = false;

  designlayoutService = inject(DesignLayoutService);

  isTransparent = signal<boolean>(false);
  rectPropOptions: MenuItem[] = [
    { label: 'Fill', value: 'fill' },
    { label: 'Outlined', value: 'outline' },
    { label: 'Dashed', value: 'dashed' },
  ]

  constructor() {
    this.rectPropsForm.valueChanges.subscribe(value => {      
      if (!this.lineProps) this.designlayoutService.onUpdateRectProperty(value);
      else this.designlayoutService.onUpdateLineProperty(value);
    })
  }

  onClickTransparent() {
    this.isTransparent.set(!this.isTransparent());
    this.rectPropsForm.patchValue({ transparent: this.isTransparent() });
  }

  get rectPropsForm() { return this.designlayoutService.rectPropsForm; }
  get strokeWidth() { return this.rectPropsForm.get('strokeWidth'); }
  get style() { return this.rectPropsForm.get('style'); }
}
