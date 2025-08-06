import { Component, computed, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DesignLayoutService } from '../../../core/services/design-layout.service';
import { UtilityService } from '../../../core/services/utility.service';
import { DesignLayout } from '../../../core/interfaces/design-layout';
import { Menu } from 'primeng/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-design-layout-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './design-layout-list.component.html',
  styleUrl: './design-layout-list.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class DesignLayoutListComponent {

  pageInfo: MenuItem = [ { label: 'Designs' }, { label: 'Lists' } ];
  actionItems: MenuItem[] = [
    { 
      label: 'Options',
      items: [
        { label: 'Duplicate', icon: 'pi pi-copy', command: ($event: any) => this.onClickDuplicate(this.selectedDesign()) },
        { label: 'Add to Playlist', icon: 'pi pi-list', command: ($event: any) => this.onClickAddToPlaylist(this.selectedDesign(), $event) },
        { label: 'Delete', icon: 'pi pi-trash', command: ($event: any) => this.onClickDelete(this.selectedDesign(), $event) }  
      ]
    }
  ];

  designLayoutService = inject(DesignLayoutService)
  utils = inject(UtilityService)
  router = inject(Router)
  confirmation = inject(ConfirmationService)
  message = inject(MessageService)

  filteredDesigns = computed(() => {
    const design = this.designLayoutService.designs();
    return design;
  })

  ngOnInit() {
    this.designLayoutService.onGetDesigns();
  }

  onClickAddNew() {
    this.isEditMode.set(false);
    this.router.navigate([ '/layout/design-layout-details' ]);
  }

  onClickRefresh() { }

  onClickEdit(design: any) {
    this.isEditMode.set(true);
    this.designForm.patchValue(design);
    this.router.navigate([ '/layout/design-layout-details' ]);
  }

  onClickDelete(design: any, event: Event) { }

  onClickDuplicate(design: any) { }

  onClickAddToPlaylist(design: any, event: Event) { }
  
  onClickOptions(event: Event, design: DesignLayout, menu: Menu) {
    this.selectedDesign.set(design);
    menu.toggle(event);
  }

  onClickConfirmApproved(event: Event, popup: any, type: string) { }

  onClickApproved(event: any, item: any, popup: any, isShow: boolean = true) {
    if (isShow) {
      popup.toggle(event);
      this.designForm.patchValue(item);
    } else {
      this.showApprove.set(false);
      popup.hide();
    }
  }

  get rows() { return this.designLayoutService.rows; }
  get isEditMode() { return this.designLayoutService.isEditMode; }
  get designForm() { return this.designLayoutService.designForm; }
  get showApprove() { return this.designLayoutService.showApprove; }
  get totalRecords() { return this.designLayoutService.totalRecords; }
  get loadingSignal() { return this.designLayoutService.loadingSignal; }
  get designValue() { return this.designLayoutService.designForm.value; }
  get selectedDesign() { return this.designLayoutService.selectedDesign; }

  get status() { return this.designForm.get('status'); }
  get approvedInfo() { return this.designForm.get('approvedInfo'); }
}
