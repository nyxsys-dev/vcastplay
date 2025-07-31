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
import { PlaylistListItemComponent } from '../../../pages/playlist/playlist-list-item/playlist-list-item.component';
import { AssetScheduleComponent } from '../../../pages/assets/asset-schedule/asset-schedule.component';
import { AudienceTagFiltersComponent } from '../../../components/audience-tag-filters/audience-tag-filters.component';
import { MapmarkersComponent } from '../../../components/mapmarkers/mapmarkers.component';
import { UserListItemComponent } from '../../../components/users/user-list-item/user-list-item.component';
import { UserDetailsComponent } from '../../../components/users/user-details/user-details.component';
import { RoleListItemComponent } from '../../../components/roles/role-list-item/role-list-item.component';
import { RoleDetailsComponent } from '../../../components/roles/role-details/role-details.component';
import { AddToPlaylistComponent } from '../../../components/playlist/add-to-playlist/add-to-playlist.component';
import { PlaylistPreviewComponent } from '../../../components/playlist/playlist-preview/playlist-preview.component';
import { UserApprovalComponent } from '../../../components/users/user-approval/user-approval.component';
import { SchedulesContentListComponent } from '../../../pages/schedules/schedules-content-list/schedules-content-list.component';
import { ScheduleListItemComponent } from '../../../pages/schedules/schedule-list-item/schedule-list-item.component';
import { ScreenScheduleComponent } from '../../../pages/screens/screen-schedule/screen-schedule.component';
import { AssetFilterComponent } from '../../../pages/assets/asset-filter/asset-filter.component';
import { ScreenFilterComponent } from '../../../pages/screens/screen-filter/screen-filter.component';
import { PlaylistFilterComponent } from '../../../pages/playlist/playlist-filter/playlist-filter.component';
import { ScheduleFilterComponent } from '../../../pages/schedules/schedule-filter/schedule-filter.component';
import { ScreenControlsComponent } from '../../../pages/screen-management/screen-controls/screen-controls.component';
import { ScreenManagementListItemComponent } from '../../../pages/screen-management/screen-management-list-item/screen-management-list-item.component';
import { BroadcastListItemComponent } from '../../../pages/settings/broadcast/broadcast-list-item/broadcast-list-item.component';
import { BroadcastDetailsComponent } from '../../../pages/settings/broadcast/broadcast-details/broadcast-details.component';
import { ScreenBroadcastMessageComponent } from '../../../components/screen-broadcast-message/screen-broadcast-message.component';
import { ScrubberTimelineComponent } from '../../../components/scrubber-timeline/scrubber-timeline.component';
import { ScheduleFillersComponent } from '../../../pages/schedules/schedule-fillers/schedule-fillers.component';
import { ScreenSettingsComponent } from '../../../pages/screen-management/screen-settings/screen-settings.component';


const COMPONENT_MODULES = [
  CommonModule,
  ToolbarComponent,
  DrawerComponent,
  BreadcrumbsComponent,
  FiltersComponent,
  PreviewContentComponent,
  MapmarkersComponent,
  ScrubberTimelineComponent,

  // Broadcast Components
  BroadcastListItemComponent,
  BroadcastDetailsComponent,

  // Users Components
  UserListItemComponent, 
  UserDetailsComponent,
  UserApprovalComponent,

  // Roles Components
  RoleListItemComponent,
  RoleDetailsComponent,

  //Screen Components
  ScreenScheduleComponent,
  ScreenFilterComponent,
  ScreenControlsComponent,
  ScreenManagementListItemComponent,
  ScreenBroadcastMessageComponent,
  ScreenSettingsComponent,

  // Playlist Components
  AddToPlaylistComponent,
  PlaylistContainerComponent, 
  PlaylistSelectContentsComponent, 
  PlaylistListItemComponent,
  PlaylistPreviewComponent,
  PlaylistFilterComponent,

  // Asset Components
  AssetListItemComponent,
  AssetScheduleComponent, 
  AssetFilterComponent,

  // Audience Tag Components
  AudienceTagFiltersComponent,

  // Schedule Components
  SchedulesContentListComponent,
  ScheduleListItemComponent,
  ScheduleFilterComponent,
  ScheduleFillersComponent,
]

@NgModule({
  declarations: [],
  imports: [ ...COMPONENT_MODULES ],
  exports: [ ...COMPONENT_MODULES, ]
})
export class ComponentsModule { }
