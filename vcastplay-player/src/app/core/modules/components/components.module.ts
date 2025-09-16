import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentContainerComponent } from '../../../components/content-container/content-container.component';
import { PlayerInformationComponent } from '../../../components/player-information/player-information.component';
import { ProgressBarComponent } from '../../../components/progress-bar/progress-bar.component';

const COMPONENT_MODULES = [
  CommonModule,
  ContentContainerComponent,
  PlayerInformationComponent,
  ProgressBarComponent,
]

@NgModule({
  declarations: [],
  imports: [ ...COMPONENT_MODULES ],
  exports: [ ...COMPONENT_MODULES ]
})
export class ComponentsModule { }
