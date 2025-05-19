import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from '../interfaces/account-settings';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    code: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    mobile: new FormControl(''),
    role: new FormControl(''),
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
