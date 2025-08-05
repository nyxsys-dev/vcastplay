import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { PrimengModule } from '../core/modules/primeng/primeng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NetworkService } from '../core/services/network.service';
import { UtilsService } from '../core/services/utils.service';
import { PlayerService } from '../core/services/player.service';
import { IndexedDbService } from '../core/services/indexed-db.service';
import { Playlist } from '../core/interfaces/playlist';
import { ComponentsModule } from '../core/modules/components/components.module';
import { StorageService } from '../core/services/storage.service';

@Component({
  selector: 'app-main-display',
  imports: [ PrimengModule, ComponentsModule ],
  templateUrl: './main-display.component.html',
  styleUrl: './main-display.component.scss'
})
export class MainDisplayComponent {

  networkService = inject(NetworkService);
  indexedDB = inject(IndexedDbService);
  player = inject(PlayerService);
  utils = inject(UtilsService);
  storage = inject(StorageService);

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    // if (event.key === 'Backspace') this.player.onStopPreview();
    // if (event.key === 'Enter') this.onClickPlayPreview();
    // if (event.key === 'p') this.player.screenShot();
    
  }

  constructor() {
    const platform = this.storage.get('platform');
    window.addEventListener('online', () => this.networkStat.set(true));
    window.addEventListener('offline', () => this.networkStat.set(false));

    effect(() => {
      console.log('🧭 Network status changed:', this.networkStat());
      console.log(`System has been initialized in ${platform.toUpperCase()}`);      
      // this.systemInfo = { ...this.systemInfo, coords: this.utils.location() };      
    })
  }

  async ngOnInit() {
    // this.indexedDB.clearItems();
    // this.player.onLoadContents();
  }

  async ngAfterViewInit() {
    // const platform = this.storage.get('platform');
    const contents = this.player.onGetContents();
    // contents.forEach(async (content: Playlist) => {
    //   await this.indexedDB.addItem(content)
    // })

    // await this.indexedDB.getAllItems();
    // this.player.onPlayPreview();
    
    // if (platform === 'android') {
    // }
    this.onGetPlayerInformation();
    this.player.onGetReceiveData();
  }

  onClickPlayPreview() {
    if (this.isPlaying()) this.player.onStopPreview();
    else this.player.onPlayPreview();
  }

  onClickCheckUpdates() {
    window.system.checkForUpdates();
  }

  onGetPlayerInformation() {
    const platform = this.storage.get('platform');
    const code = this.storage.get('code');
    const playerCode = this.storage.get('playerCode');
    const appVersion = this.storage.get('appVersion');
    this.systemInfo.set({ code, platform, playerCode, appVersion })
   
    switch (platform) {
      case 'android':
        const playlist = this.player.onGetContents();
        this.player.onSendDataToAndroid({ code, platform, playerCode, appVersion, playlist });
        this.player.onGetAndroidInformation();
        console.log(this.androidData());
        break;
      case 'desktop':
        this.player.onGetDesktopInformation();
        break;
      default:
        this.player.onGetBrowserInformation();
        break;
    }
  }

  get isDev() { return this.utils.isDev; }

  get isElectron() { return window.system?.isElectron; }
  
  get networkStat() { return this.networkService.networkStat; }

  get isPlaying() { return this.player.isPlaying; }
  get onTimeUpdate() { return this.player.onTimeUpdate; }
  get currentContent() { return this.player.currentContent; }
  get currentTransition() { return this.player.currentTransition; }
  get onMouseMove() { return this.player.onMouseMove; }
  get hideCursor() { return this.player.hideCursor; }
  get playerCode() { return this.player.playerCode; }
  get systemInfo() { return this.player.systemInfo; }
  get androidData() { return this.player.androidData; }
}
