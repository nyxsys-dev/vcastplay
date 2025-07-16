import { computed, Injectable, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../interfaces/account-settings';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSignal = signal<User[]>([]);
  users = computed(() => this.userSignal());

  loadingSignal = signal<boolean>(false);
  showDialog = signal<boolean>(false);

  userForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    code: new FormControl(''),
    firstName: new FormControl('', [ Validators.required ]),
    lastName: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    mobile: new FormControl('', [ Validators.required ]),
    role: new FormControl('', [ Validators.required ]),
    status: new FormControl(''),
    // expiredAt: new FormControl(''),
  })  

  securityForm: FormGroup = new FormGroup({
    password: new FormControl('', [ Validators.required ]),
    newPassword: new FormControl(null, [ 
      Validators.required, 
      Validators.minLength(6), 
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/),
      this.forbiddenStartValidator() 
    ]),
    confirmNewPassword: new FormControl(null, [ Validators.required ])
  }, {
    validators: this.passMatchValidator
  });

  constructor() { }

  onLoadUsers() {
    this.loadingSignal.set(false);
    /**Call GET users API */
    this.userSignal.set([
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
    ]);
    this.loadingSignal.set(false);
  }

  onGetUsers() {
    if (this.userSignal().length === 0) this.onLoadUsers();
    return this.userSignal();
  }

  onRefreshUser() {
    this.userSignal.set([]);
    this.onLoadUsers();
  }

  onSaveUser(user: User) {
    const tempUsers = this.users();
    const { id, code, status, ...info } = user;
    const index = tempUsers.findIndex(u => u.id === id);
    if (index !== -1) tempUsers[index] = { ...tempUsers[index], ...info };
    else tempUsers.push({ id: tempUsers.length + 1, code: `NYX00${tempUsers.length + 1}`, status: 'pending', ...info, createdOn: new Date(), updatedOn: new Date() });

    this.userSignal.set([...tempUsers]);
    /**Call POST/PATCH user API */
  }

  onDeleteUser(user: User) {
    const tempUsers = this.users().filter(u => u.id !== user.id);
    this.userSignal.set([...tempUsers]);
    /**Call DELETE user API */
  }
  
  forbiddenStartValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;
      const startsWithNumberOrSpecialChar = /^[0-9!@#$%^&*]/.test(value);
      return startsWithNumberOrSpecialChar ? { forbiddenStart: true } : null;
    };
  }

  passMatchValidator(control: AbstractControl): Validators | null {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmNewPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  onEditUser(user: User) {
    this.userForm.patchValue(user);
  }
}
