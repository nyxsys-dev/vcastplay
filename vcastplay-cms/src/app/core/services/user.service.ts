import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
    status: new FormControl('')
  })

  constructor() { }

  onEditUser(user: User) {
    this.userForm.patchValue(user);
  }
}
