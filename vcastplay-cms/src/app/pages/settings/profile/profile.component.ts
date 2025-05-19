import { Component, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UserService } from '../../../core/services/user.service';
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-profile',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [ ConfirmationService, MessageService ],
})
export class ProfileComponent {
  
  pageInfo: MenuItem = [ {label: 'Settings'}, {label: 'Profile'} ];

  userService = inject(UserService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);

  isEdit = signal<boolean>(false);

  ngOnInit() { }

  get securityForm() {
    return this.userService.securityForm;
  }

  get currentPass() {
    return this.userService.securityForm.get('password');
  }

  get newPass() {
    return this.userService.securityForm.get('newPassword');
  }

  get confirmNewPass() {
    return this.userService.securityForm.get('confirmNewPassword');
  }

}
