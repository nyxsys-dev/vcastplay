import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../../../components/progress-bar/progress-bar.component';
import { AssetPreviewComponent } from '../../../components/asset-preview/asset-preview.component';
import { PlaylistPreviewComponent } from '../../../components/playlist-preview/playlist-preview.component';
import { DesignLayoutPreviewComponent } from '../../../components/design-layout-preview/design-layout-preview.component';

const COMPONENT_MODULES = [
  CommonModule,
  AssetPreviewComponent,
  PlaylistPreviewComponent,
  DesignLayoutPreviewComponent,
  ProgressBarComponent,
]

@NgModule({
  declarations: [],
  imports: [ ...COMPONENT_MODULES ],
  exports: [ ...COMPONENT_MODULES ]
})
export class ComponentsModule { }
