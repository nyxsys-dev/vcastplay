import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../../components/toolbar/toolbar.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { FiltersComponent } from '../../../components/filters/filters.component';
import { PreviewContentComponent } from '../../../components/preview-content/preview-content.component';


const COMPONENT_MODULES = [
  CommonModule,
  ToolbarComponent,
  DrawerComponent,
  BreadcrumbsComponent,
  FiltersComponent,
  PreviewContentComponent,
]

@NgModule({
  declarations: [],
  imports: [ ...COMPONENT_MODULES ],
  exports: [ ...COMPONENT_MODULES, ]
})
export class ComponentsModule { }
