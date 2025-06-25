import { Component, inject, Input } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { User } from '../../../core/interfaces/account-settings';
import { FormGroup } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-approval',
  imports: [ PrimengUiModule ],
  templateUrl: './user-approval.component.html',
  styleUrl: './user-approval.component.scss'
})
export class UserApprovalComponent {

  @Input() playlistForm!: FormGroup;

  userService = inject(UserService);
}
