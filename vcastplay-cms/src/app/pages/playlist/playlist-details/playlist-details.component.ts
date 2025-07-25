import { Component, computed, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { AssetsService } from '../../../core/services/assets.service';
import { PlaylistService } from '../../../core/services/playlist.service';
import { UtilityService } from '../../../core/services/utility.service';
import { Assets } from '../../../core/interfaces/assets';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-playlist-details',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.scss',
  providers: [ MessageService, ConfirmationService ]
})
export class PlaylistDetailsComponent {
  
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  
  pageInfo: MenuItem = [ {label: 'Playlist'}, {label: 'Library', routerLink: '/playlist/playlist-library'}, {label: 'Details'} ];

  utils = inject(UtilityService);
  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);

  moment = moment;

  keywords: FormControl = new FormControl('');
  keywordSignal = signal<string>('');

  isExpanded = signal<boolean>(true);

  assetFilters = signal<any>(this.assetFilterForm.valueChanges);
  audienceTagSignal = signal<any>({});
  filteredAssets = computed(() => {
    const { category, subCategory, type, keywords, orientation }: any = this.assetFilters();
    const assets = this.assetService.assets();
    const hasAnyValue = Object.values(this.audienceTagSignal()).some(arr => Array.isArray(arr) && arr.length > 0);
    const filteredItems = this.utils.onFilterItems(assets, this.audienceTagSignal());
    const data = hasAnyValue ? filteredItems : assets;    

    const filteredAssets = data.filter(asset => {
      const matchesCategory = category ? asset.category?.toLowerCase().includes(category.toLowerCase()) : true;
      const matchesSubCategory = subCategory ? asset.subCategory?.toLowerCase().includes(subCategory.toLowerCase()) : true;
      const matchesType = type ? asset.type?.toLowerCase().includes(type.toLowerCase()) : true;
      const matchesKeywords = keywords ? asset.name?.toLowerCase().includes(keywords.toLowerCase()) : true;
      const matchesOrientation = orientation ? asset.fileDetails.orientation?.toLowerCase().includes(orientation.toLowerCase()) : true;

      return matchesCategory && matchesSubCategory && matchesType && matchesKeywords && matchesOrientation;
    });

    return filteredAssets;
  });

  constructor() {
    this.keywords.valueChanges.subscribe(value => this.keywordSignal.set(value));
    this.assetViewModeCtrl.valueChanges.subscribe(value => this.assetViewModeSignal.set(value));

    effect(() => {
      const progress = this.playlistService.progress();
      if (progress > 0 && this.videoPlayer) this.playlistService.videoElement.set(this.videoPlayer.nativeElement);      
    })
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.isEditMode.set(false);
    this.playListForm.reset({ contents: [] });
    this.playlistService.onStopPreview();
  }

  onClickPlayPreview() {
    if (this.playlistService.isPlaying()) this.playlistService.onStopPreview();
    else this.playlistService.onPlayPreview();
  }

  async onClickSave(event: Event) {
    if (this.playListForm.invalid) {
      this.playListForm.markAllAsTouched();
      this.message.add({ severity: 'error', summary: 'Error', detail: 'Please input required fields (*)' });
      return;
    }

    this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to save changes?',
      header: 'Confirm Save',
      icon: 'pi pi-question-circle',
      acceptButtonProps: { label: 'Save' },
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
      accept: () => {
        console.log(this.playListForm.value);
        this.message.add({ severity: 'success', summary: 'Success', detail: 'Playlist saved successfully!' });
        this.playlistService.onSavePlaylist({ ...this.playListForm.value, duration: this.totalDuration(), isAuto: false });
        this.playListForm.reset();
        this.isEditMode.set(false);
        this.router.navigate([ '/playlist/playlist-library' ]);
      },
    });
  }
  
  onClickCancel() {
    this.router.navigate([ '/playlist/playlist-library' ]);
    this.playListForm.reset({ contents: [] });
  }

  onClickClearAll() {
    this.formControl('contents').setValue([]);
    this.playlistService.onStopPreview();
  }

  onFilterChange(event: any) {
    const { filters, audienceTag } = event    
    this.assetFilters.set(filters);
    this.audienceTagSignal.set(audienceTag);
  }

  formControl(fieldName: string) {
    return this.utils.getFormControl(this.playListForm, fieldName);
  }

  get activeStep() { return this.playlistService.activeStep; }
  get isEditMode() { return this.playlistService.isEditMode; }
  get playListForm() { return this.playlistService.playListForm; }
  get totalDuration() { return this.playlistService.totalDuration; }
  get transitionTypes() { return this.playlistService.transitionTypes; }

  get assets() { return this.assetService.assets; }
  get assetViewModes() { return this.assetService.assetViewModes; }
  get assetViewModeCtrl() { return this.assetService.assetViewModeCtrl; }
  get assetViewModeSignal() { return this.assetService.assetViewModeSignal; }
  get assetFilterForm() { return this.assetService.assetFilterForm; }

}
