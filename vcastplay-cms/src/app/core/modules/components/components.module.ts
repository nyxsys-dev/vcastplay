import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../../components/toolbar/toolbar.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { FiltersComponent } from '../../../components/filters/filters.component';
import { PreviewContentComponent } from '../../../components/preview-content/preview-content.component';
import { PlaylistContainerComponent } from '../../../components/playlist/playlist-container/playlist-container.component';
import { PlaylistSelectContentsComponent } from '../../../components/playlist/playlist-select-contents/playlist-select-contents.component';
import { AssetListItemComponent } from '../../../pages/assets/asset-list-item/asset-list-item.component';
import { PlaylistListItemComponent } from '../../../components/playlist/playlist-list-item/playlist-list-item.component';
import { AssetScheduleComponent } from '../../../pages/assets/asset-schedule/asset-schedule.component';
import { AudienceTagFiltersComponent } from '../../../components/audience-tag-filters/audience-tag-filters.component';
import { MapmarkersComponent } from '../../../components/mapmarkers/mapmarkers.component';
import { UserListItemComponent } from '../../../components/users/user-list-item/user-list-item.component';
import { UserDetailsComponent } from '../../../components/users/user-details/user-details.component';
import { RoleListItemComponent } from '../../../components/roles/role-list-item/role-list-item.component';
import { RoleDetailsComponent } from '../../../components/roles/role-details/role-details.component';
import { AddToPlaylistComponent } from '../../../components/playlist/add-to-playlist/add-to-playlist.component';
import { PlaylistPreviewComponent } from '../../../components/playlist/playlist-preview/playlist-preview.component';


const COMPONENT_MODULES = [
  CommonModule,
  ToolbarComponent,
  DrawerComponent,
  BreadcrumbsComponent,
  FiltersComponent,
  PreviewContentComponent,
  MapmarkersComponent,

  // Users Components
  UserListItemComponent, 
  UserDetailsComponent,

  // Roles Components
  RoleListItemComponent,
  RoleDetailsComponent,

  // Playlist Components
  AddToPlaylistComponent,
  PlaylistContainerComponent, 
  PlaylistSelectContentsComponent, 
  PlaylistListItemComponent,
  PlaylistPreviewComponent,

  // Asset Components
  AssetListItemComponent,
  AssetScheduleComponent, 

  // Audience Tag Components
  AudienceTagFiltersComponent
]

@NgModule({
  declarations: [],
  imports: [ ...COMPONENT_MODULES ],
  exports: [ ...COMPONENT_MODULES, ]
})
export class ComponentsModule { }
