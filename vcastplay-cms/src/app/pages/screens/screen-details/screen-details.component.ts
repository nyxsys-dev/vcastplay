import { Component, inject } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ScreenService } from '../../../core/services/screen.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ActivatedRoute, Router } from '@angular/router';
import { MapmarkersComponent } from '../../../components/mapmarkers/mapmarkers.component';

@Component({
  selector: 'app-screen-details',
  imports: [ PrimengUiModule, ComponentsModule, MapmarkersComponent ],
  templateUrl: './screen-details.component.html',
  styleUrl: './screen-details.component.scss',
  providers: [ ConfirmationService, MessageService ]

})
export class ScreenDetailsComponent {

  pageInfo: MenuItem = [ {label: 'Screens'}, {label: 'Registration', routerLink: '/screens/screen-registration'}, {label: 'Details'} ];

  markers: any[] = [];

  screenService = inject(ScreenService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    // Get screen code from url
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      const screenData: any = this.screenService.selectedScreen();    
      if (screenData) {      
        this.screenForm.patchValue(screenData);
        this.markers.push({ geolocation: screenData.geolocation, name: screenData.name });
      }
    } else {
      this.screenForm.patchValue({
        code: this.utils.genereteScreenCode(6),
        geolocation: { lat: 14.6090, lng: 121.0223 }
      })
    }    
  }

  ngOnDestroy() {
    this.selectedScreen.set(null);
    this.screenForm.reset();
    this.isEditMode.set(false);
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
        this.screenService.onSaveScreen(this.screenForm.value);
        // this.router.navigate([ '/screens/screen-registration' ]);
        // this.screenForm.reset();
      },
    })
  }

  onClickCancel() {
    this.selectedScreen.set(null);
    this.screenForm.reset();
    this.router.navigate([ '/screens/screen-registration' ]);
  }

  onGetLocation(event: Event) {
    this.screenForm.patchValue(event);    
  }

  formControl(fieldName: string) {
    return this.screenForm.get(fieldName);
  }

  get selectedScreen() {
    return this.screenService.selectedScreen;
  }

  get screenForm() {
    return this.screenService.screenForm;
  }

  get geolocation() {
    return this.screenForm.get('geolocation');
  }

  get isEditMode() { 
    return this.screenService.isEditMode; 
  }
}
