import { Component } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-design-layout-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './design-layout-list.component.html',
  styleUrl: './design-layout-list.component.scss'
})
export class DesignLayoutListComponent {

  pageInfo: MenuItem = [ { label: 'Designs' }, { label: 'Lists' } ];

  onClickAddNew() {}
}
