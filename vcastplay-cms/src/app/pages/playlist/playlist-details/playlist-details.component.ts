import { Component, effect, ElementRef, inject, signal, ViewChild } from '@angular/core';
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
  
  pageInfo: MenuItem = [ {label: 'Playlist'}, {label: 'Playlist Library', routerLink: '/playlist/playlist-library'}, {label: 'Playlist Details'} ];

  utils = inject(UtilityService);
  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);

  moment = moment;

  keywords: FormControl = new FormControl('');
  keywordSignal = signal<string>('');
  
  filteredAssets = signal<Assets[]>([]);
  selectedAssets = signal<Assets[]>([]);

  showContents = signal<boolean>(false);
  isExpanded = signal<boolean>(true);
  
  totalDuration = () => {
    const contents: any[] = this.formControl('contents').value;
    return contents.reduce((acc: any, item: any) => acc + item.duration, 0);
  }

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
    this.playListForm.reset();
    this.isEditMode.set(false);
    this.playlistService.onStopPreview();
  }

  onClickPlayPreview() {
    if (this.playlistService.isPlaying()) this.playlistService.onStopPreview();
    else this.playlistService.onPlayPreview();
  }

  onClickGetContents() {
    this.showContents.set(true);
    this.activeStep.set(1);
    this.playlistService.onStopPreview();
  }

  onClickComplete(event: Event) {
    const contents = this.selectedAssets();
    if (contents.length === 0) {
      this.message.add({ severity:'error', summary: 'Error', detail: 'No contents available' });
      return;
    };
    this.filteredAssets.set(contents);
    this.playListForm.patchValue({ contents });
    this.showContents.set(false);
    this.message.add({ severity:'success', summary: 'Success', detail: `Added ${contents.length} contents to playlist` });
  }

  async onClickSave(event: Event) {
    if (this.playListForm.invalid) {
      this.playListForm.markAllAsTouched();
      this.message.add({ severity: 'error', summary: 'Error', detail: 'Please input required fields (*)' });
      return;
    }

    const confirmed = this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to save changes?',
      header: 'Confirm Save',
      icon: 'pi pi-question-circle',
      acceptButtonProps: { label: 'Save' },
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
    });

    if (confirmed) {      
      this.playlistService.onSavePlaylist(this.playListForm.value);
      this.message.add({ severity: 'success', summary: 'Success', detail: 'Playlist saved successfully!' });
      this.playListForm.reset();
      this.isEditMode.set(false);
      await this.router.navigate([ '/playlist/playlist-library' ]);
    }
  }
  
  onClickCancel() {
    this.router.navigate([ '/playlist/playlist-library' ]);
    this.playListForm.patchValue({ contents: []})
  }

  onClickClearAll() {
    this.formControl('contents').setValue([]);
    this.playlistService.onStopPreview();
  }

  formControl(fieldName: string) {
    return this.utils.getFormControl(this.playListForm, fieldName);
  }

  get currentContent() { return this.playlistService.currentContent(); }
  get playListForm() { return this.playlistService.playListForm; }
  get isPlaying() { return this.playlistService.isPlaying; }
  get isLooping() { return this.playlistService.isLooping; }
  get transitionTypes() { return this.playlistService.transitionTypes; }
  get currentTransition() { return this.playlistService.currentTransition(); }
  get assets() { return this.assetService.assets; }
  get assetViewModes() { return this.assetService.assetViewModes; }
  get assetViewModeCtrl() { return this.assetService.assetViewModeCtrl; }
  get assetViewModeSignal() { return this.assetService.assetViewModeSignal; }
  get activeStep() { return this.playlistService.activeStep; }
  get isEditMode() { return this.playlistService.isEditMode; }
  get onTimeUpdate() { return this.playlistService.onTimeUpdate; }
}
