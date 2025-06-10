import { computed, Injectable, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AssestInfo, Assets, AssetType } from '../interfaces/assets';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  private assetSignal = signal<Assets[]>([]);
  assets = computed(() => this.assetSignal());

  selectedAsset = signal<Assets | null>(null);

  loadingSignal = signal<boolean>(false);

  assetType = signal<AssetType[]>([
    { label: 'Audio', value: 'audio' },
    { label: 'Images', value: 'image' },
    { label: 'Web Pages', value: 'web' },
    { label: 'Videos', value: 'video' },
    { label: 'Widgets', value: 'widget' },
  ])


  assetForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl('', [ Validators.required ]),
    type: new FormControl(''),
    link: new FormControl(''),
    file: new FormControl(null),
    category: new FormControl(''),
    subCategory: new FormControl(''),
    fileDetails: new FormGroup({
      size: new FormControl(null),
      type: new FormControl(null),
      orientation: new FormControl(null),
      resolution: new FormControl(null),
    }),
    audienceTag: new FormControl(''),
    availability: new FormControl(''),
    dateRange: new FormGroup({
      start: new FormControl(''),
      end: new FormControl(''),
    }),
    hours: new FormControl([], [ Validators.required ]),
  })

  constructor() { }

  onLoadAssets() {
    /** Get API */
    this.loadingSignal.set(true);
    this.assetSignal.set([
    {
      id: 1,
      code: "VID001",
      name: "Intro Video",
      type: "video",
      link: "assets/vcastplay-filler.mp4",
      file: "intro.mp4",
      category: "Media",
      subCategory: "Promotional",
      fileDetails: {
        orientation: "landscape",
        resolution: "1920x1080",
        size: "15MB",
        type: "mp4"
      },
      audienceTag: "General",
      availability: "public",
      dateRange: {
        start: "2025-06-01",
        end: "2025-12-31"
      },
      hours: ["08:00", "12:00", "16:00"],
      duration: 10
    },
    {
      id: 2,
      code: "AUD001",
      name: "Background Music",
      type: "audio",
      link: "/assets/audio/background.mp3",
      file: "background.mp3",
      category: "Sound",
      subCategory: "Music",
      fileDetails: {
        orientation: "n/a",
        resolution: "n/a",
        size: "3MB",
        type: "mp3"
      },
      availability: "public",
      dateRange: {
        start: "2025-06-01",
        end: "2025-12-31"
      },
      hours: ["00:00", "23:59"],
      duration: 5
    },
    {
      id: 3,
      code: "IMG001",
      name: "Title Slide",
      type: "image",
      link: "/assets/vcastplay-image-filler.png",
      file: "title.png",
      category: "Graphics",
      subCategory: "Slide",
      fileDetails: {
        orientation: "landscape",
        resolution: "1280x720",
        size: "2MB",
        type: "png"
      },
      availability: "private",
      dateRange: {
        start: "2025-07-01",
        end: "2025-12-31"
      },
      hours: ["09:00", "17:00"],
      duration: 10
    },
    {
      id: 4,
      code: "AUD002",
      name: "Voice Over",
      type: "audio",
      link: "/assets/audio/voice.mp3",
      file: "voice.mp3",
      category: "Sound",
      subCategory: "Narration",
      fileDetails: {
        orientation: "n/a",
        resolution: "n/a",
        size: "5MB",
        type: "mp3"
      },
      availability: "public",
      dateRange: {
        start: "2025-06-15",
        end: "2025-10-01"
      },
      hours: ["10:00", "14:00"],
      duration: 5
    },
    {
      id: 5,
      code: "VID002",
      name: "Main Scene",
      type: "video",
      link: "https://www.w3schools.com/tags/mov_bbb.mp4",
      file: "main.mp4",
      category: "Media",
      subCategory: "Content",
      fileDetails: {
        orientation: "landscape",
        resolution: "1920x1080",
        size: "50MB",
        type: "mp4"
      },
      audienceTag: "Teens",
      availability: "private",
      dateRange: {
        start: "2025-08-01",
        end: "2025-12-31"
      },
      hours: ["13:00", "15:00", "18:00"],
      duration: 10
    },
    {
      id: 6,
      code: "IMG002",
      name: "End Card",
      type: "image",
      link: "assets/vcastplay-image-filler.png",
      file: "endcard.jpg",
      category: "Graphics",
      subCategory: "Outro",
      fileDetails: {
        orientation: "portrait",
        resolution: "1080x1920",
        size: "1MB",
        type: "jpg"
      },
      availability: "public",
      dateRange: {
        start: "2025-06-10",
        end: "2025-12-31"
      },
      hours: ["07:00", "21:00"],
      duration: 5
    },
    {
      id: 7,
      code: "AUD003",
      name: "Ding Sound",
      type: "audio",
      link: "/assets/audio/ding.mp3",
      file: "ding.mp3",
      category: "Sound",
      subCategory: "Effect",
      fileDetails: {
        orientation: "n/a",
        resolution: "n/a",
        size: "0.5MB",
        type: "mp3"
      },
      availability: "public",
      dateRange: {
        start: "2025-06-01",
        end: "2025-12-31"
      },
      hours: ["00:00", "23:59"],
      duration: 3
    },
    {
      id: 8,
      code: "VID003",
      name: "Transition Clip",
      type: "video",
      link: "assets/vcastplay-filler.mp4",
      file: "transition.mp4",
      category: "Media",
      subCategory: "Effect",
      fileDetails: {
        orientation: "landscape",
        resolution: "1280x720",
        size: "8MB",
        type: "mp4"
      },
      availability: "private",
      dateRange: {
        start: "2025-06-05",
        end: "2025-12-31"
      },
      hours: ["12:00", "14:00"],
      duration: 10
    },
    {
      id: 9,
      code: "TXT001",
      name: "Lower Third Text",
      type: "text",
      link: "assets/text/lower-third.json",
      file: "lower-third.json",
      category: "Text",
      subCategory: "Overlay",
      fileDetails: {
        orientation: "n/a",
        resolution: "n/a",
        size: "0.1MB",
        type: "json"
      },
      availability: "public",
      dateRange: {
        start: "2025-06-01",
        end: "2025-12-31"
      },
      hours: ["08:00", "18:00"],
      duration: 5
    },
    {
      id: 10,
      code: "TXT002",
      name: "Subtitles",
      type: "text",
      link: "assets/text/subtitles.vtt",
      file: "subtitles.vtt",
      category: "Text",
      subCategory: "Caption",
      fileDetails: {
        orientation: "n/a",
        resolution: "n/a",
        size: "0.2MB",
        type: "vtt"
      },
      availability: "public",
      dateRange: {
        start: "2025-06-01",
        end: "2025-12-31"
      },
      hours: ["00:00", "23:59"],
      duration: 5
    },
    {
      id: 11,
      code: "WEB002",
      name: "Web Page",
      type: "web",
      link: "https://pub.movingwalls.com/sdk/IconicLCGC.html",
      file: "n/a",
      category: "Category 1",
      subCategory: "Sub Category 1",
      fileDetails: {
        orientation: "n/a",
        resolution: "n/a",
        size: "n/a",
        type: "n/a"
      },
      availability: "public",
      dateRange: {
        start: "2025-06-01",
        end: "2025-12-31"
      },
      hours: ["00:00", "23:59"],
      duration: 15
    }
    ]);
    this.loadingSignal.set(false);
  }

  onGetAssets() {
    if (this.assetSignal().length === 0) this.onLoadAssets();
    return this.assetSignal();
  }

  onRefreshRoles() {
    this.assetSignal.set([]);
    this.onLoadAssets();
  }

  getImageOrientationAndResolution(file: File): Promise<AssestInfo> {
    return new Promise((resolve, reject) => {
      const img: any = new Image();
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (!e.target || !e.target.result) {
          reject(new Error('Failed to read file'));
          return;
        }

        if (file.type.includes('image')) {
          img.onload = () => {
            const width = img.width;
            const height = img.height;
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              orientation: width > height ? 'landscape' : height > width ? 'portrait' : 'square',
              resolution: { width, height },
            })
          };
        
          img.onerror = reject;
          img.src = e.target.result as string;

        } else if (file.type.includes('video')) {          
          const video: any = document.createElement('video');
          video.preload = 'metadata'; // Load metadata only

          video.onloadedmetadata = () => {
            const width = video.videoWidth;
            const height = video.videoHeight;
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              orientation: width > height ? 'landscape' : height > width ? 'portrait' : 'square',
              resolution: { width, height },
            });
          };
          video.onerror = () => reject(new Error('Failed to load video metadata for dimension/duration extraction.'));
          video.src = e.target.result;
        }
      };

      reader.onerror = () => reject(new Error('FileReader error during file read.'));
      reader.readAsDataURL(file);
    })
  }
}
