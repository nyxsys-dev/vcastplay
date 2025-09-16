import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayoutService } from '../../../core/services/design-layout.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-text-properties',
  imports: [ PrimengUiModule ],
  templateUrl: './text-properties.component.html',
  styleUrl: './text-properties.component.scss'
})
export class TextPropertiesComponent {

  designlayoutService = inject(DesignLayoutService);

  isBold = signal<boolean>(false);
  isItalic = signal<boolean>(false);
  isUnderline = signal<boolean>(false);

  alignmentOptions: MenuItem[] = [ 
    { icon: 'pi pi-align-left', value: 'left' },
    { icon: 'pi pi-align-right', value: 'right' },
    { icon: 'pi pi-align-center', value: 'center' },
    { icon: 'pi pi-align-justify', value: 'justify' }
  ];

  fontOptions: string[] = [ 
    'Arial', 
    'Britannic',
    'Calibri',
    'Cooper',
    'Courier New', 
    'Comic Sans MS',
    'Elephant',
    'Franklin Gothic',
    'Georgia',
    'Impact',
    'Lucida Calligraphy',
    'Lucida Sans',
    'Segoe Print',
    'Times New Roman', 
    'Verdana', 
  ]

  constructor() {
    this.textPropsForm.valueChanges.subscribe(value => {
      this.isBold.set(value.weight);
      this.isItalic.set(value.italic);
      this.isUnderline.set(value.underline);
      this.designlayoutService.onUpdateTextProperty(value)
    });
  }

  onClickBold() {
    const { weight } = this.textPropsForm.value;
    this.textPropsForm.patchValue({ weight: !weight })
  }

  onClickItalic() {
    const { italic } = this.textPropsForm.value;
    this.textPropsForm.patchValue({ italic: !italic })
  }

  onClickUnderline() {
    const { underline } = this.textPropsForm.value;
    this.textPropsForm.patchValue({ underline: !underline })
  }

  get textPropsForm() { return this.designlayoutService.textPropsForm; }
}
