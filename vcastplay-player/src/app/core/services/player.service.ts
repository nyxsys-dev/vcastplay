import { computed, Injectable, signal } from '@angular/core';
import { Playlist } from '../interfaces/playlist';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private contentSignal = signal<Playlist[]>([]);
  contents = computed(() => this.contentSignal());

  timeoutId: any;
  intervalId: any;
  gapTimeout: any;
  systemInfo = signal<any>(null);
  currentIndex = signal<number>(0);
  currentContent = signal<any | null>(null);
  currentTransition = signal<any>(null);
  duration = signal<number>(3000);
  isPlaying = signal<boolean>(false);
  fadeIn = signal<boolean>(false);
  isLooping = signal<boolean>(false);
  showContents = signal<boolean>(false);
  progress = signal<number>(0);

  videoElement = signal<HTMLVideoElement | null>(null);

  hideCursor = signal<boolean>(false);
  private hideCursorTimeout: any;

  playerCode = signal<string>('');

  constructor() { }

  onLoadContents() { 
    this.contentSignal.set([
      {
        id: 1,
        link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        type: 'video',
        duration: 60
      },
      {
        id: 2,
        link: 'https://fastly.picsum.photos/id/10/2500/1667.jpg?hmac=J04WWC_ebchx3WwzbM-Z4_KC_LeLBWr5LZMaAkWkF68',
        type: 'image',
        duration: 8
      },
      {
        id: 3,
        link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        type: 'video',
        duration: 15
      },
      {
        id: 4,
        link: 'https://fastly.picsum.photos/id/12/2500/1667.jpg?hmac=Pe3284luVre9ZqNzv1jMFpLihFI6lwq7TPgMSsNXw2w',
        type: 'image',
        duration: 7
      },
      {
        id: 5,
        link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        type: 'video',
        duration: 15
      }
    ]); 
  }

  onGetContents() {
    if (this.contentSignal().length === 0) this.onLoadContents();
    return this.contentSignal();
  }

  onPlayPreview(index: number = 0) {
    const loop: boolean = true
    const contents = this.onGetContents();
    const { hasGap, type, speed } = { hasGap: false, type: 'fade', speed: 1 }//this.transition?.value;
    const transitionSpeed = speed * 100;
    const gapDuration = hasGap ? 1000 : 0;

    this.currentTransition.set({ type, speed: transitionSpeed });    

    if (contents.length === 0) return;

    this.isPlaying.set(true);

    const item = contents[this.currentIndex()];
    
    this.currentContent.set(item);
    
    this.fadeIn.set(true);
    this.progress.set(0);

    const duration = item.duration * 1000;
    
    switch(item.type) {
      case 'image':
      case 'audio':
      case 'text':
      case 'web':
        this.onTriggerInterval(duration);
        break;
      case 'video':
        this.videoElement()?.play();
        this.onTriggerInterval(duration);
        break;
    }

    this.timeoutId = setTimeout(() => {
      const nextIndex = (index + 1) % contents.length; // Loop back to 0 after last item
      const isLooping = loop;
      
      // Trigger fade-in again for next content
      this.fadeIn.set(false);

      // Clear content
      this.currentContent.set(null);

      // If there is a gap, wait for the gap duration before playing the next content
      this.gapTimeout = setTimeout(() => {
        if (isLooping) {
          this.currentIndex.set(nextIndex);
        } else {
          if (index + 1 >= contents.length) {
            this.onStopPreview();
            return;
          }
          this.currentIndex.set(this.currentIndex() + 1);
        }
        
        this.fadeIn.set(true);
        this.currentContent.set(contents[this.currentIndex()]);

        // Trigger content schedule
        // this.onGetContentSchedule(contents[this.currentIndex()])

        this.onPlayPreview(this.currentIndex());
      }, gapDuration + 50);

    }, duration + 1500); // added 1.5 sec for complete transition
  }

  onStopPreview() {
    this.progress.set(0);
    this.isPlaying.set(false);
    this.currentIndex.set(0);
    this.currentContent.set(null);
    clearTimeout(this.timeoutId);
    clearInterval(this.intervalId);
    clearTimeout(this.gapTimeout);
  }
  
  onTriggerInterval(duration: number) {
    let startTime = Date.now();
    this.intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      this.progress.set(Math.min((elapsed / duration) * 100, 100));

      if (elapsed >= duration) {
        this.progress.set(100);
        clearInterval(this.intervalId);
        // this.onStopPreview();
      }
    }, 500);
  }

  onTimeUpdate(event: any) {    
    const { currentTime, duration } = event;
    this.onUpdateProgress(currentTime, duration);
  }

  onUpdateProgress(currentSeconds: number, duration: number) {
    const percent = (currentSeconds / duration) * 100;
    this.progress.set(Math.min(percent, 100));
  }

  onMouseMove() {
    this.hideCursor.set(false);
    clearTimeout(this.hideCursorTimeout);

    this.hideCursorTimeout = setTimeout(() => {
      console.log('Hide cursor');
      
      this.hideCursor.set(true);
    }, 3000);
  }
  
  /**Player Control functions */
  
  send(action: string) {
    window.system.control(action)
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }

  sendApp(app: string) {
    window.system.control("open", app)
      .then(response => console.log(response));
  }

  closeApp(app: string) {
    window.system.control("close", app)
      .then(response => console.log(response));
  }

  screenShot() {
    window.system.takeScreenshot()
      .then(response => console.log(response))
      .catch(err => console.error(err));
  }

  onGetDesktopInformation() {
    window.system.getSystemInfo()
      .then((response: any) => {        
        console.log(response);
        console.log(this.systemInfo());
        // this.requestLocation();
      })
      .catch(err => console.error(err));
  }
  
  onGetAndroidInformation() {
    (window as any).getDeviceDetails = function (data: any) {
      console.log('Received from android device details:', data);
    }
  }

  onGetBrowserInformation() {
    const { appVersion, appName, platform, userAgent }: any = navigator;
    console.log({ appVersion, appName, platform, userAgent }, navigator);
  }

  onSendDataToAndroid(data: any) {
    if ((window as any).AndroidBridge && typeof (window as any).AndroidBridge.sendCommand === 'function') {
      (window as any).AndroidBridge.sendCommand(data);
    } else {
      console.warn('AndroidBridge not available.');
    }
  }
}
