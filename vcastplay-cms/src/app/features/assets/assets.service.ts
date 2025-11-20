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
        name: 'Colorful Hotel Building Led Signage in Night Time',
        type: 'image',
        link: 'https://images.pexels.com/photos/3678857/pexels-photo-3678857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        thumbnail: 'https://images.pexels.com/photos/3678857/pexels-photo-3678857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        fileDetails: {
          name: 'image (2).png',
          size: 55782,
          type: 'image/png',
          orientation: 'portrait',
          resolution: {
            width: 1260,
            height: 750,
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
        name: 'Close up of a Woman Posing and Taking Selfies',
        type: 'video',
        link: 'https://videos.pexels.com/video-files/4236566/4236566-uhd_2560_1440_24fps.mp4',
        thumbnail: 'https://images.pexels.com/videos/4236566/pexels-photo-4236566.jpeg?auto=compress&cs=tinysrgb&w=600',
        fileDetails: {
          name: 'Close up of a Woman Posing and Taking Selfies',
          size: 2498125,
          type: 'video/mp4',
          orientation: 'landscape',
          resolution: {
            width: 2560,
            height: 1440,
          },
        },
        duration: 19,
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
        code: 'NYX003',
        name: 'Modern Train Arriving at Busy City Station',
        type: 'video',
        link: 'https://videos.pexels.com/video-files/34735641/14724861_2560_1440_30fps.mp4',
        thumbnail: 'https://images.pexels.com/videos/34735641/2025-travel-4k-arriving-train-34735641.jpeg?auto=compress&cs=tinysrgb&w=600',
        fileDetails: {
          name: 'https://videos.pexels.com/video-files/34735641/14724861_2560_1440_30fps.mp4',
          size: 2498125,
          type: 'video/mp4',
          orientation: 'landscape',
          resolution: {
            width: 2560,
            height: 1440,
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
        id: 4,
        code: 'NYX004',
        name: 'A street pole with a bunch of stickers on it',
        type: 'image',
        link: 'https://images.pexels.com/photos/28377846/pexels-photo-28377846/free-photo-of-a-street-pole-with-a-bunch-of-stickers-on-it.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        thumbnail:
          'https://images.pexels.com/photos/28377846/pexels-photo-28377846/free-photo-of-a-street-pole-with-a-bunch-of-stickers-on-it.jpeg?auto=compress&cs=tinysrgb&w=600',
        fileDetails: {
          name: 'image (2).png',
          size: 55782,
          type: 'image/png',
          orientation: 'portrait',
          resolution: {
            width: 1260,
            height: 750,
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
        code: 'NYX005',
        name: 'A man in a jacket and hat standing in front of graffiti',
        type: 'image',
        link: 'https://images.pexels.com/photos/19885905/pexels-photo-19885905/free-photo-of-a-man-in-a-jacket-and-hat-standing-in-front-of-graffiti.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        thumbnail:
          'https://images.pexels.com/photos/19885905/pexels-photo-19885905/free-photo-of-a-man-in-a-jacket-and-hat-standing-in-front-of-graffiti.jpeg?auto=compress&cs=tinysrgb&w=600',
        fileDetails: {
          name: 'image (2).png',
          size: 55782,
          type: 'image/png',
          orientation: 'portrait',
          resolution: {
            width: 1260,
            height: 750,
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
        code: 'NYX006',
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
        code: 'NYX007',
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
          orientation: 'portrait',
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
      {
        id: 8,
        code: 'NYX008',
        name: 'Motorcycle and Cars on the Highway',
        type: 'video',
        link: 'https://videos.pexels.com/video-files/5198954/5198954-uhd_1440_2732_25fps.mp4',
        thumbnail: 'https://images.pexels.com/videos/5198954/pexels-photo-5198954.jpeg?auto=compress&cs=tinysrgb&w=600',
        fileDetails: {
          name: 'https://videos.pexels.com/video-files/5198954/5198954-uhd_1440_2732_25fps.mp4',
          size: 2498125,
          type: 'video/mp4',
          orientation: 'landscape',
          resolution: {
            width: 1440,
            height: 2732,
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
        "id": 9,
        "code": "NYX009",
        "name": "Serene Ocean Surface with Gentle Sunlight Reflections",
        "type": "video",
        "link": "https://videos.pexels.com/video-files/7385122/7385122-uhd_2560_1440_30fps.mp4",
        "thumbnail": "https://placehold.co/600x400",
        "fileDetails": {
          "name": "7385122-uhd_2560_1440_30fps.mp4",
          "size": 0,
          "type": "video/mp4",
          "orientation": "landscape",
          "resolution": {
            "width": 2560,
            "height": 1440
          }
        },
        "duration": 6,
        "audienceTag": {
          "genders": ["Male", "Female"],
          "ageGroups": [],
          "timeOfDays": [],
          "seasonalities": [],
          "locations": [],
          "pointOfInterests": [],
          "tags": ["nature", "water", "calm"]
        },
        "status": "pending",
        "createdOn": new Date(),
        "updatedOn": new Date()
      },
      {
        "id": 10,
        "code": "NYX010",
        "name": "B-Roll of Jungle Leaves and Forest Canopy",
        "type": "video",
        "link": "https://videos.pexels.com/video-files/18922150/18922150-uhd_3840_2160_25fps.mp4",
        "thumbnail": "https://placehold.co/600x400",
        "fileDetails": {
          "name": "18922150-uhd_3840_2160_25fps.mp4",
          "size": 0,
          "type": "video/mp4",
          "orientation": "landscape",
          "resolution": {
            "width": 3840,
            "height": 2160
          }
        },
        "duration": 31,
        "audienceTag": {
          "genders": ["Male", "Female"],
          "ageGroups": [],
          "timeOfDays": [],
          "seasonalities": [],
          "locations": ["forest", "nature"],
          "pointOfInterests": ["eco", "travel"],
          "tags": ["trees", "jungle", "green"]
        },
        "status": "pending",
        "createdOn": new Date(),
        "updatedOn": new Date()
      },
      {
        "id": 12,
        "code": "NYX012",
        "name": "Sunrise Over Misty Mountains and Forest",
        "type": "image",
        "link": "https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg",
        "thumbnail": "https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg?auto=compress&cs=tinysrgb&w=600",
        "fileDetails": {
          "name": "sunrise-misty-forest-132037.jpg",
          "size": 0,
          "type": "image/jpeg",
          "orientation": "landscape",
          "resolution": {
            "width": 3000,
            "height": 1999
          }
        },
        "duration": 10,
        "audienceTag": {
          "genders": ["Male", "Female"],
          "ageGroups": [],
          "timeOfDays": ["Morning"],
          "seasonalities": [],
          "locations": ["forest", "mountains"],
          "pointOfInterests": ["travel", "nature"],
          "tags": ["sunrise", "mist", "mountains"]
        },
        "status": "pending",
        "createdOn": new Date(),
        "updatedOn": new Date()
      },
      {
        "id": 16,
        "code": "NYX016",
        "name": "4K Landscape of Snowy Mountains During Golden Hour",
        "type": "image",
        "link": "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg",
        "thumbnail": "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600",
        "fileDetails": {
          "name": "snowy-mountains-417074.jpg",
          "size": 4200000,
          "type": "image/jpeg",
          "orientation": "landscape",
          "resolution": {
            "width": 4226,
            "height": 2847
          }
        },
        "duration": 7,
        "audienceTag": {
          "genders": ["Male", "Female"],
          "ageGroups": [],
          "timeOfDays": ["Evening"],
          "seasonalities": ["Winter"],
          "locations": ["mountains"],
          "pointOfInterests": ["travel"],
          "tags": ["snow", "mountains", "sunset"]
        },
        "status": "pending",
        "createdOn": new Date(),
        "updatedOn": new Date()
      },
      {
        "id": 17,
        "code": "NYX017",
        "name": "Close Up Shot of Leaves with Sunlight Bokeh",
        "type": "image",
        "link": "https://images.pexels.com/photos/675267/pexels-photo-675267.jpeg",
        "thumbnail": "https://images.pexels.com/photos/675267/pexels-photo-675267.jpeg?auto=compress&cs=tinysrgb&w=600",
        "fileDetails": {
          "name": "leaves-sunlight-bokeh-675267.jpg",
          "size": 2100000,
          "type": "image/jpeg",
          "orientation": "landscape",
          "resolution": {
            "width": 5263,
            "height": 3076
          }
        },
        "duration": 5,
        "audienceTag": {
          "genders": ["Male", "Female"],
          "ageGroups": [],
          "timeOfDays": ["Afternoon"],
          "seasonalities": ["Summer"],
          "locations": ["forest"],
          "pointOfInterests": [],
          "tags": ["leaves", "bokeh", "nature"]
        },
        "status": "pending",
        "createdOn": new Date(),
        "updatedOn": new Date()
      },
      {
        "id": 18,
        "code": "NYX018",
        "name": "Powerful Waterfall in Lush Green Forest",
        "type": "video",
        "link": "https://videos.pexels.com/video-files/8320126/8320126-uhd_2560_1440_25fps.mp4",
        "thumbnail": "https://images.pexels.com/videos/19304195/4k-clouds-colombia-downfall-19304195.jpeg?auto=compress&cs=tinysrgb&w=600",
        "fileDetails": {
          "name": "8859849-uhd_3840_2160_30fps.mp4",
          "size": 0,
          "type": "video/mp4",
          "orientation": "landscape",
          "resolution": {
            "width": 2560,
            "height": 1440
          }
        },
        "duration": 15,
        "audienceTag": {
          "genders": ["Male", "Female"],
          "ageGroups": [],
          "timeOfDays": [],
          "seasonalities": ["Summer"],
          "locations": ["forest", "nature"],
          "pointOfInterests": ["travel", "relaxation"],
          "tags": ["waterfall", "green", "lush"]
        },
        "status": "pending",
        "createdOn": new Date(),
        "updatedOn": new Date()
      },
      {
        "id": 19,
        "code": "NYX019",
        "name": "Girl Running on the Field in Golden Light",
        "type": "video",
        "link": "https://videos.pexels.com/video-files/9208025/9208025-hd_1920_1080_25fps.mp4",
        "thumbnail": "https://images.pexels.com/videos/9208025/action-action-energy-activity-adolescent-9208025.jpeg?auto=compress&cs=tinysrgb&w=600",
        "fileDetails": {
          "name": "4524597-uhd_3840_2160_30fps.mp4",
          "size": 0,
          "type": "video/mp4",
          "orientation": "landscape",
          "resolution": {
            "width": 1920,
            "height": 1080
          }
        },
        "duration": 19,
        "audienceTag": {
          "genders": ["Female"],
          "ageGroups": ["Teen", "Adult"],
          "timeOfDays": ["Evening"],
          "seasonalities": [],
          "locations": ["field", "countryside"],
          "pointOfInterests": ["fitness", "nature"],
          "tags": ["running", "sunlight", "freedom"]
        },
        "status": "pending",
        "createdOn": new Date(),
        "updatedOn": new Date()
      },
      {
        "id": 20,
        "code": "NYX020",
        "name": "Slow Motion Close-up of White Flower",
        "type": "video",
        "link": "https://videos.pexels.com/video-files/3011973/3011973-hd_1920_1080_25fps.mp4",
        "thumbnail": "https://images.pexels.com/videos/3011973/free-video-3011973.jpg?auto=compress&cs=tinysrgb&w=600",
        "fileDetails": {
          "name": "13280036-uhd_3840_2160_24fps.mp4",
          "size": 0,
          "type": "video/mp4",
          "orientation": "portrait",
          "resolution": {
            "width": 1920,
            "height": 1080
          }
        },
        "duration": 31,
        "audienceTag": {
          "genders": ["Male", "Female"],
          "ageGroups": [],
          "timeOfDays": [],
          "seasonalities": ["Spring"],
          "locations": ["garden", "nature"],
          "pointOfInterests": ["relaxation", "beauty"],
          "tags": ["flower", "macro", "slow motion"]
        },
        "status": "pending",
        "createdOn": new Date(),
        "updatedOn": new Date()
      },
      {
        "id": 21,
        "code": "NYX021",
        "name": "Snowy Mountain Peak under Clear Blue Sky",
        "type": "image",
        "link": "https://images.pexels.com/photos/31427173/pexels-photo-31427173/free-photo-of-solo-adventurer-on-snowy-mountain-ridge.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "thumbnail": "https://images.pexels.com/photos/31427173/pexels-photo-31427173/free-photo-of-solo-adventurer-on-snowy-mountain-ridge.jpeg?auto=compress&cs=tinysrgb&w=600",
        "fileDetails": {
          "name": "snow-covered-mountain-267614.jpg",
          "size": 0,
          "type": "image/jpeg",
          "orientation": "landscape",
          "resolution": {
            "width": 1260,
            "height": 750
          }
        },
        "duration": 5,
        "audienceTag": {
          "genders": ["Male", "Female"],
          "ageGroups": [],
          "timeOfDays": ["Morning"],
          "seasonalities": ["Winter"],
          "locations": ["mountains"],
          "pointOfInterests": ["travel"],
          "tags": ["snow", "peak", "sky"]
        },
        "status": "pending",
        "createdOn": new Date(),
        "updatedOn": new Date()
      },
      {
        "id": 22,
        "code": "NYX022",
        "name": "Golden Wheat Field at Sunset",
        "type": "image",
        "link": "https://images.pexels.com/photos/533982/pexels-photo-533982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        "thumbnail": "https://images.pexels.com/photos/533982/pexels-photo-533982.jpeg?auto=compress&cs=tinysrgb&w=600",
        "fileDetails": {
          "name": "wheat-field-1103970.jpg",
          "size": 0,
          "type": "image/jpeg",
          "orientation": "landscape",
          "resolution": {
            "width": 1260,
            "height": 750
          }
        },
        "duration": 10,
        "audienceTag": {
          "genders": ["Male", "Female"],
          "ageGroups": [],
          "timeOfDays": ["Evening"],
          "seasonalities": ["Autumn"],
          "locations": ["field", "countryside"],
          "pointOfInterests": ["nature", "relaxation"],
          "tags": ["wheat", "sunset", "golden"]
        },
        "status": "pending",
        "createdOn": new Date(),
        "updatedOn": new Date()
      }
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
