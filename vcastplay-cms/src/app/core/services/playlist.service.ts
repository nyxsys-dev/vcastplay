import { computed, inject, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assets } from '../interfaces/assets';
import { Playlist } from '../interfaces/playlist';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private playlistSignal = signal<Playlist[]>([]);
  playlists = computed(() => this.playlistSignal());
  selectedPlaylist = signal<Playlist | null>(null);

  loadingSignal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  currentIndex = signal<number>(0);
  currentContent = signal<Assets | null>(null);
  currentTransition = signal<any>(null);
  duration = signal<number>(3000);
  isPlaying = signal<boolean>(false);
  fadeIn = signal<boolean>(false);
  isLooping = signal<boolean>(false);
  progress = signal<number>(0);
  timeoutId: any;
  intervalId: any;
  gapTimeout: any;

  playListForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [ Validators.required ]),
    description: new FormControl('', [ Validators.required ]),
    transition: new FormGroup({
      hasGap: new FormControl(false),
      type: new FormControl(null),
      speed: new FormControl(5, { nonNullable: true }),
    }),
    contents: new FormControl<Assets[]>([], { nonNullable: true, validators: [ Validators.required ] }),
    status: new FormControl(''),
    loop: new FormControl(false),
  })

  transitionTypes: any[] = [
    { label: 'Fade', value: 'fade-in', transition: { opacity: true } },
    { label: 'Slide Up', value: 'slide-in', transition: { opacity: true, x: 'translate-y-4', y: 'translate-y-0' } },
    { label: 'Slide Down', value: 'slide-out', transition: { opacity: true, x: '-translate-y-4', y: 'translate-y-0' } },
    { label: 'Slide Left', value: 'slide-in', transition: { opacity: true, x: 'translate-x-4', y: 'translate-x-0' } },
    { label: 'Slide Right', value: 'slide-out', transition: { opacity: true, x: '-translate-x-4', y: 'translate-x-0' } },
  ]

  videoElement = signal<HTMLVideoElement | null>(null);

  activeStep = signal<number>(1);

  constructor() { }

  onPlayPreview(index: number = 0) {
    const contents = this.contents?.value;
    const { hasGap, type, speed } = this.transition?.value;
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
      const isLooping = this.loop?.value;
      
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
        this.onGetContentSchedule(contents[this.currentIndex()])

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

  onUpdateProgress(currentSeconds: number, duration: number) {
    const percent = (currentSeconds / duration) * 100;
    this.progress.set(Math.min(percent, 100));
  }

  onGetContentSchedule(content: Assets) {
    const { dateRange, weekdays, hours } = content;
    console.log({
      dateRange,
      weekdays,
      hours
    });
  }

  onLoadPlaylist() {
    /**CALL GET API */
  }

  onGetPlaylists() {
    if (this.playlistSignal().length === 0) this.onLoadPlaylist();
    return this.playlistSignal();
  }

  onRefreshPlaylist() {
    this.playlistSignal.set([]);
    this.onLoadPlaylist(); 
  }

  onSavePlaylist(playlist: Playlist) {
    const tempData = this.playlists();
    const { id, status, ...info } = playlist;
    const index = tempData.findIndex(item => item.id === playlist.id);

    if (index !== -1) tempData[index] = playlist;
    else tempData.push({ id: tempData.length + 1, status: 'Pending', ...info, createdOn: new Date(), updatedOn: new Date() });

    this.playlistSignal.set([...tempData]);
    /**CALL POST API */
  }

  onDeletePlaylist(playlist: Playlist) {
    const tempData = this.playlists().filter(item => item.id !== playlist.id);
    this.playlistSignal.set([...tempData]);
    /**CALL DELETE API */
  }

  onDuplicatePlaylist(playlist: Playlist) {
    const tempData = this.playlists();
    tempData.push({ ...playlist, id: tempData.length + 1, name: `Copy of ${playlist.name}`, status: 'Pending', createdOn: new Date(), updatedOn: new Date() });
    this.playlistSignal.set([...tempData]);
    /**CALL POST API */
  }

  get contents() {
    return this.playListForm.get('contents');
  }

  get loop() {
    return this.playListForm.get('loop');
  }

  get transition() {
    return this.playListForm.get('transition');
  }
}
