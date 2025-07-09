import { computed, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Assets } from '../interfaces/assets';
import { Playlist } from '../interfaces/playlist';
import { SelectOption } from '../interfaces/general';

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

  currentIndex = signal<number>(0);
  currentContent = signal<any | null>(null);
  currentTransition = signal<any>(null);
  duration = signal<number>(3000);
  isPlaying = signal<boolean>(false);
  fadeIn = signal<boolean>(false);
  isLooping = signal<boolean>(false);
  showContents = signal<boolean>(false);
  progress = signal<number>(0);
  
  filteredAssets = signal<Assets[]>([]);
  selectedAssets = signal<Assets[]>([]);
  
  playlistStatus = signal<SelectOption[]>([
    { label: 'Approved', value: 'approved' },
    { label: 'Disapproved', value: 'disapproved' },
    { label: 'Pending', value: 'pending' },
  ])

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
    contents: new FormControl<any[]>([], { nonNullable: true, validators: [ Validators.required ] }),
    status: new FormControl(''),
    loop: new FormControl(false),
    approvedInfo: new FormGroup({
      approvedBy: new FormControl('Admin'),
      approvedOn: new FormControl(new Date()),
      remarks: new FormControl(''),
    }),
    isAuto: new FormControl(false),
    duration: new FormControl(0),
  })
  
  playlistFilterForm: FormGroup = new FormGroup({
    status: new FormControl(null),
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
    { label: 'Slide Left', value: 'slide-in', transition: { opacity: true, x: 'translate-x-4', y: 'translate-x-0' } },
    { label: 'Slide Right', value: 'slide-out', transition: { opacity: true, x: '-translate-x-4', y: 'translate-x-0' } },
  ]

  videoElement = signal<HTMLVideoElement | null>(null);

  activeStep = signal<number>(1);

  totalDuration = (data?: any) => {
    const contents: any[] = data ?? this.contents?.value;
    return contents.reduce((acc: any, item: any) => acc + item.duration, 0);
  }

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
  
  
  onTimeUpdate(event: any) {    
    const { currentTime, duration } = event;
    this.onUpdateProgress(currentTime, duration);
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
  
  getTransitionClasses() {
    const { type } = this.currentTransition() ?? '';
    const fadeIn = this.fadeIn();    
    return {
      'transition-all duration-500 ease-in-out': true,
      'w-full h-full flex justify-center items-center': true,
      [`${type?.opacity ? 'opacity-0' : ''} ${type?.x ?? ''}`]: !fadeIn,
      [`${type?.opacity ? 'opacity-100' : ''} ${type?.y ?? ''}`]: fadeIn
    };
  }
  
  onPageChange(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
  }

  onLoadPlaylist() {
    this.playlistSignal.set([
      {
        id: 1,
        name: 'New Playlist',
        description: 'This is a sample description of a new playlist',
        transition: {
          hasGap: false,
          type: '',
          speed: 5
        },
        contents: [
          {
            contentId: 1,
            id: 1,
            code: 'NYX001',
            name: 'image (2).png',
            type: 'image',
            link: 'https://picsum.photos/id/237/200/300',
            category: 'Category 1',
            subCategory: 'Sub-Category 1',
            fileDetails: {
              name: 'image (2).png',
              size: 55782,
              type: 'image/png',
              orientation: 'landscape',
              resolution: {
                width: 326,
                height: 195
              },
              thumbnail: 'https://picsum.photos/id/237/200/300'
            },
            dateRange: {
              start: null,
              end: null
            },
            weekdays: [],
            hours: [],
            duration: 5,
            audienceTag: {
              genders: [ 'Male' ],
              ageGroups: [],
              timeOfDays: [],
              seasonalities: [],
              locations: [],
              pointOfInterests: [],
              tags: []
            },
            status: 'Pending',
            createdOn: new Date(),
            updatedOn: new Date()
          }
        ],
        status: 'pending',
        loop: false,
        duration: 5,
        createdOn: new Date(),
        updatedOn: new Date()
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
    else tempData.push({ id: tempData.length + 1, status: 'pending', ...info, createdOn: new Date(), updatedOn: new Date() });
    
    this.playlistSignal.set([...tempData]); 

    this.totalRecords.set(this.playlists().length);
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
    tempData.push({ ...playlist, id: tempData.length + 1, name: `Copy of ${playlist.name}`, status: 'pending', createdOn: new Date(), updatedOn: new Date() });
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

  get contents() { return this.playListForm.get('contents'); }
  get loop() { return this.playListForm.get('loop'); }
  get transition() { return this.playListForm.get('transition'); }
}
