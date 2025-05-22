import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ScreenService } from '../../../core/services/screen.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-screen-details',
  imports: [ PrimengUiModule, ComponentsModule, RouterLink ],
  templateUrl: './screen-details.component.html',
  styleUrl: './screen-details.component.scss',
  providers: [ ConfirmationService, MessageService ]

})
export class ScreenDetailsComponent {

  pageInfo: MenuItem = [ {label: 'Screens'}, {label: 'Registration', routerLink: '/screens/screen-registration'}, {label: 'Details'} ];

  screenService = inject(ScreenService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);

  ngOnInit() {
    const screenData = this.screenService.selectedScreen();
    if (!screenData) {
      this.screenForm.patchValue({
        code: this.utils.genereteScreenCode(6)
      })
    }
  }

  ngOnDestroy() {
    this.screenService.selectedScreen.set(null);
    this.screenForm.reset();
  }

  onClickSave(event: Event) {
    if (this.screenForm.invalid) {
      this.screenForm.markAllAsTouched();
      this.message.add({ severity: 'error', summary: 'Error', detail: 'Please input required fields (*)' });
      return;
    }

    this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to save changes?',
      closable: true,
      closeOnEscape: true,
      header: 'Confirm Save',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.message.add({ severity:'success', summary: 'Success', detail: 'Screen registered successfully!' });
        this.screenForm.reset();
      },
    })
  }

  onClickCancel() {
    this.screenService.selectedScreen.set(null);
    this.screenForm.reset();
  }

  formControl(fieldName: string) {
    return this.screenForm.get(fieldName);
  }

  get screenForm() {
    return this.screenService.screenForm;
  }
}
