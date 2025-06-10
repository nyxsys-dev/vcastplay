import { Injectable, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Assets } from '../interfaces/assets';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  timeoutId: any;
  currentIndex = signal<number>(0);
  currentContent = signal<Assets | null>(null);
  duration = signal<number>(3000); // default 3 seconds per content
  isPlaying = signal<boolean>(false);

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
  })

  constructor() { }

  onPlayPreview(index: number = 0) {
    this.isPlaying.set(true);
    const contents = this.contents?.value;

    if (contents.length === 0) return;

    const item = contents[this.currentIndex()];
    this.currentContent.set(item);
    this.progress.set(0);

    this.timeoutId = setTimeout(() => {

      if (index + 1 >= contents.length) {
        this.onStopPreview();
        return;
      }

      this.currentIndex.set(this.currentIndex() + 1);
      // this.currentIndex.set(this.currentIndex() + 1 % contents.length); for looping
      this.currentContent.set(contents[this.currentIndex()]);
      this.onPlayPreview(this.currentIndex());
    }, item.duration + 1000); // added 1 sec for complete transition
  }

  onStopPreview() {
    this.progress.set(0);
    this.isPlaying.set(false);
    this.currentIndex.set(0);
    this.currentContent.set(null);
    clearTimeout(this.timeoutId);
  }

  updateProgress(currentSeconds: number, duration: number) {
    const percent = (currentSeconds / duration) * 100;    
    this.progress.set(Math.min(percent, 100));
  }

  get contents() {
    return this.playListForm.get('contents');
  }
}
