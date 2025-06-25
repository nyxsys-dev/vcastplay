import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { PlaylistService } from '../../../core/services/playlist.service';
import { FormGroup } from '@angular/forms';
import { Playlist } from '../../../core/interfaces/playlist';

@Component({
  selector: 'app-add-to-playlist',
  imports: [ PrimengUiModule ],
  templateUrl: './add-to-playlist.component.html',
  styleUrl: './add-to-playlist.component.scss'
})
export class AddToPlaylistComponent {

  @Input() assetForm!: FormGroup;
  @Output() selectedPlaylistsChange = new EventEmitter<Playlist[]>();

  playlistService = inject(PlaylistService);

  onSelectionChange(event: any) {
    this.selectedPlaylistsChange.emit(event);
  }

  get playlists() { return this.playlistService.playlists; }
  get selectedArrPlaylist() { return this.playlistService.selectedArrPlaylist; }
}
