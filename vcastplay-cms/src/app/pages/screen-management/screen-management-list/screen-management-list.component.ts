import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ScreenService } from '../../../core/services/screen.service';
import { UtilityService } from '../../../core/services/utility.service';
import _ from 'lodash';
import { Screen, ScreenMessage } from '../../../core/interfaces/screen';
import { BroadcastService } from '../../../core/services/broadcast.service';

@Component({
  selector: 'app-screen-management-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './screen-management-list.component.html',
  styleUrl: './screen-management-list.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class ScreenManagementListComponent {

  pageInfo: MenuItem = [ {label: 'Screens'}, {label: 'Management'} ];

  screenService = inject(ScreenService);
  broadcastService = inject(BroadcastService);
  utils = inject(UtilityService);

  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  
  screenFilters = signal<any>(this.screenFilterForm.valueChanges)
  filteredScreen = computed(() => {
    const { type, group, subGroup, location, screenStatus, contentStatus, keywords } = this.screenFilters();
    const screens = this.screenService.screens();

    return screens.filter((screen: Screen) => {
      const matchesStatus = screen.status;// == 'active'; 
      const matchesType = !type || screen.type.includes(type);
      const matchesGroup = !group || screen.group?.includes(group);
      const matchesSubGroup = !subGroup || screen.subGroup?.includes(subGroup);
      const matchesKeywords = !keywords || _.includes(screen.name.toLowerCase(), keywords.toLowerCase()) || _.includes(screen.code, keywords);
      const matchedLocation = !location || screen?.geographic?.location.includes(location);
      const matchedScreenStatus = !screenStatus || screen.screenStatus == screenStatus;
      const matchedContentStatus = !contentStatus || screen.assignedContent?.content.status == contentStatus;

      return matchesStatus && matchesType && matchesGroup && matchesSubGroup && matchesKeywords && matchedLocation && matchedScreenStatus && matchedContentStatus;
    })
  });

  ngOnInit() {
    this.screenService.onGetScreens();
  }

  ngOnDestroy() {
    this.selectMultipleScreens.set([]);
  }

  isAllChecked(): boolean {
    return this.selectMultipleScreens().length == this.filteredScreen().length;
  }

  onClickCheckAll(checked: boolean) {
    checked ? this.selectMultipleScreens.set(this.filteredScreen()) : this.selectMultipleScreens.set([]);
  }

  onClickToggleControls() {
    this.toggleControls.set(!this.toggleControls());
  }

  onFilterChange(event: any) {
    
  }

  onClickApplyBroadcastMessage() {
    const messageArr: ScreenMessage[] = this.selectedArrScreenBroadcastMessage();
    if (messageArr.length == 0) return;
    this.screenService.onBroadCastMessage(messageArr);
    this.message.add({ severity:'success', summary: 'Success', detail: 'Broadcast message sent successfully!' });
    this.showBroadcast.set(false);
    this.selectedArrScreenBroadcastMessage.set([]);
  }

  onClickCloseBroadcastMessage() {
    this.selectedArrScreenBroadcastMessage.set([]);
    this.showBroadcast.set(false)
  }

  get rows() { return this.screenService.rows; }
  get totalRecords() { return this.screenService.totalRecords; }
  get screenFilterForm() { return this.screenService.screenFilterForm; }
  get toggleControls() { return this.screenService.toggleControls; }
  get selectMultipleScreens() { return this.screenService.selectMultipleScreens; }
  get showBroadcast() { return this.screenService.showBroadcast; }

  get selectedArrScreenBroadcastMessage() { return this.broadcastService.selectedArrScreenBroadcastMessage; }
}
