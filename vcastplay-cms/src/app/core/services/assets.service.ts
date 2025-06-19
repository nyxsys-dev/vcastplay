import { computed, Injectable, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AssestInfo, Assets, AssetType } from '../interfaces/assets';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  private assetSignal = signal<Assets[]>([]);
  assets = computed(() => this.assetSignal());

  selectedAsset = signal<Assets | null>(null);

  loadingSignal = signal<boolean>(false);
  isEditMode = signal<boolean>(false);

  assetType = signal<AssetType[]>([
    { label: 'File', value: 'file' },
    { label: 'Web Pages', value: 'web' },
    { label: 'Widgets', value: 'widget' },
  ]);

  assetTypeControl: FormControl = new FormControl('file');
  
  assetViewModeSignal = signal<string>('Grid');
  assetViewModeCtrl: FormControl = new FormControl('Grid');
  assetViewModes = [
    { icon: 'pi pi-table', label: 'Grid' },
    { icon: 'pi pi-list', label: 'List' },
  ]

  categories: any[] = [
    { label: 'Category 1', value: 'Category 1', subCategory: [{ label: 'Sub-Category 1', value: 'Sub-Category 1' }] },
    { label: 'Category 2', value: 'Category 2', subCategory: [{ label: 'Sub-Category 2', value: 'Sub-Category 2' }] },
  ]
  
  filterCategory = computed(() => this.categories.map(category => ({ label: category.label, value: category.value })));
  filterSubCategory = computed(() => this.categories.map(category => category.subCategory).flat().map(subCategory => ({ label: subCategory.label, value: subCategory.value })));

  assetForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl('', [ Validators.required ]),
    type: new FormControl(''),
    link: new FormControl(''),
    category: new FormControl(null, [ Validators.required ]),
    subCategory: new FormControl(null, [ Validators.required ]),
    fileDetails: new FormGroup<AssestInfo | any>({
      size: new FormControl(null),
      type: new FormControl(null),
      orientation: new FormControl(null),
      resolution: new FormControl(null),
      thumbnail: new FormControl(null),
    }),
    audienceTag: new FormControl(null),
    availability: new FormControl<boolean>(false),
    dateRange: new FormGroup({
      start: new FormControl(null),
      end: new FormControl(null),
    }, { validators: [ this.dateRangeValidator()]}),
    weekdays: new FormControl([], { nonNullable: true }),
    hours: new FormControl<[{ start: string, end: string }] | []>([], { nonNullable: true }),
    duration: new FormControl(5, { nonNullable: true }),
  })

  constructor() { }

  onLoadAssets() {
    /** Get API */
    // this.loadingSignal.set(true);
    // this.assetSignal.set([
    // {
    //   id: 1,
    //   code: "VID001",
    //   name: "Intro Video",
    //   type: "video",
    //   link: "assets/vcastplay-filler.mp4",
    //   file: "intro.mp4",
    //   category: "Media",
    //   subCategory: "Promotional",
    //   fileDetails: {
    //     orientation: "landscape",
    //     resolution: "1920x1080",
    //     size: "15MB",
    //     type: "mp4"
    //   },
    //   audienceTag: "General",
    //   availability: "public",
    //   dateRange: {
    //     start: "2025-06-01",
    //     end: "2025-12-31"
    //   },
    //   hours: ["08:00", "12:00", "16:00"],
    //   duration: 10
    // },
    // {
    //   id: 2,
    //   code: "AUD001",
    //   name: "Background Music",
    //   type: "audio",
    //   link: "/assets/audio/background.mp3",
    //   file: "background.mp3",
    //   category: "Sound",
    //   subCategory: "Music",
    //   fileDetails: {
    //     orientation: "n/a",
    //     resolution: "n/a",
    //     size: "3MB",
    //     type: "mp3"
    //   },
    //   availability: "public",
    //   dateRange: {
    //     start: "2025-06-01",
    //     end: "2025-12-31"
    //   },
    //   hours: ["00:00", "23:59"],
    //   duration: 5
    // },
    // {
    //   id: 3,
    //   code: "IMG001",
    //   name: "Title Slide",
    //   type: "image",
    //   link: "/assets/vcastplay-image-filler.png",
    //   file: "title.png",
    //   category: "Graphics",
    //   subCategory: "Slide",
    //   fileDetails: {
    //     orientation: "landscape",
    //     resolution: "1280x720",
    //     size: "2MB",
    //     type: "png"
    //   },
    //   availability: "private",
    //   dateRange: {
    //     start: "2025-07-01",
    //     end: "2025-12-31"
    //   },
    //   hours: ["09:00", "17:00"],
    //   duration: 10
    // },
    // {
    //   id: 4,
    //   code: "AUD002",
    //   name: "Voice Over",
    //   type: "audio",
    //   link: "/assets/audio/voice.mp3",
    //   file: "voice.mp3",
    //   category: "Sound",
    //   subCategory: "Narration",
    //   fileDetails: {
    //     orientation: "n/a",
    //     resolution: "n/a",
    //     size: "5MB",
    //     type: "mp3"
    //   },
    //   availability: "public",
    //   dateRange: {
    //     start: "2025-06-15",
    //     end: "2025-10-01"
    //   },
    //   hours: ["10:00", "14:00"],
    //   duration: 5
    // },
    // {
    //   id: 5,
    //   code: "VID002",
    //   name: "Main Scene",
    //   type: "video",
    //   link: "https://www.w3schools.com/tags/mov_bbb.mp4",
    //   file: "main.mp4",
    //   category: "Media",
    //   subCategory: "Content",
    //   fileDetails: {
    //     orientation: "landscape",
    //     resolution: "1920x1080",
    //     size: "50MB",
    //     type: "mp4"
    //   },
    //   audienceTag: "Teens",
    //   availability: "private",
    //   dateRange: {
    //     start: "2025-08-01",
    //     end: "2025-12-31"
    //   },
    //   hours: ["13:00", "15:00", "18:00"],
    //   duration: 10
    // },
    // {
    //   id: 6,
    //   code: "IMG002",
    //   name: "End Card",
    //   type: "image",
    //   link: "assets/vcastplay-image-filler.png",
    //   file: "endcard.jpg",
    //   category: "Graphics",
    //   subCategory: "Outro",
    //   fileDetails: {
    //     orientation: "portrait",
    //     resolution: "1080x1920",
    //     size: "1MB",
    //     type: "jpg"
    //   },
    //   availability: "public",
    //   dateRange: {
    //     start: "2025-06-10",
    //     end: "2025-12-31"
    //   },
    //   hours: ["07:00", "21:00"],
    //   duration: 5
    // },
    // {
    //   id: 7,
    //   code: "AUD003",
    //   name: "Ding Sound",
    //   type: "audio",
    //   link: "/assets/audio/ding.mp3",
    //   file: "ding.mp3",
    //   category: "Sound",
    //   subCategory: "Effect",
    //   fileDetails: {
    //     orientation: "n/a",
    //     resolution: "n/a",
    //     size: "0.5MB",
    //     type: "mp3"
    //   },
    //   availability: "public",
    //   dateRange: {
    //     start: "2025-06-01",
    //     end: "2025-12-31"
    //   },
    //   hours: ["00:00", "23:59"],
    //   duration: 3
    // },
    // {
    //   id: 8,
    //   code: "VID003",
    //   name: "Transition Clip",
    //   type: "video",
    //   link: "assets/vcastplay-filler.mp4",
    //   file: "transition.mp4",
    //   category: "Media",
    //   subCategory: "Effect",
    //   fileDetails: {
    //     orientation: "landscape",
    //     resolution: "1280x720",
    //     size: "8MB",
    //     type: "mp4"
    //   },
    //   availability: "private",
    //   dateRange: {
    //     start: "2025-06-05",
    //     end: "2025-12-31"
    //   },
    //   hours: ["12:00", "14:00"],
    //   duration: 10
    // },
    // {
    //   id: 9,
    //   code: "TXT001",
    //   name: "Lower Third Text",
    //   type: "text",
    //   link: "assets/text/lower-third.json",
    //   file: "lower-third.json",
    //   category: "Text",
    //   subCategory: "Overlay",
    //   fileDetails: {
    //     orientation: "n/a",
    //     resolution: "n/a",
    //     size: "0.1MB",
    //     type: "json"
    //   },
    //   availability: "public",
    //   dateRange: {
    //     start: "2025-06-01",
    //     end: "2025-12-31"
    //   },
    //   hours: ["08:00", "18:00"],
    //   duration: 5
    // },
    // {
    //   id: 10,
    //   code: "TXT002",
    //   name: "Subtitles",
    //   type: "text",
    //   link: "assets/text/subtitles.vtt",
    //   file: "subtitles.vtt",
    //   category: "Text",
    //   subCategory: "Caption",
    //   fileDetails: {
    //     orientation: "n/a",
    //     resolution: "n/a",
    //     size: "0.2MB",
    //     type: "vtt"
    //   },
    //   availability: "public",
    //   dateRange: {
    //     start: "2025-06-01",
    //     end: "2025-12-31"
    //   },
    //   hours: ["00:00", "23:59"],
    //   duration: 5
    // },
    // {
    //   id: 11,
    //   code: "WEB002",
    //   name: "Web Page",
    //   type: "web",
    //   link: "https://pub.movingwalls.com/sdk/IconicLCGC.html",
    //   file: "n/a",
    //   category: "Category 1",
    //   subCategory: "Sub Category 1",
    //   fileDetails: {
    //     orientation: "n/a",
    //     resolution: "n/a",
    //     size: "n/a",
    //     type: "n/a"
    //   },
    //   availability: "public",
    //   dateRange: {
    //     start: "2025-06-01",
    //     end: "2025-12-31"
    //   },
    //   hours: ["00:00", "23:59"],
    //   duration: 15
    // }
    // ]);
    // this.loadingSignal.set(false);
  }

  onGetAssets() {
    if (this.assetSignal().length === 0) this.onLoadAssets();
    return this.assetSignal();
  }

  onRefreshRoles() {
    this.assetSignal.set([]);
    this.onLoadAssets();
  }

  async onDropFile(files: any) {
    if (files) {
      for (const file of files) {
        const result = await this.processFile(file);
        if (result) {
          this.assetForm.patchValue(result);
          this.onSaveAssets(this.assetForm.value);
        }
      }
      this.assetForm.reset();
    }
  }

  onSaveAssets(assets: Assets) {
    const tempAssets = this.assets();
    const { id, code, status, ...info } = assets;    
    const index = tempAssets.findIndex(u => u.id === id);
    if (index !== -1) tempAssets[index] = { ...tempAssets[index], ...info };
    else tempAssets.push({ id: tempAssets.length + 1, code: `NYX00${tempAssets.length + 1}`, status: 'Pending', ...info, createdOn: new Date(), updatedOn: new Date() });

    this.assetSignal.set([...tempAssets]);
    /**Call POST/PATCH user API */
  }

  onDeleteAssets(assets: Assets) {
    const tempAssets = this.assets().filter(u => u.id !== assets.id);
    this.assetSignal.set([...tempAssets]);
    /**Call DELETE user API */
  }

  dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('start')?.value;
      const end = group.get('end')?.value;
      if (start && end && new Date(start) > new Date(end)) {
        return { startAfterEnd: true }
      }
      return null;
    }
  }
  
  async processFile(file: File): Promise<Assets | any> {
    const MAX_SIZE  = 300 * 1024 * 1024;
    if (file.size > MAX_SIZE) return false;

    if (this.assetTypeControl.value === 'file') {
      this.assetForm.patchValue({ name: file.name });
    }

    const fileDataURL = await this.readFileAsDataURL(file);
    const metadata = await this.getImageOrientationAndResolution2(file, fileDataURL);
    const type = file.type.split('/')[0];
    
    if (type === 'video') {
      const [thumbnail, duration] = await Promise.all([
        this.extractVideoThumbnail(file),
        this.getVideoDuration(file)
      ]);

      return this.buildAssetObject(fileDataURL, metadata, thumbnail, duration);
    }

    return this.buildAssetObject(fileDataURL, metadata, fileDataURL);
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  
  private getImageOrientationAndResolution2(file: File, dataURL: string): Promise<AssestInfo> {
    return new Promise((resolve, reject) => {      
      const isImage = file.type.startsWith('image');
      const isVideo = file.type.startsWith('video');
      const isText = file.type.startsWith('text');
      
      if (isImage) {
        const img = new Image();
        img.onload = () => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            orientation: img.width > img.height ? 'landscape' : img.height > img.width ? 'portrait' : 'square',
            resolution: { width: img.width, height: img.height }
          });
        };
        img.onerror = reject;
        img.src = dataURL;
      } else if (isVideo) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            orientation: video.videoWidth > video.videoHeight ? 'landscape' : video.videoHeight > video.videoWidth ? 'portrait' : 'square',
            resolution: { width: video.videoWidth, height: video.videoHeight }
          });
        };
        video.onerror = () => reject(new Error('Failed to load video metadata'));
        video.src = dataURL;
      } else if (isText) {
        resolve({
          name: file.name,
          size: file.size,
          type: 'web',
          orientation: 'portrait',
          resolution: { width: 0, height: 0 }
        });
      } else {
        reject(new Error('Unsupported file type for orientation/resolution extraction'));
      }
    });
  }

  private extractVideoThumbnail(file: File): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        video.currentTime = 1;
      };

      video.onseeked = () => {
        setTimeout(() => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(video.src);
          resolve(canvas.toDataURL('image/png'));
        }, 100);
      };
    });
  }

  private getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(Math.floor(video.duration));
      };
    });
  }

  private buildAssetObject(link: string, meta: AssestInfo, thumbnail: string, duration?: number) {
    const base = {
      name: meta.name,
      link,
      type: meta.type.split('/')[0],
      fileDetails: {
        name: meta.name,
        size: meta.size,
        type: meta.type,
        orientation: meta.orientation,
        resolution: meta.resolution,
        thumbnail
      }
    };
    return { ...base, duration: duration ?? 5 }
  }
}
