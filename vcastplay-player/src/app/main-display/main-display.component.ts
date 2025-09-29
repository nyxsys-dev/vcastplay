import { ChangeDetectorRef, Component, effect, ElementRef, forwardRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { PrimengModule } from '../core/modules/primeng/primeng.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NetworkService } from '../core/services/network.service';
import { UtilsService } from '../core/services/utils.service';
import { PlayerService } from '../core/services/player.service';
import { IndexedDbService } from '../core/services/indexed-db.service';
import { ContentState, Playlist } from '../core/interfaces/playlist';
import { ComponentsModule } from '../core/modules/components/components.module';
import { StorageService } from '../core/services/storage.service';
import { PreviewAssetsComponent } from '../components/preview-assets/preview-assets.component';
import { PlaylistsService } from '../core/services/playlists.service';
import { PreviewDesignLayoutComponent } from '../components/preview-design-layout/preview-design-layout.component';
import { PlatformService } from '../core/services/platform.service';
import { environment } from '../../environments/environment.development';
import { PreviewContentRendererComponent } from '../components/preview-content-renderer/preview-content-renderer.component';

@Component({
  selector: 'app-main-display',
  imports: [ 
    PrimengModule, 
    ComponentsModule,
    forwardRef(() => PreviewAssetsComponent),
    forwardRef(() => PreviewDesignLayoutComponent),
    forwardRef(() => PreviewContentRendererComponent),
  ],
  templateUrl: './main-display.component.html',
  styleUrl: './main-display.component.scss'
})
export class MainDisplayComponent {

  networkService = inject(NetworkService);
  indexedDB = inject(IndexedDbService);
  player = inject(PlayerService);
  playlistService = inject(PlaylistsService);
  platformService = inject(PlatformService);
  utils = inject(UtilsService);
  storage = inject(StorageService);

  desktopFilePath: string = environment.desktopFilePath;
  timeout: number = environment.timeout;

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    // if (event.key === 'Backspace') this.player.onStopPreview();
    // if (event.key === 'Enter') this.onClickPlayPreview();
    // if (event.key === 'p') this.player.screenShot();
  }
  
  isPlay = signal<boolean>(false);

  constructor(private cdr: ChangeDetectorRef) { 
    // this.player.onGetReceiveData();
    const platform = this.storage.get('platform');
    window.addEventListener('online', () => this.networkStat.set(true));
    window.addEventListener('offline', () => this.networkStat.set(false));

    effect(() => {
      console.log('🧭 Network status changed:', this.networkStat());
      console.log(`System has been initialized in ${platform.toUpperCase()}`); 
      if (this.dataFromAndroid()) {
        console.log(this.androidData());
      }
       
      // this.systemInfo = { ...this.systemInfo, coords: this.utils.location() };      
    })

    // Receive data from Android
    window.receiveDataFromAndroid = (data: any) => {
      if (data) {
        console.log('🧭 Data received from Android:', data);
      } else {
        console.log('🧭 Data received from Android is empty');
      }
    }
  }

  ngOnInit() { }

  async ngAfterViewInit() {
    const platform = this.storage.get('platform');
    // await this.indexedDB.clearItems();
    // const contents = this.player.onGetContents();
    // contents.forEach(async (content: Playlist) => {
    //   await this.indexedDB.addItem(content)
    // })

    // await this.indexedDB.getAllItems();
    // this.player.onPlayPreview();
    
    this.onGetPlayerInformation();
    // this.player.onGetReceiveData().then((response) => {
    //   console.log(response);
    //   this.isPlay.set(true);
    // });
    this.cdr.detectChanges();
  }
  
  onClickPlayPreview() {
    if (!this.isPlaying()) {
      this.playlistService.onPlayContent(this.playerContent());
    } else {
      this.playlistService.onStopContent(this.playerContent().id);
    }
  }

  onClikcStopPreview() {
    this.playlistService.onStopAllContents();
    this.player.onSetContent('stop');
    if (this.platform == 'desktop') this.utils.onDeleteFolder('vcastplay');
    this.isPlay.set(false)
  }

  onClickSetContent(type: string) {
    const content = this.player.onSetContent(type);
    if (this.platform == 'desktop') {
      switch (type) {
        case 'asset':
          this.utils.onDownloadFiles([ content ]).then((response: any) => {
            this.isPlay.set(true)
          });
          break;
        default:
          this.utils.onDownloadFiles(content.files).then((response: any) => {
            setTimeout(() => this.isPlay.set(true), 500);
          });
          break;
      }
    } else if (this.platform == 'android') {
      const file = ['asset'].includes(type) ? [ content ] : content.files;
      this.player.onSendDataToAndroid({ file });
    }
  }

  onClickCheckUpdates() {
    window.system.checkForUpdates();
  }

  onClickNotepad() {
    this.player.sendApp('notepad')
  }

  onGetPlayerInformation() {
    const platform = this.storage.get('platform');
    const code = this.storage.get('code');
    const playerCode = this.storage.get('playerCode');
    const appVersion = this.storage.get('appVersion');
    this.systemInfo.set({ code, platform, playerCode, appVersion })   
   
    switch (platform) {
      case 'android':
        this.player.onSendDataToAndroid({ code, platform, playerCode, appVersion });
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
  
  getTransitionClasses() {    
    const { type } = this.playerContent().currentTransition() ?? '';
    const fadeIn = this.playerContent().fadeIn();    
    return {
      'transition-all duration-500 ease-in-out': true,
      'w-full h-full flex justify-center items-center': true,
      [`${type?.opacity ? 'opacity-0' : ''} ${type?.x ?? ''}`]: !fadeIn,
      [`${type?.opacity ? 'opacity-100' : ''} ${type?.y ?? ''}`]: fadeIn
    };
  }
  
  trackById(index: number, item: any): any {
    return { id: index, contentId: item.contentId } 
  }

  onDoneRendering(event: any) {
    const platform = this.storage.get('platform');
    if (!['android', 'desktop'].includes(platform)) setTimeout(() => this.isPlay.set(true), this.timeout);
    // setTimeout(() => this.isPlay.set(true), 200);
  }

  get isDev() { return this.utils.isDev; }

  get isElectron() { return window.system?.isElectron; }
  
  get networkStat() { return this.networkService.networkStat; }

  get playerCode() { return this.player.playerCode; }
  get systemInfo() { return this.player.systemInfo; }
  get androidData() { return this.player.androidData; }
  get playerContent() { return this.player.playerContent; }

  get isPlaying() { return this.playlistService.isPlaying; }
  get onProgressUpdate() { return this.playlistService.onProgressUpdate; }

  get platform() { return this.platformService.platform; }
  get dataFromAndroid() { return this.player.dataFromAndroid; }
}
