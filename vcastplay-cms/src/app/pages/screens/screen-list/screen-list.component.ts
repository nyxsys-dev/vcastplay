import { Component, computed, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ScreenService } from '../../../core/services/screen.service';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { UtilityService } from '../../../core/services/utility.service';
import { Router } from '@angular/router';
import { ScreenListItemComponent } from '../screen-list-item/screen-list-item.component';

@Component({
  selector: 'app-screen-list',
  imports: [ PrimengUiModule, ComponentsModule, ScreenListItemComponent ],
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

  ngOnInit() {
    this.screenService.onGetScreens();
  }

  onClickAddNew() {
    this.router.navigate([ '/screens/screen-details' ]);
  }

  onClickEdit(item: any) {
    this.isEditMode.set(true);
    this.screenForm.patchValue(item);
    this.router.navigate([ '/screens/screen-details' ]);
  }

  onClickDelete(item: any, event: Event) {
    this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this user?',
      closable: true,
      closeOnEscape: true,
      header: 'Danger Zone',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.screenService.onDeleteScreen(item);
        this.message.add({ severity:'success', summary: 'Success', detail: 'User deleted successfully!' });
      },
      reject: () => { }
    })
  }

  onClickRefresh() { }

  get rows() { return this.screenService.rows; }
  get totalRecords() { return this.screenService.totalRecords; }
  get screenForm() { return this.screenService.screenForm; }
  get selectedScreen() { return this.screenService.selectedScreen; }
  get isEditMode() { return this.screenService.isEditMode; }
  get isMobile() { return this.utils.isMobile(); }

}
