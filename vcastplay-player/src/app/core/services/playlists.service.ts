import { inject, Injectable, signal } from '@angular/core';
import { ContentState, Playlists } from '../interfaces/playlist';
import { environment } from '../../../environments/environment.development';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {

  platform = inject(PlatformService);
  
  private states = new Map<number, ContentState>();
  private videoElement = signal<HTMLVideoElement | null>(null);
  
  isPlaying = signal<boolean>(false);

  desktopFilePath: string = environment.desktopFilePath;
  androidFilePath: string = environment.androidFilePath;

  constructor() { }

  /**
   * ======================================================
   * Start Play Playlist
   * ======================================================
  */
  
  private registerContent(id: number) {
    if (!this.states.has(id)) {
      this.states.set(id, { 
        index: 0, 
        currentContent: signal<any>(null), 
        isPlaying: signal<boolean>(false), 
        fadeIn: signal<boolean>(false),
        progress: signal<number>(0),
        currentTransition: signal<any>(null)
      });
    }
  }

  onPlayContent(playlist: Playlists | any) {
    const platform: string = this.platform.platform;
    this.isPlaying.set(true);

    // Register state for this playlist only
    this.registerContent(playlist.id);
    const contents = playlist.contents;  
    if (contents.length === 0) return;

    const state = this.states.get(playlist.id)!;
    
    // Only reset this playlist, not others
    clearTimeout(state.timeoutId);
    clearTimeout(state.gapTimeout);

    state.isPlaying.set(false);
    state.progress.set(0);
    state.fadeIn.set(false);
    
    // this.onStopContent(playlist.id);

    const playNextContent = () => {
      let tempItem: any;
      
      const { link, ...content } = contents[state.index];

      switch (platform) {
        case 'desktop':
          tempItem = { link: `${this.desktopFilePath}${content.name}` , ...content};
          break;
        case 'android':
          tempItem = { link: `${this.androidFilePath}${content.name}` , ...content};
          break;
        default:
          tempItem = contents[state.index];
          break;
      }

      const item = tempItem;

      const { hasGap, type, speed } = playlist.transition;
      const transitionSpeed = speed * 100;
      const gapDuration = hasGap ? 500 : 0;

      state.currentTransition.set({ type, speed: transitionSpeed });   
      state.isPlaying.set(true);
      state.progress.set(0);
      state.fadeIn.set(true);
      state.currentContent.set(item);

      const duration = item.duration * 1000;

      switch(item.type) {
        case 'image':
        case 'audio':
        case 'text':
        case 'web':
          this.onTriggerIntervals(state, duration);
          break;
        case 'design':
          this.onTriggerIntervals(state, duration);
          break;
        case 'video':
          // this.videoElement().currentTime = 0;
          // this.videoElement()?.play();
          this.onTriggerIntervals(state, duration);
          break;
        case 'playlist':
          setTimeout(() => this.onPlayContent(item), 0);
          break;
      }

      console.log("Current Playing:", item.name);
      
      state.timeoutId = setTimeout(() => {

        const nextIndex = (state.index + 1) % contents.length; // Loop back to 0 after last item
        const isLooping = playlist.loop;
        
        // Trigger fade-in again for next content
        state.fadeIn.set(false);

        // Clear content
        state.currentContent.set(null);

        // If there is a gap, wait for the gap duration before playing the next content
        state.gapTimeout = setTimeout(() => {
          if (isLooping) {
            state.index = nextIndex;
          } else {
            if (state.index + 1 >= contents.length) {
              // Clear content
              state.currentContent.set(null);
              this.onStopContent(playlist.id);
              return;
            }
            state.index++;
          }
          playNextContent();
        }, gapDuration + 80);

      }, duration);
    }

    playNextContent();
  }

  /** Stop Playback */
  onStopContent(id: number) {
    const state = this.states.get(id)!;
    if (!state) return;
    
    state.index = 0;
    state.isPlaying.set(false);
    state.currentContent.set(null);
    state.fadeIn.set(false);
    state.currentTransition.set(null);
    state.progress.set(0);

    clearTimeout(state.timeoutId ?? undefined);
    clearTimeout(state.gapTimeout ?? undefined);
    clearInterval(state.intervalId ?? undefined);

    state.timeoutId = undefined;
    state.gapTimeout = undefined;
    state.intervalId = undefined;

    this.isPlaying.set(false);
  }

  onStopAllContents() {
    this.states.forEach((state, id) => {
      this.onStopContent(id);
    });

    this.isPlaying.set(false);
  }

  /** Expose current content signal */
  onGetCurrentContent(id: number) {
    const state = this.states.get(id);
    return state ? signal<any>(state) : signal<any>(null);
  }

  onTriggerIntervals(state: ContentState, duration: number) {
    let startTime = Date.now();
    state.intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      state.progress.set(Math.min((elapsed / duration) * 100, 100));

      if (elapsed >= duration) {
        state.progress.set(100);
        clearInterval(state.intervalId);
      }
    }, 500);
  }

  onProgressUpdate(id: number, event: any) {
    const { currentTime, duration } = event;
    const percent = (currentTime / duration) * 100;
    const state = this.states.get(id)!;
    state.progress.set(Math.min(percent, 100));
  }

  /**
   * ======================================================
   * End Play Playlist
   * ======================================================
  */
}
