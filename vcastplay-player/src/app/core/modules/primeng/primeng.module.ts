import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputOtpModule } from 'primeng/inputotp';

const PRIMENG_MODULES = [
  InputOtpModule
]

@NgModule({
  declarations: [],
  imports: [ CommonModule ],
  exports: [ ...PRIMENG_MODULES ]
})
export class PrimengModule { }
