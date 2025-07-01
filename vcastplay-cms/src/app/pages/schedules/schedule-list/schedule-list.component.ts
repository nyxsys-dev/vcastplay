import { Component, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SchedulesService } from '../../../core/services/schedules.service';
import { UtilityService } from '../../../core/services/utility.service';
import { Router } from '@angular/router';
import { Schedule } from '../../../core/interfaces/schedules';

@Component({
  selector: 'app-schedule-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class ScheduleListComponent {

  pageInfo: MenuItem = [ { label: 'Schedules' }, { label: 'List' } ];
  actionItems: MenuItem[] = [
    { 
      label: 'Options',
      items: [
        { label: 'Duplicate', icon: 'pi pi-copy', command: ($event: any) => this.onClickDuplicate($event) },
        { label: 'Delete', icon: 'pi pi-trash', command: ($event: any) => this.onClickDelete($event) }
      ]
    }
  ];

  scheduleServices = inject(SchedulesService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);

  onClickAddNew() {
    this.isEditMode.set(false);
    this.router.navigate([ '/schedule/schedule-details' ]);
  }

  onClickEdit(schedule: Schedule) {
    this.isEditMode.set(true);
    console.log(schedule);
    
    this.scheduleForm.patchValue(schedule);
    this.router.navigate([ '/schedule/schedule-details' ]);
  }

  onClickOpenOptions(event: Event, item: any, menu: any) {
    this.selectedSchedule.set(item);
    menu.toggle(event);
  }

  onClickDuplicate(event: Event) {
    const schedule = this.selectedSchedule();
    console.log(schedule);
  }

  onClickDelete(event: Event) {
    const schedule = this.selectedSchedule();
    console.log(schedule);
  }

  get isEditMode() { return this.scheduleServices.isEditMode; }
  get scheduleForm() { return this.scheduleServices.scheduleForm; }
  get schedules() { return this.scheduleServices.schedules; }
  get rows() { return this.scheduleServices.rows; }
  get first() { return this.scheduleServices.first; }
  get totalRecords() { return this.scheduleServices.totalRecords; }
  get selectedSchedule() { return this.scheduleServices.selectedSchedule; }
}
