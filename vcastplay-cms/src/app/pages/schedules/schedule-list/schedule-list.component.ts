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

  scheduleServices = inject(SchedulesService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);

  showAddSchedule = signal<boolean>(false);

  onClickAddNew() {
    this.isEditMode.set(false);
    this.showAddSchedule.set(true);
    // this.router.navigate([ '/schedule/schedule-details' ]);
  }

  onClickEdit(schedule: Schedule) {
    this.isEditMode.set(true);
    // this.selectedSchedule.set(schedule);
    this.router.navigate([ '/schedule/schedule-details' ]);
  }

  onClickSave(event: Event) {
    this.showAddSchedule.set(false);
    // this.scheduleServices.onSaveSchedule(this.scheduleForm.value);
  }

  onClickCancel() {
    this.showAddSchedule.set(false);
    this.scheduleForm.reset();
  }

  get isEditMode() { return this.scheduleServices.isEditMode; }
  get scheduleForm() { return this.scheduleServices.scheduleForm; }
  get schedules() { return this.scheduleServices.schedules; }
  get rows() { return this.scheduleServices.rows; }
  get first() { return this.scheduleServices.first; }
  get totalRecords() { return this.scheduleServices.totalRecords; }
}
