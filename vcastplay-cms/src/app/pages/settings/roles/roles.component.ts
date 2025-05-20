import { Component, inject, signal } from '@angular/core';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Roles } from '../../../core/interfaces/account-settings';
import { UtilityService } from '../../../core/services/utility.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-roles',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  providers: [ ConfirmationService, MessageService ],
})
export class RolesComponent {

  pageInfo: MenuItem = [ {label: 'Settings'}, {label: 'Role Management'} ];
  
  isEdit = signal<boolean>(false);
  showDialog = signal<boolean>(false);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);

  roles: Roles[] = [];

  roleForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [ Validators.required ]),
    description: new FormControl('', [ Validators.required ]),
    modules: new FormControl([]),
    status: new FormControl(''),
  })

  ngOnInit() {
    this.onInitializeData();
  }

  onInitializeData() {
    this.roles = [
      {
        id: 1,
        name: "Admin",
        description: "Has full access to all modules and settings.",
        modules: ["Dashboard", "Users", "Settings", "Reports"],
        status: "Active",
        createdOn: new Date("2024-01-01"),
        updatedOn: new Date("2024-02-01"),
      },
      {
        id: 2,
        name: "Editor",
        description: "Can manage content but has limited access to settings.",
        modules: ["Dashboard", "Content Management", "Reports"],
        status: "Active",
        createdOn: new Date("2024-01-05"),
        updatedOn: new Date("2024-02-05"),
      },
      {
        id: 3,
        name: "Viewer",
        description: "Can only view reports and dashboards.",
        modules: ["Dashboard", "Reports"],
        status: "Active",
        createdOn: new Date("2024-01-10"),
        updatedOn: new Date("2024-02-10"),
      },
      {
        id: 4,
        name: "Moderator",
        description: "Manages user-generated content and enforces policies.",
        modules: ["Content Management", "User Feedback"],
        status: "Inactive",
        createdOn: new Date("2024-01-15"),
        updatedOn: new Date("2024-02-15"),
      },
      {
        id: 5,
        name: "Support",
        description: "Handles user issues and provides assistance.",
        modules: ["Support Center", "User Feedback"],
        status: "Active",
        createdOn: new Date("2024-01-20"),
        updatedOn: new Date("2024-02-20"),
      }
    ];    
  }

  onClickRefresh() {
    this.onInitializeData();
  }

  onClickAddNew() {
    this.isEdit.set(false);
    this.showDialog.set(true);
    this.roleForm.reset();
  }

  onClickEdit(role: Roles) {    
    this.isEdit.set(true);
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
        const { status, ...info } = this.roleForm.value;
        this.message.add({ severity:'success', summary: 'Success', detail: 'User saved successfully!' });
        
        if (!this.isEdit()) {
          this.roles.push({ status: 'Pending', ...info });
        }
        else {
          this.roles = this.roles.map(r => r.id === info.id? {...r,...info } : r);
        }

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
        this.message.add({ severity:'success', summary: 'Success', detail: 'User deleted successfully!' });
        this.roles = this.roles.filter(r => r.id !== role.id);
      },
      reject: () => { }
    })
  }

  onClickCancel() {
    this.showDialog.set(false);
    this.roleForm.reset();
  }
  
  formControl(fieldName: string) {
    return this.roleForm.get(fieldName);
  }
}
