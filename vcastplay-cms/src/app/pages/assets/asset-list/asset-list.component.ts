import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss'
})
export class AssetListComponent {

  pageInfo: MenuItem = [ { label: 'Asset Library' }, { label: 'Lists' } ];

  router = inject(Router);

  onClickAddNew() {
    this.router.navigate([ '/assets/asset-details' ]);
  }
}
