import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../../components/toolbar/toolbar.component';
import { DrawerComponent } from '../../../components/drawer/drawer.component';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { FiltersComponent } from '../../../components/filters/filters.component';
import { MapmarkersComponent } from '../../../components/mapmarkers/mapmarkers.component';
import { ContentSelectionComponent } from '../../../components/content-selection/content-selection.component';
import { BroadcastListItemComponent } from '../../../features/settings/broadcast/broadcast-list-item/broadcast-list-item.component';
import { BroadcastDetailsComponent } from '../../../features/settings/broadcast/broadcast-details/broadcast-details.component';
import { UserListItemComponent } from '../../../features/settings/users/user-list-item/user-list-item.component';
import { UserDetailsComponent } from '../../../features/settings/users/user-details/user-details.component';
import { UserApprovalComponent } from '../../../features/settings/users/user-approval/user-approval.component';
import { RoleListItemComponent } from '../../../features/settings/roles/role-list-item/role-list-item.component';
import { RoleDetailsComponent } from '../../../features/settings/roles/role-details/role-details.component';
import { ScreenScheduleComponent } from '../../../features/screens/screen-schedule/screen-schedule.component';
import { ScreenFilterComponent } from '../../../features/screens/screen-filter/screen-filter.component';
import { ScreenControlsComponent } from '../../../features/screen-management/screen-controls/screen-controls.component';
import { ScreenManagementListItemComponent } from '../../../features/screen-management/screen-management-list-item/screen-management-list-item.component';
import { ScreenBroadcastMessageComponent } from '../../../features/screen-management/screen-broadcast-message/screen-broadcast-message.component';
import { ScreenSettingsComponent } from '../../../features/screen-management/screen-settings/screen-settings.component';
import { ScreenSelectionComponent } from '../../../features/design-layout/screen-selection/screen-selection.component';
import { AddToPlaylistComponent } from '../../../features/playlist/add-to-playlist/add-to-playlist.component';
import { PlaylistContainerComponent } from '../../../features/playlist/playlist-container/playlist-container.component';
import { PlaylistSelectContentsComponent } from '../../../features/playlist/playlist-select-contents/playlist-select-contents.component';
import { PlaylistListItemComponent } from '../../../features/playlist/playlist-list-item/playlist-list-item.component';
import { PlaylistFilterComponent } from '../../../features/playlist/playlist-filter/playlist-filter.component';
import { AssetListItemComponent } from '../../../features/assets/asset-list-item/asset-list-item.component';
import { AssetScheduleComponent } from '../../../features/assets/asset-schedule/asset-schedule.component';
import { AssetFilterComponent } from '../../../features/assets/asset-filter/asset-filter.component';
import { AudienceTagFiltersComponent } from '../../../components/audience-tag-filters/audience-tag-filters.component';
import { SchedulesContentListComponent } from '../../../features/schedules/schedules-content-list/schedules-content-list.component';
import { ScheduleListItemComponent } from '../../../features/schedules/schedule-list-item/schedule-list-item.component';
import { ScheduleFilterComponent } from '../../../features/schedules/schedule-filter/schedule-filter.component';
import { ScreenDetailsComponent } from '../../../features/screen-management/screen-details/screen-details.component';
import { DesignLayoutToolsComponent } from '../../../features/design-layout/design-layout-tools/design-layout-tools.component';
import { ObjectPropertiesComponent } from '../../../features/design-layout/object-properties/object-properties.component';
import { DesignLayoutListItemComponent } from '../../../features/design-layout/design-layout-list-item/design-layout-list-item.component';
import { ScheduleHourListComponent } from '../../../features/schedules/schedule-hour-list/schedule-hour-list.component';
import { ScheduleFillersComponent } from '../../../features/schedules/schedule-fillers/schedule-fillers.component';

const COMPONENT_MODULES = [
  CommonModule,
  ToolbarComponent,
  DrawerComponent,
  BreadcrumbsComponent,
  FiltersComponent,
  MapmarkersComponent,
  ContentSelectionComponent,

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
  ScreenSelectionComponent,
  ScreenDetailsComponent,

  // Playlist Components
  AddToPlaylistComponent,
  PlaylistContainerComponent,
  PlaylistSelectContentsComponent,
  PlaylistListItemComponent,
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
  ScheduleHourListComponent,
  ScheduleFillersComponent,

  // Design Layout Components
  DesignLayoutToolsComponent,
  DesignLayoutListItemComponent,
  ObjectPropertiesComponent,
];

@NgModule({
  declarations: [],
  imports: [...COMPONENT_MODULES],
  exports: [...COMPONENT_MODULES],
})
export class ComponentsModule {}
