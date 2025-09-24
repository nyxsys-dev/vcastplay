import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerInformationComponent } from '../../../components/player-information/player-information.component';
import { ProgressBarComponent } from '../../../components/progress-bar/progress-bar.component';

const COMPONENT_MODULES = [
  CommonModule,
  PlayerInformationComponent,
  ProgressBarComponent,
]

@NgModule({
  declarations: [],
  imports: [ ...COMPONENT_MODULES ],
  exports: [ ...COMPONENT_MODULES ]
})
export class ComponentsModule { }
