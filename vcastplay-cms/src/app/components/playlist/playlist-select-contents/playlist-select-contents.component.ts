import { Component, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { AssetsService } from '../../../core/services/assets.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AudienceTagFiltersComponent } from '../../audience-tag-filters/audience-tag-filters.component';
import { Assets } from '../../../core/interfaces/assets';
import { AssetListItemComponent } from '../../../pages/assets/asset-list-item/asset-list-item.component';
import { PlaylistService } from '../../../core/services/playlist.service';

@Component({
  selector: 'app-playlist-select-contents',
  imports: [ PrimengUiModule, AudienceTagFiltersComponent, AssetListItemComponent ],
  templateUrl: './playlist-select-contents.component.html',
  styleUrl: './playlist-select-contents.component.scss'
})
export class PlaylistSelectContentsComponent {

  @Input() playListForm!: FormGroup;
  @Output() assetSelected = new EventEmitter<Assets[]>();

  assetService = inject(AssetsService);
  playListService = inject(PlaylistService);

  filteredAssets = signal<Assets[]>([]);

  audienceTagForm: FormGroup = new FormGroup({
    audienceTag: new FormGroup({
      genders: new FormControl([], { nonNullable: true }),
      ageGroups: new FormControl([], { nonNullable: true }),
      timeOfDays: new FormControl([], { nonNullable: true }),
      seasonalities: new FormControl([], { nonNullable: true }),
      locations: new FormControl([], { nonNullable: true }),
      pointOfInterests: new FormControl([], { nonNullable: true }),
      tags: new FormControl([], { nonNullable: true }),
    })
  });

  constructor() {
    effect(() => {
      const activeStep = this.activeStep();      
      if (activeStep === 2) this.onFilteredAssets();
    })
  }

  onFilteredAssets() {
    const assets = this.assetService.assets();
    const audienceTag = this.audienceTagForm.value.audienceTag;    
    const filtered = this.filterItems(assets, audienceTag);
    this.filteredAssets.set(filtered);
    this.assetSelected.emit(this.filteredAssets());
  }
  
  private filterItems(data: any[], filters: any) {
    const activeKeys = Object.keys(filters).filter(key => filters[key]?.length);

    return data.filter(item => {
      const tag = item.audienceTag;

      return activeKeys.some(key => {
        const filterValues = filters[key];
        const value = tag[key];

        if (Array.isArray(value)) {
          return value.some((v: any) => filterValues.includes(v));
        }

        return filterValues.includes(value);
      });
    });
  }

  get activeStep() { return this.playListService.activeStep; }
}
