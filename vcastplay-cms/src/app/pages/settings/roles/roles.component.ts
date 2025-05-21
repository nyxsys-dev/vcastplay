import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent {
  
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);

  pageInfo: MenuItem = [ {label: 'Settings'}, {label: 'Role Management'} ];
  
  roles = signal<Roles[]>([]);
  isEdit = signal<boolean>(false);
  showDialog = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  filteredRoles = computed(() => {
    const { status, keywords }: any = this.utils.filterValues();
    const statusFilter = (status ?? '').toLowerCase().trim();
    const keywordFilter = (keywords ?? '').toLowerCase().trim();
    return this.roles().filter(role => {
      const matchesStatus = statusFilter ? role.status?.toLowerCase().trim() === statusFilter : true;
      const matchesKeyword = keywordFilter ? role.name?.toLowerCase().includes(keywordFilter) : true;
      return matchesStatus && matchesKeyword;
    })
  })

  roleForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [ Validators.required ]),
    description: new FormControl('', [ Validators.required ]),
    modules: new FormControl([], { nonNullable: true }),
    status: new FormControl(''),
  })

  rows: number = 8;
  totalRecords: number = 0;
  
  stateOptions: any[] = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  constructor() { }

  ngOnInit() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.onInitializeData();
      this.isLoading.set(false);
    }, 2000)
  }

  onInitializeData() {
    this.roles.set([
      {
        id: 1,
        name: "Admin",
        description: "Has full access to all modules and settings.",
        modules: [],
        status: "Active",
        createdOn: new Date("2024-01-01"),
        updatedOn: new Date("2024-02-01"),
      },
      {
        id: 2,
        name: "Editor",
        description: "Can manage content but has limited access to settings.",
        modules: [],
        status: "Active",
        createdOn: new Date("2024-01-05"),
        updatedOn: new Date("2024-02-05"),
      },
      {
        id: 3,
        name: "Viewer",
        description: "Can only view reports and dashboards.",
        modules: [],
        status: "Active",
        createdOn: new Date("2024-01-10"),
        updatedOn: new Date("2024-02-10"),
      },
      {
        id: 4,
        name: "Moderator",
        description: "Manages user-generated content and enforces policies.",
        modules: [],
        status: "Inactive",
        createdOn: new Date("2024-01-15"),
        updatedOn: new Date("2024-02-15"),
      },
      {
        id: 5,
        name: "Support",
        description: "Handles user issues and provides assistance.",
        modules: [],
        status: "Active",
        createdOn: new Date("2024-01-20"),
        updatedOn: new Date("2024-02-20"),
      }
    ]);
    
    this.totalRecords = this.roles().length;
  }

  onClickRefresh() {
    this.isLoading.set(true);
    this.roles.set([]);
    setTimeout(() => {
      this.onInitializeData();
      this.isLoading.set(false);
    }, 2000)
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
        const tempRoles: any[] = this.roles();
        const { id, status, ...info } = this.roleForm.value;
        
        if (!this.isEdit()) {          
          tempRoles.push({ id: tempRoles.length + 1, status: 'Pending', ...info, createdOn: new Date(), updatedOn: new Date() });
          this.roles.set([...tempRoles]);
        }
        else {;
          this.roles.set(this.roles().map(r => r.id == id ? {...r,...info } : r));
        }        

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
        this.message.add({ severity:'success', summary: 'Success', detail: 'User deleted successfully!' });
        this.roles.set(this.roles().filter(r => r.id !== role.id));
      },
      reject: () => { }
    })
  }

  onClickCancel() {
    this.showDialog.set(false);
    this.roleForm.reset();
  }

  onPageChange(event: any) { }
  
  formControl(fieldName: string) {
    return this.roleForm.get(fieldName);
  }

  isModuleSelected(module: any) {
    return this.moduleCtrl?.value.some((m: any) => m.label === module.label);
  }

  onAddModule(module: any) {
    const moduleCtrl = this.moduleCtrl?.value;
    const index = moduleCtrl.findIndex((m: any) => m.label === module.label);
    if (index !== -1) {
      moduleCtrl.splice(index, 1);
    } else {
      moduleCtrl.push(module);
    } 
  }

  get modules() {
    return this.utils.modules();
  }

  get moduleCtrl() {
    return this.roleForm.get('modules');
  }
}
