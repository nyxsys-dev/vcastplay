import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { CdkDragPlaceholder, CdkDragPreview } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-asset-list-item',
  imports: [ PrimengUiModule, CommonModule, CdkDragPlaceholder, CdkDragPreview ],
  templateUrl: './asset-list-item.component.html',
  styleUrl: './asset-list-item.component.scss'
})
export class AssetListItemComponent {

  @Input() asset: any;

}
