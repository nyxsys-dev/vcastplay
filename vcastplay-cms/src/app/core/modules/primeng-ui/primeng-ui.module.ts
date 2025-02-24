import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { ListboxModule } from 'primeng/listbox';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { TableModule } from 'primeng/table';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

import { StyleClassModule } from 'primeng/styleclass';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    ButtonModule,
    ToolbarModule,
    AvatarModule,
    AvatarGroupModule,
    StyleClassModule,
    MenuModule,
    ListboxModule,
    BadgeModule,
    OverlayBadgeModule,
    TableModule,
    BreadcrumbModule,
    CardModule,
    TagModule,
    InputTextModule,
  ]
})
export class PrimengUiModule { }
