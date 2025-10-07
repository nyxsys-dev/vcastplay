import { computed, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContentState, Playlist } from './playlist';
import { SelectOption } from '../../core/interfaces/general';
import { DesignLayout } from '../design-layout/design-layout';
import { Assets } from '../assets/assets';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private playlistSignal = signal<Playlist[]>([]);
  playlists = computed(() => this.playlistSignal());
  selectedPlaylist = signal<Playlist | null>(null);
  selectedArrPlaylist = signal<Playlist[]>([]);

  first = signal<number>(0);
  rows = signal<number>(8);
  totalRecords = signal<number>(0);

  loadingSignal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  isPlaying = signal<boolean>(false);

  showContents = signal<boolean>(false);
  progress = signal<number>(0);
  
  filteredAssets = signal<Assets[]>([]);
  selectedAssets = signal<Assets[]>([]);
  currentPlaying = signal<Assets | DesignLayout | any>(null);
  
  playlistStatus = signal<SelectOption[]>([
    { label: 'Approved', value: 'approved' },
    { label: 'Disapproved', value: 'disapproved' },
    { label: 'Pending', value: 'pending' },
  ])

  playListTypes = signal<SelectOption[]>([
    { label: 'Manual', value: false },
    { label: 'Auto', value: true },
  ])

  playListForm: FormGroup = new FormGroup({
    id: new FormControl(0),
    name: new FormControl(null, [ Validators.required ]),
    description: new FormControl(null, [ Validators.required ]),
    type: new FormControl('playlist', { nonNullable: true, validators: [ Validators.required ] }),
    transition: new FormGroup({
      hasGap: new FormControl(false),
      type: new FormControl(null),
      speed: new FormControl(5, { nonNullable: true }),
    }),
    contents: new FormControl<any[]>([], { nonNullable: true }),
    status: new FormControl(null),
    loop: new FormControl(false),
    approvedInfo: new FormGroup({
      approvedBy: new FormControl('Admin'),
      approvedOn: new FormControl(new Date()),
      remarks: new FormControl(null),
    }),
    isAuto: new FormControl(false),
    isActive: new FormControl(false),
    duration: new FormControl(0),
    files: new FormControl([], { nonNullable: true }),
  })
  
  playlistFilterForm: FormGroup = new FormGroup({
    dateRange: new FormControl(null),
    status: new FormControl(null),
    isAuto: new FormControl(null),
    keywords: new FormControl(null),
  });

  categoryForm: FormGroup = new FormGroup({
    category: new FormControl(null),
    subCategory: new FormControl(null),
  })

  transitionTypes: any[] = [
    { label: 'Fade', value: 'fade-in', transition: { opacity: true } },
    { label: 'Slide Up', value: 'slide-in', transition: { opacity: true, x: 'translate-y-4', y: 'translate-y-0' } },
    { label: 'Slide Down', value: 'slide-out', transition: { opacity: true, x: '-translate-y-4', y: 'translate-y-0' } },
    { label: 'Slide Left', value: 'slide-left', transition: { opacity: true, x: 'translate-x-4', y: 'translate-x-0' } },
    { label: 'Slide Right', value: 'slide-out', transition: { opacity: true, x: '-translate-x-4', y: 'translate-x-0' } },
  ]

  videoElement = signal<HTMLVideoElement | null>(null);

  activeStep = signal<number>(1);

  totalDuration = (data?: any) => {
    const contents: any[] = data ?? this.contents?.value;
    return contents.reduce((acc: any, item: any) => acc + item.duration, 0);
  }

  // for testing
  private states = new Map<number, ContentState>();
  preloadContents: { [id: string]: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement } = {};

  constructor() { }

  onLoadPlaylist() {
    this.playlistSignal.set([
      {
        "id": 1,
        "status": "pending",
        "name": "Playlist 1",
        "description": "Playlist 1",
        "type": "playlist",
        "transition": {
        "hasGap": false,
        "type": '',
        "speed": 5
        },
        "contents": [
        {
          "id": 2,
          "code": "NYX002",
          "name": "ForBiggerBlazes.mp4",
          "type": "video",
          "link": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "thumbnail": "https://placehold.co/600x400",
          "fileDetails": {
              "name": "ForBiggerBlazes.mp4",
              "size": 2498125,
              "type": "video/mp4",
              "orientation": "landscape",
              "resolution": {
                  "width": 1280,
                  "height": 720
              }
          },
          "duration": 15,
          "audienceTag": {
              "genders": [
                  "Male",
                  "Female"
              ],
              "ageGroups": [],
              "timeOfDays": [],
              "seasonalities": [],
              "locations": [],
              "pointOfInterests": [],
              "tags": []
          },
          "status": "pending",
          "createdOn": "2025-09-11T00:47:04.011Z",
          "updatedOn": "2025-09-11T00:47:04.011Z",
          "contentId": "0199363e-cda6-7372-bc28-5990b288bbd0"
        },
        {
          "id": 1,
          "code": "NYX001",
          "name": "pexels-photo-355465.jpeg",
          "type": "image",
          "link": "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg",
          "thumbnail": "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg",
          "fileDetails": {
              "name": "image (2).png",
              "size": 55782,
              "type": "image/png",
              "orientation": "portrait",
              "resolution": {
                  "width": 326,
                  "height": 195
              }
          },
          "duration": 5,
          "audienceTag": {
              "genders": [
                  "Male",
                  "Female"
              ],
              "ageGroups": [],
              "timeOfDays": [],
              "seasonalities": [],
              "locations": [],
              "pointOfInterests": [],
              "tags": []
          },
          "status": "pending",
          "createdOn": "2025-09-11T00:47:04.011Z",
          "updatedOn": "2025-09-11T00:47:04.011Z",
          "contentId": "0199363e-cfad-7327-b38b-ac2cf83df706"
        }
        ],
        "loop": false,
        "approvedInfo": {
        "approvedBy": "",
        "approvedOn": null,
        "remarks": ""
        },
        "isAuto": false,
        "isActive": false,
        "duration": 20,
        "files": [
        {
          "id": 2,
          "name": "ForBiggerBlazes.mp4",
          "link": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "duration": 15
        },
        {
          "id": 1,
          "name": "pexels-photo-355465.jpeg",
          "link": "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg",
          "duration": 5
        }
        ],
        "createdOn": new Date(),
        "updatedOn": new Date()
        },
        {
        "id": 2,
        "status": "pending",
        "name": "Awesome Playlist",
        "description": "This is another awesome playlist",
        "type": "playlist",
        "transition": {
        "hasGap": false,
        "type": '',
        "speed": 5
        },
        "contents": [
          {
            "id": 3,
            "code": "NYX002",
            "name": "ForBiggerJoyrides.mp4",
            "type": "video",
            "link": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            "thumbnail": "https://placehold.co/600x400",
            "fileDetails": {
                "name": "ForBiggerBlazes.mp4",
                "size": 2498125,
                "type": "video/mp4",
                "orientation": "landscape",
                "resolution": {
                    "width": 1280,
                    "height": 720
                }
            },
            "duration": 15,
            "audienceTag": {
                "genders": [
                    "Male",
                    "Female"
                ],
                "ageGroups": [],
                "timeOfDays": [],
                "seasonalities": [],
                "locations": [],
                "pointOfInterests": [],
                "tags": []
            },
            "status": "pending",
            "createdOn": "2025-09-11T00:47:04.011Z",
            "updatedOn": "2025-09-11T00:47:04.011Z",
            "contentId": "0199363e-fb56-71ef-842a-9b58150ab32d"
          },
          {
            "id": 5,
            "code": "NYX001",
            "name": "1000_F_1310379726_DSfLV5fQQ0lRTGSOF0XshStWGEVSj0DZ.jpg",
            "type": "image",
            "link": "https://as2.ftcdn.net/v2/jpg/13/10/37/97/1000_F_1310379726_DSfLV5fQQ0lRTGSOF0XshStWGEVSj0DZ.jpg",
            "thumbnail": "https://as2.ftcdn.net/v2/jpg/13/10/37/97/1000_F_1310379726_DSfLV5fQQ0lRTGSOF0XshStWGEVSj0DZ.jpg",
            "fileDetails": {
                "name": "image (2).png",
                "size": 55782,
                "type": "image/png",
                "orientation": "portrait",
                "resolution": {
                    "width": 326,
                    "height": 195
                }
            },
            "duration": 8,
            "audienceTag": {
                "genders": [
                    "Male",
                    "Female"
                ],
                "ageGroups": [],
                "timeOfDays": [],
                "seasonalities": [],
                "locations": [],
                "pointOfInterests": [],
                "tags": []
            },
            "status": "pending",
            "createdOn": "2025-09-11T00:47:04.011Z",
            "updatedOn": "2025-09-11T00:47:04.011Z",
            "contentId": "0199363f-014e-75fb-bba7-3655413281d7"
          },
          {
            "id": 4,
            "code": "NYX001",
            "name": "photo-1464822759023-fed622ff2c3b.avif",
            "type": "image",
            "link": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "thumbnail": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "fileDetails": {
                "name": "image (2).png",
                "size": 55782,
                "type": "image/png",
                "orientation": "portrait",
                "resolution": {
                    "width": 326,
                    "height": 195
                }
            },
            "duration": 10,
            "audienceTag": {
                "genders": [
                    "Male",
                    "Female"
                ],
                "ageGroups": [],
                "timeOfDays": [],
                "seasonalities": [],
                "locations": [],
                "pointOfInterests": [],
                "tags": []
            },
            "status": "pending",
            "createdOn": "2025-09-11T00:47:04.011Z",
            "updatedOn": "2025-09-11T00:47:04.011Z",
            "contentId": "0199363f-034e-7030-9bd5-eab5a2a33617"
          }
        ],
        "loop": false,
        "approvedInfo": {
          "approvedBy": "",
          "approvedOn": null,
          "remarks": ""
        },
        "isAuto": false,
        "isActive": false,
        "duration": 33,
        "files": [
          {
            "id": 3,
            "name": "ForBiggerJoyrides.mp4",
            "link": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            "duration": 15
          },
          {
            "id": 5,
            "name": "1000_F_1310379726_DSfLV5fQQ0lRTGSOF0XshStWGEVSj0DZ.jpg",
            "link": "https://as2.ftcdn.net/v2/jpg/13/10/37/97/1000_F_1310379726_DSfLV5fQQ0lRTGSOF0XshStWGEVSj0DZ.jpg",
            "duration": 8
          },
          {
            "id": 4,
            "name": "photo-1464822759023-fed622ff2c3b.avif",
            "link": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "duration": 10
          }
        ],
        "createdOn": new Date(),
        "updatedOn": new Date()
      }
    ])
    this.totalRecords.set(this.playlists().length);
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

  onSaveAssetToPlaylist(asset: Assets, playlist: Playlist[]) {
    playlist.forEach(item => {
      const tempData = item.contents;
      const assetItem = item.contents.find(item => item.id === asset.id);
      if (!assetItem) {
        item.contents = [...tempData, asset];
        this.onSavePlaylist(item);
      };
    })    
  }

  onSavePlaylist(playlist: Playlist) {
    const tempData = this.playlists();
    const { id, status, ...info } = playlist;
    const index = tempData.findIndex(item => item.id === playlist.id);

    if (index !== -1) tempData[index] = { ...playlist, updatedOn: new Date() };
    else tempData.push({ id: tempData.length + 1, status: 'pending', ...info, 
      createdOn: new Date(), updatedOn: new Date(), approvedInfo: { approvedBy: '', approvedOn: null, remarks: '' } });
    
    this.playlistSignal.set([...tempData]); 

    this.totalRecords.set(this.playlists().length);
    console.log(this.playlists());
    
    /**CALL POST API */
  }

  onDeletePlaylist(playlist: Playlist) {
    const tempData = this.playlists().filter(item => item.id !== playlist.id);
    this.playlistSignal.set([...tempData]);
    
    this.totalRecords.set(this.playlists().length);
    /**CALL DELETE API */
  }

  onDuplicatePlaylist(playlist: Playlist) {
    const tempData = this.playlists();
    tempData.push({ ...playlist, id: tempData.length + 1, name: `Copy of ${playlist.name}`, status: 'pending', 
      createdOn: new Date(), updatedOn: new Date(), approvedInfo: { approvedBy: '', approvedOn: null, remarks: '' } });
    this.playlistSignal.set([...tempData]);
    
    this.totalRecords.set(this.playlists().length);
    /**CALL POST API */
  }

  onApprovePlaylist(playlist: Playlist, status: string) {
    const tempData = this.playlists();
    const index = tempData.findIndex(item => item.id == playlist.id);
    tempData[index] = { ...playlist, status, updatedOn: new Date() };    
    this.playlistSignal.set([...tempData]);
    
    this.totalRecords.set(this.playlists().length);
    /**CALL POST API */
  }

  onGetContentSchedule(content: Assets) {
    const { dateRange, weekdays, hours } = content;
    console.log({
      dateRange,
      weekdays,
      hours
    });
  }
  
  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

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

  onPlayContent(playlist: Playlist) {    
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
      const item = contents[state.index];
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
          this.videoElement()?.play();
          this.onTriggerIntervals(state, duration);
          break;
        case 'playlist':
          setTimeout(() => this.onPlayContent(item), 0);
          break;
      }

      this.currentPlaying.set(item);
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
              console.log('Playlist completed');

              // Clear content
              state.currentContent.set(null);
              this.onStopContent(playlist.id);
              return;
            }
            state.index++;
          }
          
          // state.fadeIn.set(true);
          // state.currentContent.set(contents[state.index]);
          playNextContent();
        }, gapDuration);

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
    this.currentPlaying.set(null);
  }

  onStopAllContents() {
    this.states.forEach((state, id) => {
      this.onStopContent(id);
    });

    this.isPlaying.set(false);
    this.currentPlaying.set(null);
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

  get contents() { return this.playListForm.get('contents'); }
  get files() { return this.playListForm.get('files'); }
  get loop() { return this.playListForm.get('loop'); }
  get transition() { return this.playListForm.get('transition'); }
}
