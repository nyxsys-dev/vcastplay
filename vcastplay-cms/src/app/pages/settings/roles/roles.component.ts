import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Roles } from '../../../core/interfaces/account-settings';
import { UtilityService } from '../../../core/services/utility.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../core/services/role.service';
import { RoleListItemComponent } from '../../../components/roles/role-list-item/role-list-item.component';
import { RoleDetailsComponent } from '../../../components/roles/role-details/role-details.component';

@Component({
  selector: 'app-roles',
  imports: [ PrimengUiModule, ComponentsModule, RoleListItemComponent, RoleDetailsComponent ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  providers: [ ConfirmationService, MessageService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent {

  pageInfo: MenuItem = [ {label: 'Settings'}, {label: 'Role Management'} ];
  
  utils = inject(UtilityService);
  roleService = inject(RoleService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);

  filteredRoles = computed(() => {
    const { status, keywords }: any = this.utils.filterValues();
    const statusFilter = (status ?? '').toLowerCase().trim();
    const keywordFilter = (keywords ?? '').toLowerCase().trim();
    return this.roleService.roles().filter(role => {
      const matchesStatus = statusFilter ? role.status?.toLowerCase().trim() === statusFilter : true;
      const matchesKeyword = keywordFilter ? role.name?.toLowerCase().includes(keywordFilter) : true;
      return matchesStatus && matchesKeyword;
    })
  })

  rows: number = 8;
  totalRecords: number = 0;

  ngOnInit() {
    this.onInitializeData();
  }

  onInitializeData() {
    this.roleService.onGetRoles();
    this.totalRecords = this.filteredRoles().length;
  }

  onClickRefresh() {
    this.roleService.onRefreshRoles();
  }

  onClickAddNew() {
    this.showDialog.set(true);
    this.roleForm.reset();
  }

  onClickEdit(role: Roles) {    
    this.roleForm.patchValue(role);
    this.showDialog.set(true);
  }

  onClickSave(event: Event) {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
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
        this.roleService.onSaveRole(this.roleForm.value);
        this.message.add({ severity:'success', summary: 'Success', detail: 'User saved successfully!' });
        this.showDialog.set(false);
        this.roleForm.reset();
      },
      reject: () => { 
        this.showDialog.set(false);
        this.roleForm.reset();
      }
    })
  }

  onClickDelete(role: Roles, event: Event) {
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
        this.roleService.onDeleteRole(role);
        this.message.add({ severity:'success', summary: 'Success', detail: 'User deleted successfully!' });
      },
      reject: () => { }
    })
  }

  onClickCancel() {
    this.showDialog.set(false);
    this.roleForm.reset();
  }

  onPageChange(event: any) { }

  get roleForm() {
    return this.roleService.roleForm;
  }

  get showDialog() {
    return this.roleService.showDialog;
  }
}
