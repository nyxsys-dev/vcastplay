import { Component, computed, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ScreenService } from '../../../core/services/screen.service';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { UtilityService } from '../../../core/services/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-screen-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './screen-list.component.html',
  styleUrl: './screen-list.component.scss',
  providers: [ ConfirmationService, MessageService ],
})
export class ScreenListComponent {

  pageInfo: MenuItem = [ {label: 'Screens'}, {label: 'Registration'} ];

  screenService = inject(ScreenService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);

  filteredScreen = computed(() => {
    return this.screenService.screens();
  });

  rows: number = 8;
  totalRecords: number = 0;

  onClickAddNew() {
    this.router.navigate([ '/screens/screen-details' ]);
  }

  onClickRefresh() {}

}
