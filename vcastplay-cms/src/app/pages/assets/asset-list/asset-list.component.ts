import { Component, computed, inject, signal } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { UtilityService } from '../../../core/services/utility.service';
import { AssetsService } from '../../../core/services/assets.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Assets } from '../../../core/interfaces/assets';
import { FormControl } from '@angular/forms';
import { PlaylistService } from '../../../core/services/playlist.service';
import { Playlist } from '../../../core/interfaces/playlist';

@Component({
  selector: 'app-asset-list',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class AssetListComponent {

  pageInfo: MenuItem = [ { label: 'Asset Library' }, { label: 'Lists' } ];
  actionItems: MenuItem[] = [
    { 
      label: 'Options',
      items: [
        { label: 'Preview', icon: 'pi pi-eye', command: ($event: any) => this.onClickPreview(this.selectedAsset()) },
        { label: 'Duplicate', icon: 'pi pi-copy', command: ($event: any) => this.onClickDuplicate(this.selectedAsset(), $event) },
        { label: 'Add to Playlist', icon: 'pi pi-list', command: ($event: any) => this.onClickAddToPlaylist(this.selectedAsset(), $event) },
        { label: 'Delete', icon: 'pi pi-trash', command: ($event: any) => this.onClickDelete(this.selectedAsset(), $event) }
      ]
    }
  ];

  assetService = inject(AssetsService);
  playlistService = inject(PlaylistService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  router = inject(Router);

  assetViewModeSignal = signal<string>('Grid');
  isShowPreview = signal<boolean>(false);
  isShowAddToPlaylist = signal<boolean>(false);

  assetViewModeCtrl: FormControl = new FormControl('Grid');
  
  filteredAssets = computed(() => {
    return this.assetService.assets();
  });

  constructor() {
    this.assetViewModeCtrl.valueChanges.subscribe(value => this.assetViewModeSignal.set(value));
  }

  ngOnInit() {
    this.assetService.onGetAssets();
  }

  async onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      await this.assetService.onDropFile(input.files);
      this.message.add({ severity:'success', summary: 'Success', detail: `${input.files.length} file(s) uploaded successfully!` });  
    }
  }

  onDropFile(event: DragEvent) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || []);    
    if (files) {
      this.confirmation.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to upload these assets?',
        closable: true,
        closeOnEscape: true,
        header: 'Confirm Save',
        icon: 'pi pi-info-circle',
        rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
        },
        acceptButtonProps: {
          label: 'Save',
        },
        accept: async () => {     
          this.assetForm.reset();   
          await this.assetService.onDropFile(files);
          this.message.add({ severity:'success', summary: 'Success', detail: `${files.length} file(s) uploaded successfully!` });  
        },
      })
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  onClickAddNew() {
    this.assetForm.reset();
    this.isEditMode.set(false);
    this.router.navigate([ '/assets/asset-details' ]);
  }

  onClickEdit(asset: Assets) {
    this.isEditMode.set(true);
    this.assetForm.patchValue(asset);   
    this.router.navigate([ '/assets/asset-details' ]);
  }

  onClickDuplicate(item: any, event: Event) {
    this.assetService.onDuplicateAssets(item);
    this.message.add({ severity:'success', summary: 'Success', detail: 'Asset duplicated successfully!' });
    this.selectedAsset.set(null);
  }

  onClickAddToPlaylist(item: any, event: Event) {
    this.playlistService.onGetPlaylists();
    this.isShowAddToPlaylist.set(true);
    this.assetForm.patchValue(item);
  }

  onClickAddMultipleToPlaylist(event: Event) {
    this.playlistService.onGetPlaylists();
    this.isShowAddToPlaylist.set(true);
  }

  onClickSaveToPlaylist(event: Event) {    
    this.playlistService.onSaveAssetToPlaylist(this.assetForm.value, this.selectedArrPlaylist());
    this.message.add({ severity:'success', summary: 'Success', detail: 'Asset added to playlist successfully!' });
    this.isShowAddToPlaylist.set(false);
    this.selectedArrPlaylist.set([]);
    this.assetForm.reset();
  }

  onClickCancelSaveToPlaylist() {
    this.isShowAddToPlaylist.set(false);
    this.selectedArrPlaylist.set([]);
  }

  onClickDelete(item: any, event: Event) {
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
        this.assetService.onDeleteAssets(item);
        this.message.add({ severity:'success', summary: 'Success', detail: 'User deleted successfully!' });
        this.selectedAsset.set(null);
      },
      reject: () => { }
    })
  }

  onClickRefresh() { }

  onClickPreview(item: any) {
    this.selectedAsset.set(item);
    this.isShowPreview.set(!this.isShowPreview());
  }

  onClickOpenOptions(event: Event, item: any, menu: any) {
    this.selectedAsset.set(item);
    menu.toggle(event);
  }

  get isMobile() { return this.utils.isMobile(); }
  get isTablet() { return this.utils.isTablet(); }
  get isEditMode() { return this.assetService.isEditMode; }
  get selectedAsset() { return this.assetService.selectedAsset; }
  get assetViewModes() { return this.assetService.assetViewModes; }
  get assetForm() { return this.assetService.assetForm; }
  get first() { return this.assetService.first; }
  get rows() { return this.assetService.rows; }
  get totalRecords() { return this.assetService.totalRecords; }
  get selectedArrPlaylist() { return this.playlistService.selectedArrPlaylist; }
  get selectedArrAssets() { return this.assetService.selectedArrAssets; }
}
