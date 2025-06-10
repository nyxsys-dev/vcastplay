import { inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Assets } from '../interfaces/assets';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  timeoutId: any;
  intervalId: any;
  currentIndex = signal<number>(0);
  currentContent = signal<Assets | null>(null);
  duration = signal<number>(3000); // default 3 seconds per content
  isPlaying = signal<boolean>(false);
  fadeIn = signal<boolean>(false);
  isLooping = signal<boolean>(false);

  progress = signal<number>(0);

  playlistItems = signal<any[]>([]);
  playListForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('New Playlist'),
    description: new FormControl('This is a sample description of a new playlist'),
    transition: new FormGroup({
      hasGap: new FormControl(false),
      type: new FormControl(''),
      duration: new FormControl(0)
    }),
    contents: new FormControl<Assets[]>([]),
    status: new FormControl(''),
    loop: new FormControl(false),
  })

  videoElement = signal<HTMLVideoElement | null>(null);

  constructor() { }

  onPlayPreview(index: number = 0) {
    const contents = this.contents?.value;
    if (contents.length === 0) return;

    this.isPlaying.set(true);

    const item = contents[this.currentIndex()];
    this.currentContent.set(item);
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
      const isLooping = this.loop?.value;
            
      if (isLooping) this.currentIndex.set(nextIndex);
      else {
        if (index + 1 >= contents.length) {
          this.onStopPreview();
          return;
        }
        
        this.currentIndex.set(this.currentIndex() + 1);
      }

      this.currentContent.set(contents[this.currentIndex()]);
      this.onPlayPreview(this.currentIndex());
    }, duration + 1500); // added 1 sec for complete transition
  }

  onStopPreview() {
    this.progress.set(0);
    this.isPlaying.set(false);
    this.currentIndex.set(0);
    this.currentContent.set(null);
    clearTimeout(this.timeoutId);
    clearInterval(this.intervalId);
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

  onUpdateProgress(currentSeconds: number, duration: number) {
    const percent = (currentSeconds / duration) * 100;
    this.progress.set(Math.min(percent, 100));
  }

  get contents() {
    return this.playListForm.get('contents');
  }

  get loop() {
    return this.playListForm.get('loop');
  }
}
