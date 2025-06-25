import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { User } from '../../../core/interfaces/account-settings';
import { UtilityService } from '../../../core/services/utility.service';
import { UserService } from '../../../core/services/user.service';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'app-users',
  imports: [ PrimengUiModule, ComponentsModule,  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [ ConfirmationService, MessageService ],
})
export class UsersComponent {
  
  pageInfo: MenuItem = [ {label: 'Settings'}, {label: 'Users Management'} ];

  userService = inject(UserService);
  roleService = inject(RoleService);
  utils = inject(UtilityService);
  
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);

  filteredUsers = computed(() => {
    const { status, keywords }: any = this.utils.filterValues();
    const statusFilter = (status ?? '').toLowerCase().trim();
    const keywordFilter = (keywords ?? '').toLowerCase().trim();
    return this.userService.users().filter(user => {
      const matchesStatus = statusFilter ? user.status?.toLowerCase().trim() === statusFilter : true;
      const matchesKeyword = keywordFilter ? (user.firstName + ' ' + user.lastName)?.toLowerCase().includes(keywordFilter) : true;
      return matchesStatus && matchesKeyword;
    })
  })

  rows: number = 8;
  totalRecords: number = 0;

  ngOnInit() { 
    this.onInitializeData();
  }

  onInitializeData() {
    this.userService.onGetUsers();
    this.roleService.onGetRoles();
    this.totalRecords = this.filteredUsers().length;
  }
  
  onClickRefresh() {
    this.userService.onRefreshUser();
  }

  onClickAddNew() {
    this.showDialog.set(true);
    this.userService.userForm.reset();
  }

  onClickEdit(user: User) {
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
        this.userService.onSaveUser(this.userForm.value);
        this.message.add({ severity:'success', summary: 'Success', detail: 'User saved successfully!' });
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
        this.userService.onDeleteUser(user);
        this.message.add({ severity:'success', summary: 'Success', detail: 'User deleted successfully!' });
      },
      reject: () => { }
    })
  }

  onClickCancel() {
    this.showDialog.set(false);
    this.userForm.reset();
  }

  get userForm() {
    return this.userService.userForm;
  }

  get showDialog() {
    return this.userService.showDialog;
  }
}
