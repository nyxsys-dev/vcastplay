import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ScreenService } from '../../../core/services/screen.service';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { UtilityService } from '../../../core/services/utility.service';
import { Router } from '@angular/router';
import { ScreenListItemComponent } from '../screen-list-item/screen-list-item.component';
import _ from  'lodash';

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

  screenFilters = signal<any>(this.screenFilterForm.valueChanges)
  filteredScreen = computed(() => {
    const { type, group, subGroup, orientation, status, keywords } = this.screenFilters();
    const screens = this.screenService.screens();

    return screens.filter((screen: any) => {
      const matchesType = !type || screen.type.includes(type);
      const matchesGroup = !group || screen.group?.includes(group);
      const matchesSubGroup = !subGroup || screen.subGroup?.includes(subGroup);
      const matchesOrientation = !orientation || screen.displaySettings.orientation?.includes(orientation);
      const matchesStatus = !status || (screen.status == status);
      const matchesKeywords = !keywords || _.includes(screen.name.toLowerCase(), keywords.toLowerCase()) || _.includes(screen.code, keywords);

      return matchesType && matchesGroup && matchesSubGroup && matchesOrientation && matchesStatus && matchesKeywords;
    })
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
      message: 'Do you want to delete this screen?',
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
        this.message.add({ severity:'success', summary: 'Success', detail: 'Screen deleted successfully!' });
      },
      reject: () => { }
    })
  }

  onClickRefresh() { }

  onClickDownload(device: string) {
    this.showDownload.set(false);
  }

  onFilterChange(event: any) {
    this.screenFilters.set(event.filters);
  }
  
  get isMobile() { return this.utils.isMobile(); }

  get rows() { return this.screenService.rows; }
  get screenForm() { return this.screenService.screenForm; }
  get isEditMode() { return this.screenService.isEditMode; }
  get totalRecords() { return this.screenService.totalRecords; }
  get showDownload() { return this.screenService.showDownload; }
  get selectedScreen() { return this.screenService.selectedScreen; }
  get screenFilterForm() { return this.screenService.screenFilterForm; }
}
