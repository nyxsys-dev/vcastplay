import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const PRIMENG_MODULES = [
  ButtonModule,
  InputOtpModule,
  FormsModule,
  ReactiveFormsModule,
]

@NgModule({
  declarations: [],
  imports: [ CommonModule ],
  exports: [ ...PRIMENG_MODULES ]
})
export class PrimengModule { }
