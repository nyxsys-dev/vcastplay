import { Component } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../core/modules/components/components.module';
import { MenuItem } from 'primeng/api';
import { OnlineScreensComponent } from '../../components/dashboard-components/online-screens/online-screens.component';
import { OfflineScreensComponent } from '../../components/dashboard-components/offline-screens/offline-screens.component';
import { StorageUsageComponent } from '../../components/dashboard-components/storage-usage/storage-usage.component';
import { SubscriptionPlanComponent } from '../../components/dashboard-components/subscription-plan/subscription-plan.component';
import { ScreenListsComponent } from '../../components/dashboard-components/screen-lists/screen-lists.component';
import { SampleChartComponent } from '../../components/dashboard-components/sample-chart/sample-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [ PrimengUiModule, ComponentsModule, ScreenListsComponent, SampleChartComponent ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  pageInfo: MenuItem = [ {label: 'Dashboard'} ];
  widgets: any[] = [
    { content: OnlineScreensComponent },
    { content: OfflineScreensComponent },
    { content: StorageUsageComponent },
    { content: SubscriptionPlanComponent },
  ]
}
