import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../../component/toolbar/toolbar.component';
import { DrawerComponent } from '../../../component/drawer/drawer.component';
import { BreadcrumbsComponent } from '../../../component/breadcrumbs/breadcrumbs.component';
import { FiltersComponent } from '../../../component/filters/filters.component';


const COMPONENT_MODULES = [
  CommonModule,
  ToolbarComponent,
  DrawerComponent,
  BreadcrumbsComponent,
  FiltersComponent,
]

@NgModule({
  declarations: [],
  imports: [ ...COMPONENT_MODULES ],
  exports: [ ...COMPONENT_MODULES, ]
})
export class ComponentsModule { }
