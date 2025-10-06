import { Component, inject, Input, TemplateRef } from '@angular/core';
import { UtilityService } from '../../../core/services/utility.service';
import { DesignLayout } from '../../../core/interfaces/design-layout';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';

@Component({
  selector: 'app-design-layout-list-item',
  imports: [ PrimengUiModule ],
  templateUrl: './design-layout-list-item.component.html',
  styleUrl: './design-layout-list-item.component.scss'
})
export class DesignLayoutListItemComponent {

  @Input() design!: DesignLayout;
  @Input() actionBtn!: TemplateRef<any>;

  utils = inject(UtilityService)
}
