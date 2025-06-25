import { Component, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PlaylistService } from '../../../core/services/playlist.service';
import { UtilityService } from '../../../core/services/utility.service';
import { Playlist } from '../../../core/interfaces/playlist';
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-playlist-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './playlist-list.component.html',
  styleUrl: './playlist-list.component.scss',
  providers: [ MessageService, ConfirmationService ]
})
export class PlaylistListComponent {

  pageInfo: MenuItem = [ { label: 'Playlist' }, { label: 'Playlist Library' } ];
  actionItems: MenuItem[] = [
    { 
      label: 'Options',
      items: [
        { label: 'View', icon: 'pi pi-eye', command: ($event: any) => { this.onClickPreview(this.selectedPlaylist()); } },
        { label: 'Duplicate', icon: 'pi pi-copy', command: ($event: any) => this.onClickDuplicate(this.selectedPlaylist()) },
        { label: 'Delete', icon: 'pi pi-trash', command: ($event: any) => this.onClickDelete(this.selectedPlaylist(), $event) }  
      ]
    }
  ];

  playlistService = inject(PlaylistService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);

  showPreview = signal<boolean>(false);

  ngOnInit() {
    this.playlistService.onGetPlaylists();
  }

  onClickAddNew() {
    this.router.navigate([ '/playlist/playlist-details' ]);
  }

  onClickEdit(playlist: Playlist) {
    this.isEditMode.set(true);
    this.playlistForm.patchValue(playlist);
    this.router.navigate([ '/playlist/playlist-details' ]);
  }

  onClickDelete(playlist: any, event: Event) {
    this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this asset?',
      closable: true,
      closeOnEscape: true,
      header: 'Danger Zone',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.playlistService.onDeletePlaylist(playlist);
        this.message.add({ severity:'success', summary: 'Success', detail: 'Playlist deleted successfully!' });
        this.selectedPlaylist.set(null);
        this.playlistForm.reset();
      },
      reject: () => { }
    })
  }

  onClickDuplicate(playlist: any) {
    this.playlistService.onDuplicatePlaylist(playlist);
    this.message.add({ severity:'success', summary: 'Success', detail: 'Playlist duplicated successfully!' });
  }

  onClickPreview(playlist: any) {
    this.showPreview.set(true);
    this.playlistForm.patchValue(playlist);
  }

  onClickOptions(event: Event, playlist: Playlist, menu: Menu) {
    this.selectedPlaylist.set(playlist);
    menu.toggle(event);
  }

  get playlists() { return this.playlistService.playlists; }
  get playlistForm() { return this.playlistService.playListForm; }
  get isEditMode() { return this.playlistService.isEditMode; }
  get selectedPlaylist() { return this.playlistService.selectedPlaylist; }
  get first() { return this.playlistService.first; }
  get rows() { return this.playlistService.rows; }
  get totalRecords() { return this.playlistService.totalRecords; }
  get currentTransition() { return this.playlistService.currentTransition(); }
  get isPlaying() { return this.playlistService.isPlaying; }
  get getTransitionClasses() { return this.playlistService.getTransitionClasses; }
}
