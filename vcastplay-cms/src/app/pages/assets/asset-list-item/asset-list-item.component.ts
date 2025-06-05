import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';

@Component({
  selector: 'app-asset-list-item',
  imports: [ PrimengUiModule, CommonModule ],
  templateUrl: './asset-list-item.component.html',
  styleUrl: './asset-list-item.component.scss'
})
export class AssetListItemComponent {

}
