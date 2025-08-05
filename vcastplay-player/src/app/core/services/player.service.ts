import { computed, inject, Injectable, signal } from '@angular/core';
import { Playlist } from '../interfaces/playlist';
import { PlatformService } from './platform.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private contentSignal = signal<Playlist[]>([]);
  contents = computed(() => this.contentSignal());

  platform = inject(PlatformService);

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

  androidData = signal<any>(null);
  androidPath: string = environment.androidFilePath;

  constructor() { }

  onLoadContents() { 
    this.contentSignal.set([
      {
        id: 3,
        name: 'ForBiggerJoyrides.mp4',
        link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        type: 'video',
        duration: 15
      },
      {
        id: 4,
        name: 'pexels-photo-31889976.jpeg',
        link: 'https://images.pexels.com/photos/31889976/pexels-photo-31889976.jpeg',
        type: 'image',
        duration: 7
      },
      {
        id: 5,
        name: 'ForBiggerBlazes.mp4',
        link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        type: 'video',
        duration: 15
      },
      {
        id: 2,
        name: 'pexels-photo-355465.jpeg',
        link: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg',
        type: 'image',
        duration: 5
      },
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

    if (this.platform.platform === 'android') {
      this.currentContent.set({ ...item, link: `${this.androidPath}/${item.name}` });
    } else {
      this.currentContent.set(item);
    }
    
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
        // this.videoElement()?.play();
        const video = this.videoElement();
        if (video) {
          video.load(); // Ensures video is ready
          video.oncanplay = () => {
            video.play();
          };
        }
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

    }, duration); // added 1.5 sec for complete transition
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
    window.getDeviceDetails = (data: any) => {
      console.log('Received from android device details:', data);
      // You can update Angular state here if needed
      this.androidData.set(data);
    };
  }

  onGetReceiveData() {
    window.receiveDataFromAndroid = (data: any) => {
      if (data) {
        console.log('Received from android:', data);
        this.onPlayPreview();
      } else {
        console.log('No data received from android.');
      }
    };
  }

  onGetBrowserInformation() {
    const { appVersion, appName, platform, userAgent }: any = navigator;
    const height = screen.height;
    const width = screen.width;
    const orientation = screen.orientation;
    console.log({ appVersion, appName, platform, userAgent, height, width, orientation });
  }

  // onSendDataToAndroid(data: any) {
  //   if ((window as any).AndroidBridge && typeof (window as any).AndroidBridge.sendCommand === 'function') {
  //     (window as any).AndroidBridge.sendCommand(data);
  //   } else {
  //     console.warn('AndroidBridge not available.');
  //   }
  // }

  onSendDataToAndroid(data: any) {
  if ((window as any).AndroidBridge && typeof (window as any).AndroidBridge.sendCommand === 'function') {
    const jsonData = JSON.stringify(data);
    (window as any).AndroidBridge.sendCommand(jsonData);
  } else {
    console.warn('AndroidBridge not available.');
  }
}
}
