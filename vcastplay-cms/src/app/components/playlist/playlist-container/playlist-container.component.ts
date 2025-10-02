import { Component, computed, effect, ElementRef, inject, Input, QueryList, signal, TemplateRef, ViewChildren, } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { PlaylistService } from '../../../core/services/playlist.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AssetsService } from '../../../core/services/assets.service';
import { MessageService } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { PlaylistItemContentComponent } from '../playlist-item-content/playlist-item-content.component';

@Component({
  selector: 'app-playlist-container',
  imports: [ PrimengUiModule, PlaylistItemContentComponent ],
  templateUrl: './playlist-container.component.html',
  styleUrl: './playlist-container.component.scss'
})
export class PlaylistContainerComponent {

  @ViewChildren('playlistContent', { read: ElementRef }) playlistContent!: QueryList<ElementRef>

  @Input() playListForm!: FormGroup;

  // assets = signal<Assets[]>([]);

  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  message = inject(MessageService);

  activeIndex: number = 0;

  constructor() {
    effect(() => {
      const content = this.currentPlaying;
      if (content) {
        const { contents } = this.playListForm.value;
        const index = contents.findIndex((item: any) => item.contentId === content.contentId);
        this.activeIndex = index;
        this.onScrollContent(index);
      }
    })
  }

  ngOnInit() {
    // this.assets.set(this.assetService.onGetAssets());    
  }

  onScrollContent(index: number) {
    const child = this.playlistContent.toArray()[index].nativeElement as HTMLElement;
    child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  onDropped(event: CdkDragDrop<string[]>) {
    const length = this.contents?.value?.length || 0;
    const contents = this.contents?.value || [];
    const { previousIndex, previousContainer, currentIndex, container, item: { data } } = event;

    // If the item is from the same container (reordering)
    if (previousContainer == container) {
      moveItemInArray(contents, previousIndex, currentIndex);
      this.contents?.setValue([...contents]);
      return;
    }

    // If it's from another container (adding)    
    // const isExists = contents.some((item: Assets) => item.id === data.id);
    // if (isExists) {
    //   this.message.add({ severity: 'error', summary: 'Error', detail: `"${data.name}" is already exists` });
    //   return;
    // }

    // Add item
    contents.splice(currentIndex, 0, {...data, contentId: length + 1});
    this.contents?.setValue([...contents]);
  }

  trackByFn(index: number, item: any) { return item.contentId; }

  get contents() { return this.playListForm.get('contents'); }
  get isPlaying() { return this.playlistService.isPlaying; }
  get currentPlaying() { return this.playlistService.currentPlaying(); }
}
