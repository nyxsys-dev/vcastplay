import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { StyleClassModule } from 'primeng/styleclass';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    ButtonModule,
    ToolbarModule,
    StyleClassModule,
  ]
})
export class PrimengUiModule { }
