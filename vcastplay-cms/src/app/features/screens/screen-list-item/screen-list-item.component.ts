import { Component, inject, Input, TemplateRef } from '@angular/core';
import { Screen } from '../../../core/interfaces/screen';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-screen-list-item',
  imports: [ PrimengUiModule ],
  templateUrl: './screen-list-item.component.html',
  styleUrl: './screen-list-item.component.scss'
})
export class ScreenListItemComponent {

  @Input() screen!: Screen;
  @Input() actionBtn!: TemplateRef<any>;

  utils = inject(UtilityService);
}
