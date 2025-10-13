import { Component, ElementRef, EventEmitter, inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Assets } from '../../core/interfaces/assets';
import { SafeurlPipe } from '../../core/pipes/safeurl.pipe';
import { UtilsService } from '../../core/services/utils.service';
import { StorageService } from '../../core/services/storage.service';
import { environment } from '../../../environments/environment.development';
import { IndexedDbService } from '../../core/services/indexed-db.service';

@Component({
  selector: 'app-preview-assets',
  imports: [ ],
  templateUrl: './preview-assets.component.html',
  styleUrl: './preview-assets.component.scss'
})
export class PreviewAssetsComponent {
  
  @ViewChild('video', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('image', { static: false }) imageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('iframe', { static: false }) iframeRef!: ElementRef<HTMLIFrameElement>;

  @Input() currentContent!: Assets | any;
  @Input() currentPlaying: any

  @Output() timeUpdate = new EventEmitter<any>();

  private timeout: number = environment.timeout;

  utils = inject(UtilsService);
  storage = inject(StorageService);
  indexedDB = inject(IndexedDbService);

  // async ngOnChanges() {
  //   const content: any = this.currentContent;
  //   const platform = this.storage.get('platform');

  //   if (this.videoRef) {
  //     this.videoRef.nativeElement.currentTime = 0;
  //     this.videoRef.nativeElement.play();
  //   }
    
  //   // if (!this.currentPlaying) return;

  //   // const items: any = await this.indexedDB.getAllItems();
  //   // const { file, url } = items.find((item: any) => item.file.name == content.name);

  //   // const tempLink = url;

  //   // if (this.currentContent.type == 'video') {
  //   //   this.videoRef.nativeElement.src = tempLink;

  //   //   this.videoRef.nativeElement.currentTime = 0;
  //   //   this.videoRef.nativeElement.play();
  //   // }

  //   // if (this.currentContent.type == 'image') {
  //   //   this.imageRef.nativeElement.src = tempLink;
  //   // }
    
  // }

  // ngAfterViewInit() {
  //   const video = this.videoRef?.nativeElement;
  //   const image = this.imageRef?.nativeElement;
  //   const content: any = this.currentContent; 
    
  //   setTimeout(async () => {
  //     const items: any = await this.indexedDB.getAllItems();
  //     const file: any = items.find((item: any) => item.file.name == content.name);      
  //     if (!file) return;
      
  //     const tempLink = file.url;

  //     if (content.type == 'video') {
  //       video.src = tempLink;
  //       video.currentTime = 0;
  //       video.preload = 'auto';
  //       video.addEventListener('loadeddata', () => {
  //         video.currentTime = 0;
  //         video.play();
  //       })
  //     }

  //     if (content.type == 'image') image.src = tempLink;
  //   }, this.timeout);
  // }
  
  async ngAfterViewInit() {
    if (this.currentContent) {
      await this.onLoadMedia(this.currentContent);
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['currentContent'] && this.currentContent) {
      await this.onLoadMedia(this.currentContent);
    }
  }

  ngOnDestroy() {
    if (this.currentContent?.type == 'video' && this.videoRef) {
      this.videoRef.nativeElement.currentTime = 0;
      this.videoRef.nativeElement.remove();
    }
  }

  onTimeUpdate(event: Event) {
    const video: HTMLVideoElement = event.target as HTMLVideoElement;
    const currentTime = video.currentTime;
    const duration = video.duration;    
    this.timeUpdate.emit({ currentTime, duration });
  }

  onVideoEnded(event: Event) {
    const video: HTMLVideoElement = event.target as HTMLVideoElement;
    // video.currentTime = 0;
    video.pause();
  }

  private async onLoadMedia(content: any) {
    const video = this.videoRef?.nativeElement;
    const image = this.imageRef?.nativeElement;
    
    const items: any = await this.indexedDB.getAllItems();
    const file: any = items.find((item: any) => item.file.name == content.name);      
    if (!file) return;
    
    const tempLink = URL.createObjectURL(file.blob); //file.url;

    if (content.type == 'video' && video) {
      video.src = tempLink;
      video.currentTime = 0;
      video.preload = 'auto';
      video.addEventListener('loadeddata', () => {
        video.currentTime = 0;
        video.play();
      })
    }

    if (content.type == 'image' && image) image.src = tempLink;
  }

}
