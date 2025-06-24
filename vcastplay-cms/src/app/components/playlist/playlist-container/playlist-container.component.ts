import { Component, computed, inject, Input, signal, } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { PlaylistService } from '../../../core/services/playlist.service';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AssetsService } from '../../../core/services/assets.service';
import { Assets } from '../../../core/interfaces/assets';
import { MessageService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { PlaylistItemContentComponent } from '../playlist-item-content/playlist-item-content.component';

@Component({
  selector: 'app-playlist-container',
  imports: [ PrimengUiModule, CommonModule, ComponentsModule, PlaylistItemContentComponent ],
  templateUrl: './playlist-container.component.html',
  styleUrl: './playlist-container.component.scss'
})
export class PlaylistContainerComponent {

  @Input() playListForm!: FormGroup;

  assets = signal<Assets[]>([]);

  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  message = inject(MessageService);

  ngOnInit() {
    this.assets.set(this.assetService.onGetAssets());    
  }

  onDropped(event: CdkDragDrop<string[]>) {
    const contents = this.contents?.value || [];
    const { previousIndex, previousContainer, currentIndex, container, item: { data } } = event;

    // If the item is from the same container (reordering)
    if (previousContainer == container) {
      moveItemInArray(contents, previousIndex, currentIndex);
      this.contents?.setValue([...contents]);
      return;
    }

    // If it's from another container (adding)    
    const isExists = contents.some((item: Assets) => item.id === data.id);
    if (isExists) {
      this.message.add({ severity: 'error', summary: 'Error', detail: `"${data.name}" is already exists` });
      return;
    }

    // Add item
    contents.splice(currentIndex, 0, data);
    this.contents?.setValue([...contents]);
  }

  get contents() { return this.playListForm.get('contents'); }
  get isPlaying() { return this.playlistService.isPlaying; }
}
