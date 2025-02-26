import { Component } from '@angular/core';
import { PrimengUiModule } from '../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../core/modules/components/components.module';
import { MenuItem } from 'primeng/api';
import { OnlineScreensComponent } from '../../component/dashboard-components/online-screens/online-screens.component';
import { OfflineScreensComponent } from '../../component/dashboard-components/offline-screens/offline-screens.component';
import { StorageUsageComponent } from '../../component/dashboard-components/storage-usage/storage-usage.component';
import { SubscriptionPlanComponent } from '../../component/dashboard-components/subscription-plan/subscription-plan.component';

@Component({
  selector: 'app-dashboard',
  imports: [ PrimengUiModule, ComponentsModule ],
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
