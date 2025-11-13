import { computed, Injectable, signal } from '@angular/core'
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { AssetInfo, Assets, AssetType } from './assets'
import heic2any from 'heic2any';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private assetSignal = signal<Assets[]>([])
  assets = computed(() => this.assetSignal())

  selectedAsset = signal<Assets | any>(null);
  selectedArrAssets = signal<Assets[]>([])

  first = signal<number>(0)
  rows = signal<number>(8)
  totalRecords = signal<number>(0)

  loadingSignal = signal<boolean>(false)
  isEditMode = signal<boolean>(false)
  isLoading = signal<boolean>(false)
  showPrompt = signal<boolean>(false)

  assetType = signal<AssetType[]>([
    { label: 'File', value: 'file' },
    { label: 'Web Pages', value: 'web' },
    // { label: 'Widgets', value: 'widget' },
    { label: 'Youtube', value: 'youtube' },
    { label: 'Facebook', value: 'facebook' },
  ])

  assetTypeControl: FormControl = new FormControl('file', { nonNullable: true })

  assetViewModeSignal = signal<string>('Grid')
  assetViewModeCtrl: FormControl = new FormControl('Grid')
  assetViewModes = [
    { icon: 'pi pi-table', label: 'Grid' },
    { icon: 'pi pi-list', label: 'List' },
  ]

  assetForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    code: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    type: new FormControl(''),
    link: new FormControl(''),
    category: new FormControl(null, [Validators.required]),
    subCategory: new FormControl(null, [Validators.required]),
    fileDetails: new FormGroup<AssetInfo | any>({
      size: new FormControl(null),
      type: new FormControl(null),
      orientation: new FormControl(null),
      resolution: new FormControl(null),
      thumbnail: new FormControl(null),
    }),
    availability: new FormControl<boolean>(false),
    dateRange: new FormGroup(
      {
        start: new FormControl(null),
        end: new FormControl(null),
      },
      { validators: [this.dateRangeValidator()] }
    ),
    allDay: new FormControl<boolean>(false, { nonNullable: true }),
    allWeekdays: new FormControl<boolean>(false, { nonNullable: true }),
    weekdays: new FormControl<string[]>([], { nonNullable: true }),
    hours: new FormControl<string[]>([], { nonNullable: true }),
    duration: new FormControl(10, { nonNullable: true }),
    audienceTag: new FormGroup({
      genders: new FormControl([], { nonNullable: true }),
      ageGroups: new FormControl([], { nonNullable: true }),
      timeOfDays: new FormControl([], { nonNullable: true }),
      seasonalities: new FormControl([], { nonNullable: true }),
      locations: new FormControl([], { nonNullable: true }),
      pointOfInterests: new FormControl([], { nonNullable: true }),
      tags: new FormControl([], { nonNullable: true }),
    }),
  })

  assetFilterForm: FormGroup = new FormGroup({
    dateRange: new FormControl(null),
    category: new FormControl(null),
    subCategory: new FormControl(null),
    type: new FormControl(null),
    orientation: new FormControl(null),
    keywords: new FormControl(null),
  })

  constructor() {}

  onLoadAssets() {
    /** Get API */
    // this.loadingSignal.set(true);
    this.assetSignal.set([
      {
        id: 1,
        code: 'NYX001',
        name: 'pexels-photo-355465.jpeg',
        type: 'image',
        link: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg',
        thumbnail: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg',
        fileDetails: {
          name: 'image (2).png',
          size: 55782,
          type: 'image/png',
          orientation: 'portrait',
          resolution: {
            width: 326,
            height: 195,
          },
        },
        duration: 5,
        audienceTag: {
          genders: ['Male', 'Female'],
          ageGroups: [],
          timeOfDays: [],
          seasonalities: [],
          locations: [],
          pointOfInterests: [],
          tags: [],
        },
        status: 'pending',
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        id: 2,
        code: 'NYX002',
        name: 'ForBiggerBlazes.mp4',
        type: 'video',
        link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://placehold.co/600x400',
        fileDetails: {
          name: 'ForBiggerBlazes.mp4',
          size: 2498125,
          type: 'video/mp4',
          orientation: 'landscape',
          resolution: {
            width: 1280,
            height: 720,
          },
        },
        duration: 15,
        audienceTag: {
          genders: ['Male', 'Female'],
          ageGroups: [],
          timeOfDays: [],
          seasonalities: [],
          locations: [],
          pointOfInterests: [],
          tags: [],
        },
        status: 'pending',
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        id: 3,
        code: 'NYX002',
        name: 'ForBiggerJoyrides.mp4',
        type: 'video',
        link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        thumbnail: 'https://placehold.co/600x400',
        fileDetails: {
          name: 'ForBiggerBlazes.mp4',
          size: 2498125,
          type: 'video/mp4',
          orientation: 'landscape',
          resolution: {
            width: 1280,
            height: 720,
          },
        },
        duration: 15,
        audienceTag: {
          genders: ['Male', 'Female'],
          ageGroups: [],
          timeOfDays: [],
          seasonalities: [],
          locations: [],
          pointOfInterests: [],
          tags: [],
        },
        status: 'pending',
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        id: 4,
        code: 'NYX001',
        name: 'photo-1464822759023-fed622ff2c3b.avif',
        type: 'image',
        link: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        thumbnail:
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        fileDetails: {
          name: 'image (2).png',
          size: 55782,
          type: 'image/png',
          orientation: 'portrait',
          resolution: {
            width: 326,
            height: 195,
          },
        },
        duration: 10,
        audienceTag: {
          genders: ['Male', 'Female'],
          ageGroups: [],
          timeOfDays: [],
          seasonalities: [],
          locations: [],
          pointOfInterests: [],
          tags: [],
        },
        status: 'pending',
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        id: 5,
        code: 'NYX001',
        name: '1000_F_1310379726_DSfLV5fQQ0lRTGSOF0XshStWGEVSj0DZ.jpg',
        type: 'image',
        link: 'https://as2.ftcdn.net/v2/jpg/13/10/37/97/1000_F_1310379726_DSfLV5fQQ0lRTGSOF0XshStWGEVSj0DZ.jpg',
        thumbnail:
          'https://as2.ftcdn.net/v2/jpg/13/10/37/97/1000_F_1310379726_DSfLV5fQQ0lRTGSOF0XshStWGEVSj0DZ.jpg',
        fileDetails: {
          name: 'image (2).png',
          size: 55782,
          type: 'image/png',
          orientation: 'portrait',
          resolution: {
            width: 326,
            height: 195,
          },
        },
        duration: 8,
        audienceTag: {
          genders: ['Male', 'Female'],
          ageGroups: [],
          timeOfDays: [],
          seasonalities: [],
          locations: [],
          pointOfInterests: [],
          tags: [],
        },
        status: 'pending',
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        id: 6,
        code: 'NYX005',
        name: 'Youtube video',
        type: 'youtube',
        link: 'https://www.youtube.com/watch?v=QC8iQqtG0hg',
        category: 'Category 1',
        subCategory: 'Sub Category 1',
        thumbnail: 'https://placehold.co/600x400',
        fileDetails: {
          name: 'Youtube video',
          size: 0,
          type: 'youtube',
          orientation: 'landscape',
          resolution: {
            width: 0,
            height: 0,
          },
        },
        dateRange: {
          start: null,
          end: null,
        },
        weekdays: [],
        hours: [],
        duration: 7,
        audienceTag: {
          genders: [],
          ageGroups: [],
          timeOfDays: [],
          seasonalities: [],
          locations: [],
          pointOfInterests: [],
          tags: [],
        },
        status: 'pending',
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        id: 7,
        code: 'NYX005',
        name: 'Facebok Video',
        type: 'facebook',
        link: 'https://www.facebook.com/watch/?v=1222645649278888',
        category: 'Category 1',
        subCategory: 'Sub Category 1',
        thumbnail: 'https://placehold.co/600x400',
        fileDetails: {
          name: 'Facebok Video',
          size: 0,
          type: 'facebook',
          orientation: 'landscape',
          resolution: {
            width: 0,
            height: 0,
          },
        },
        dateRange: {
          start: null,
          end: null,
        },
        weekdays: [],
        hours: [],
        duration: 10,
        audienceTag: {
          genders: [],
          ageGroups: [],
          timeOfDays: [],
          seasonalities: [],
          locations: [],
          pointOfInterests: [],
          tags: [],
        },
        status: 'pending',
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ])
    this.totalRecords.set(this.assets().length)
    // this.loadingSignal.set(false);
  }

  onGetAssets() {
    if (this.assetSignal().length === 0) this.onLoadAssets()
    return this.assetSignal()
  }

  onRefreshRoles() {
    this.assetSignal.set([])
    this.onLoadAssets()
  }

  onPageChange(event: any) {
    this.first.set(event.first)
    this.rows.set(event.rows)
  }

  onSaveAssets(assets: Assets) {
    const tempAssets = this.assets()
    const { id, code, status, ...info } = assets
    const index = tempAssets.findIndex((u) => u.id === id)
    if (index !== -1) tempAssets[index] = { ...tempAssets[index], ...info }
    else
      tempAssets.push({
        id: tempAssets.length + 1,
        code: `NYX00${tempAssets.length + 1}`,
        status: 'pending',
        ...info,
        createdOn: new Date(),
        updatedOn: new Date(),
      })

    this.assetSignal.set([...tempAssets])
    this.totalRecords.set(this.assets().length)
    /**Call POST/PATCH user API */
  }

  onDeleteAssets(assets: Assets) {
    const tempAssets = this.assets().filter((u) => u.id !== assets.id)
    this.assetSignal.set([...tempAssets])
    this.totalRecords.set(this.assets().length)
    /**Call DELETE user API */
  }

  onDuplicateAssets(assets: Assets) {
    const tempData = this.assets()
    tempData.push({
      ...assets,
      id: tempData.length + 1,
      name: `Copy of ${assets.name}`,
      status: 'pending',
      createdOn: new Date(),
      updatedOn: new Date(),
    })
    this.assetSignal.set([...tempData])
    this.totalRecords.set(this.assets().length)
    /**CALL POST API */
  }

  onFilterChange(value: any) {
    console.log(value)
  }

  dateRangeValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('start')?.value
      const end = group.get('end')?.value
      if (start && end && new Date(start) > new Date(end)) {
        return { startAfterEnd: true }
      }
      return null
    }
  }

  async processFile(file: File): Promise<AssetInfo | any> {
    try {
      this.isLoading.set(true);
      if (this.assetTypeControl.value === 'file') this.assetForm.patchValue({ name: file.name });

      // Try to process image metadata
      const { link, ...metadata }: any = await this.getImageOrientationAndResolution(file);
      
            
      const type = file.type.split('/')[0];

      if (type === 'video') {
        const [thumbnail, duration] = await Promise.all([
          this.extractVideoThumbnail(file),
          this.getVideoDuration(file),
        ]);

        this.isLoading.set(false);
        return this.buildAssetObject(link, metadata, thumbnail, duration);
      }

      if (type === 'audio') {
        const duration = await this.getAudioDuration(file);
        this.isLoading.set(false);        
        return this.buildAssetObject(link, metadata, link, duration);
      }

      this.isLoading.set(false);
      return this.buildAssetObject(link, metadata, link);
    } catch (error) {
      this.isLoading.set(false);
      throw error
    }
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  
  private async getImageOrientationAndResolution(file: File): Promise<AssetInfo> {
    return new Promise(async (resolve, reject) => {
      try {
        const isImage = file.type.startsWith('image');
        const isVideo = file.type.startsWith('video');
        const isText = file.type.startsWith('text');
        const isHeic = file.name.toLowerCase().endsWith('.heic');
        const isAudio = file.type.startsWith('audio');

        // 🖼️ Regular image
        if (isImage) {
          const img = new Image();
          img.onload = async () => {
            const resolution = { width: img.width, height: img.height }
            resolve(await this.fileDetailsToAssetInfo(file.name, resolution, file));
          };
          img.onerror = (error: any) =>
              reject({ code: 'PROCESS_ERROR', message: 'Failed to load image metadata (possibly corrupted image)' });
            // reject(new Error('Failed to load image metadata (possibly corrupted image)'));
          img.src = await this.readFileAsDataURL(file);
          return;
        }

        // 🎥 Video
        if (isVideo) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = async () => {
            const resolution = { width: video.videoWidth, height: video.videoHeight }
            resolve(await this.fileDetailsToAssetInfo(file.name, resolution, file));
          };
          video.onerror = () =>
            reject(new Error('Failed to load video metadata (unsupported or corrupted video)'));
          video.src = await this.readFileAsDataURL(file);
          return;
        }

        // 📄 Text or simple web file
        if (isText) {
          resolve({
            name: file.name,
            size: file.size,
            type: 'web',
            orientation: 'portrait',
            resolution: { width: 0, height: 0 },
            link: await this.readFileAsDataURL(file),
          });
          return;
        }

        // 🍏 HEIC image
        if (isHeic) {
          try {
            const convertedBlob = await heic2any({ blob: file, toType: 'image/png', quality: 0.9 });
            const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
            const newImage = new File([blob], file.name.replace(/\.heic$/i, '.png'), { type: 'image/png' });

            const img = new Image();
            img.onload = async () => {
              const resolution = { width: img.width, height: img.height }
              resolve(await this.fileDetailsToAssetInfo(file.name, resolution, newImage));
            };
            img.onerror = () =>
              reject(new Error('Failed to load converted HEIC image (possibly invalid file)'));
            img.src = await this.readFileAsDataURL(newImage);
            return;
          } catch (error: any) {
            reject({ code: 'PROCESS_ERROR', message: error?.message || 'Failed to process file' });
          }
        }

        // 🎵 Audio
        if (isAudio) {
          try {
            resolve({
              name: file.name,
              size: file.size,
              type: 'audio',
              orientation: 'square',
              resolution: { width: 0, height: 0 },
              link: await this.readFileAsDataURL(file),
            });
            return;
          } catch (error) {
            reject({ code: 'PROCESS_ERROR', message: error || 'Failed to process file' });
          }
        }

        // ❌ Unsupported type
        reject(new Error('Unsupported file type for orientation/resolution extraction'));
      } catch (error: any) {
        reject(new Error('Unexpected error while reading file: ' + (error?.message || error)));
      }
    });
  }


  private extractVideoThumbnail(file: File): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = URL.createObjectURL(file)

      video.onloadedmetadata = () => {
        video.currentTime = 1
      }

      video.onseeked = () => {
        setTimeout(() => {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
          URL.revokeObjectURL(video.src)
          resolve(canvas.toDataURL('image/png'))
        }, 100)
      }
    })
  }

  private getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = URL.createObjectURL(file)
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src)
        resolve(Math.floor(video.duration))
      }
    })
  }

  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = document.createElement('audio')
      audio.preload = 'metadata'
      audio.src = URL.createObjectURL(file)
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src)
        resolve(Math.floor(audio.duration))
      }
    })
  }

  private async fileDetailsToAssetInfo(name: string, resolution: { width: number; height: number }, file: any): Promise<any> {
    const orientation = resolution.width > resolution.height ? 'landscape' : resolution.height > resolution.width ? 'portrait' : 'square';
    return {
      name,
      size: file.size,
      type: file.type,
      orientation,
      resolution,
      link: await this.readFileAsDataURL(file),
    };
  }

  private buildAssetObject(link: string, meta: AssetInfo, thumbnail: string, duration?: number) {
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
        thumbnail,
      },
    }
    return { ...base, duration: duration ?? 5 }
  }
}
