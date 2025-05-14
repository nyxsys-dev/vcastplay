import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScreenStatusComponent } from '../../../components/dashboard/screen-status/screen-status.component';
import { SubscriptionPlanComponent } from '../../../components/dashboard/subscription-plan/subscription-plan.component';
import { ScreenListsComponent } from '../../../components/dashboard/screen-lists/screen-lists.component';
import { ScreenMapComponent } from '../../../components/dashboard/screen-map/screen-map.component';

const DASHBOARD_MODULES = [
  CommonModule,
  ScreenStatusComponent,
  ScreenListsComponent,
  ScreenMapComponent,
  SubscriptionPlanComponent
];

@NgModule({
  declarations: [],
  imports: [ ...DASHBOARD_MODULES ],
  exports: [ ...DASHBOARD_MODULES ],
})
export class DashboardModule { }
