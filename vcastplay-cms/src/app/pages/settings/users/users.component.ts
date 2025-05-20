import { Component, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { User } from '../../../core/interfaces/account-settings';
import { UtilityService } from '../../../core/services/utility.service';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-users',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [ ConfirmationService, MessageService ],
})
export class UsersComponent {
  
  pageInfo: MenuItem = [ {label: 'Settings'}, {label: 'Users Management'} ];

  isEdit = signal<boolean>(false);
  showDialog = signal<boolean>(false);

  userService = inject(UserService)
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);

  users: User[] = [];

  ngOnInit() { 
    this.onInitializeData();
  }

  onInitializeData() {
    this.users =  [
      {
          id: 1,
          code: 'NYX001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          mobile: 1234567890,
          role: null,
          status: 'Active',
          createdOn: new Date('2024-01-01'),
          updatedOn: new Date('2024-02-01'),
      },
      {
          id: 2,
          code: 'NYX002',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          mobile: 9876543210,
          role: null,
          status: 'Active',
          createdOn: new Date('2024-01-05'),
          updatedOn: new Date('2024-02-05'),
      },
      {
          id: 3,
          code: 'NYX003',
          firstName: 'Michael',
          lastName: 'Johnson',
          email: 'michael.johnson@example.com',
          mobile: 1122334455,
          role: null,
          status: 'Inactive',
          createdOn: new Date('2024-01-10'),
          updatedOn: new Date('2024-02-10'),
      },
      {
          id: 4,
          code: 'NYX004',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@example.com',
          mobile: 2233445566,
          role: null,
          status: 'Active',
          createdOn: new Date('2024-01-15'),
          updatedOn: new Date('2024-02-15'),
      },
      {
          id: 5,
          code: 'NYX005',
          firstName: 'Robert',
          lastName: 'Brown',
          email: 'robert.brown@example.com',
          mobile: 3344556677,
          role: null,
          status: 'Suspended',
          createdOn: new Date('2024-01-20'),
          updatedOn: new Date('2024-02-20'),
      },
    ];
  }
  
  onClickRefresh() {
    this.onInitializeData();
  }

  onClickAddNew() {
    this.isEdit.set(false);
    this.showDialog.set(true);
    this.userService.userForm.reset();
  }

  onClickEdit(user: User) {
    this.isEdit.set(true);
    this.userService.onEditUser(user);
    this.showDialog.set(true);
  }

  onClickSave(event: Event) {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
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
        const { code, status, ...info } = this.userService.userForm.value;
        this.message.add({ severity:'success', summary: 'Success', detail: 'User saved successfully!' });
        
        if (!this.isEdit()) {
          this.users.push({ code: `NYX00${this.users.length + 1}`, status: 'Pending', ...info });
        }
        else {
          this.users = this.users.map(u => u.id === info.id? {...u,...info } : u);
        }

        this.showDialog.set(false);
        this.userForm.reset();
      },
    })
  }

  onClickDelete(user: User, event: Event) {
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
        this.message.add({ severity:'success', summary: 'Success', detail: 'User deleted successfully!' });
        this.users = this.users.filter(i => i.id!== user.id);
      },
      reject: () => { }
    })
  }

  onClickCancel() {
    this.showDialog.set(false);
    this.userForm.reset();
  }

  formControl(fieldName: string) {
    return this.userForm.get(fieldName);
  }

  get userForm() {
    return this.userService.userForm;
  }
}
