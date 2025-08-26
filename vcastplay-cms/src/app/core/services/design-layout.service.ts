import { computed, inject, Injectable, signal } from '@angular/core';
import { DesignLayout, HtmlLayer } from '../interfaces/design-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlaylistService } from './playlist.service';
import * as fabric from 'fabric';


interface GuideLine {
  line: fabric.Line;
}

@Injectable({
  providedIn: 'root'
})
export class DesignLayoutService {

  playlistService = inject(PlaylistService);
  
  private canvas!: fabric.Canvas;
  private guides: GuideLine[] = [];
  private alignThreshold = 5;
  private animFrameId!: number;
  private clipboard: any;
  private undoStack: any[] = [];
  private redoStack: any[] = [];
  private isRestoringState = signal<boolean>(false);

  private designSignal = signal<DesignLayout[]>([]);
  designs = computed(() => this.designSignal());

  isEditMode = signal<boolean>(false);
  loadingSignal = signal<boolean>(false);
  showApprove = signal<boolean>(false);
  showCanvasSize = signal<boolean>(false);
  showContents = signal<boolean>(false);

  DEFAULT_SCALE = signal<number>(0.45);
  SELECTION_STYLE = signal<any>({
    borderColor: '#9B5CFA',
    borderScaleFactor: 2,
    cornerStrokeColor: '#8B3DFF',
    cornerColor: '#9B5CFA',
    cornerStyle: 'circle',
    cornerSize: 12,
    transparentCorners: false
  })

  selectedDesign = signal<DesignLayout | null>(null);
  selectedArrDesign = signal<DesignLayout[]>([]);
  
  rows = signal<number>(8);
  totalRecords = signal<number>(0);
  zoomLevel = signal<number>(1);

  designForm: FormGroup = new FormGroup({
    id: new FormControl(0, { nonNullable: true }),
    name: new FormControl('New Design', [ Validators.required ]),
    description: new FormControl('This is a new design', [ Validators.required ]),
    type: new FormControl('design', { nonNullable: true }),
    canvas: new FormControl(null),
    htmlLayers: new FormControl(null),
    duration: new FormControl(5, { nonNullable: true }),
    color: new FormControl('#ffffff', { nonNullable: true }),
    approvedInfo: new FormGroup({
      approvedBy: new FormControl('Admin'),
      approvedOn: new FormControl(new Date()),
      remarks: new FormControl(''),
    }),
    status: new FormControl('active'),
    isActive: new FormControl(false),
    screen: new FormControl(null, [ Validators.required ]),
    createdOn: new FormControl(new Date()),
    updatedOn: new FormControl(new Date()),
  });
  
  textPropsForm: FormGroup = new FormGroup({
    size: new FormControl(12, { nonNullable: true }),
    weight: new FormControl(false, { nonNullable: true }),
    italic: new FormControl(false, { nonNullable: true }),
    underline: new FormControl(false, { nonNullable: true }),
    alignment: new FormControl('left', { nonNullable: true }),
    color: new FormControl('#000000', { nonNullable: true })
  })

  rectPropsForm: FormGroup = new FormGroup({
    color: new FormControl('#000000', { nonNullable: true }),
    transparent: new FormControl(false, { nonNullable: true }),
    style: new FormControl('fill', { nonNullable: true }),
    strokeWidth: new FormControl(1, { nonNullable: true }),
  })

  canvasProps: any = {
    zoom: false,
    move: false,
    drag: false,
    selection: false,
    text: false,
    rect: false,
    line: false,
    image: false,
    video: false,
    content: false
  }

  selectedColor = signal<string>('#000000');
  canvasActiveObject = signal<any>(null);
  canvasHTMLLayers = signal<HtmlLayer[]>([]);

  cliparts: { name: string; link: string, type: string }[] = [
    { name: 'circle', link: 'assets/cliparts/circle.svg', type: 'image' },
    { name: 'cloud', link: 'assets/cliparts/cloud.svg', type: 'image' },
    { name: 'flower', link: 'assets/cliparts/flower.svg', type: 'image' },
    { name: 'heart', link: 'assets/cliparts/heart.svg', type: 'image' },
    { name: 'music', link: 'assets/cliparts/music.svg', type: 'image' },
    { name: 'square', link: 'assets/cliparts/square.svg', type: 'image' },
    { name: 'star', link: 'assets/cliparts/star.svg', type: 'image' },
    { name: 'sun', link: 'assets/cliparts/sun.svg', type: 'image' },
    { name: 'tree', link: 'assets/cliparts/tree.svg', type: 'image' },
    { name: 'triangle', link: 'assets/cliparts/triangle.svg', type: 'image' },
    { name: 'apple', link: 'assets/cliparts/apple.svg', type: 'image' },
    { name: 'car', link: 'assets/cliparts/car.svg', type: 'image' },
    { name: 'house', link: 'assets/cliparts/house.svg', type: 'image' },
    { name: 'balloon', link: 'assets/cliparts/balloon.svg', type: 'image' },
    { name: 'book', link: 'assets/cliparts/book.svg', type: 'image' },
    { name: 'camera', link: 'assets/cliparts/camera.svg', type: 'image' },
    { name: 'fish', link: 'assets/cliparts/fish.svg', type: 'image' },
    { name: 'butterfly', link: 'assets/cliparts/butterfly.svg', type: 'image' },
    { name: 'tree2', link: 'assets/cliparts/tree2.svg', type: 'image' },
    { name: 'cup', link: 'assets/cliparts/cup.svg', type: 'image' }
  ];

  constructor() { }

  setCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  getCanvas(): fabric.Canvas {
    return this.canvas;
  }

  onLoadDesigns() {
    this.designSignal.set([{
      id: 1,
      status: "pending",
      duration: 5,
      name: "New Design",
      description: "This is a new design",
      type: "design",
      canvas: "{\"version\":\"6.7.1\",\"objects\":[{\"fontSize\":64,\"fontWeight\":\"bold\",\"fontFamily\":\"Arial\",\"fontStyle\":\"normal\",\"lineHeight\":1.16,\"text\":\"This is a header\",\"charSpacing\":0,\"textAlign\":\"left\",\"styles\":[],\"pathStartOffset\":0,\"pathSide\":\"left\",\"pathAlign\":\"baseline\",\"underline\":false,\"overline\":false,\"linethrough\":false,\"textBackgroundColor\":\"\",\"direction\":\"ltr\",\"textDecorationThickness\":66.667,\"minWidth\":20,\"splitByGrapheme\":false,\"textBoxProp\":{\"size\":64,\"weight\":true,\"italic\":false,\"underline\":false,\"alignment\":\"left\",\"color\":\"#000000\"},\"type\":\"Textbox\",\"version\":\"6.7.1\",\"originX\":\"left\",\"originY\":\"top\",\"left\":19.5913,\"top\":22.0773,\"width\":627.6087,\"height\":72.32,\"fill\":\"#000000\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0},{\"rx\":0,\"ry\":0,\"html\":{\"id\":0,\"top\":115.02880658436192,\"left\":94,\"width\":698.6645104762786,\"height\":349.3322552381393,\"rotation\":0,\"content\":{\"loop\":true,\"id\":1,\"name\":\"New Playlist\",\"description\":\"This is a sample description of a new playlist\",\"type\":\"playlist\",\"transition\":{\"hasGap\":false,\"type\":\"\",\"speed\":5},\"contents\":[{\"contentId\":1,\"id\":1,\"code\":\"NYX001\",\"name\":\"image (2).png\",\"type\":\"image\",\"link\":\"https://picsum.photos/id/237/200/300\",\"category\":\"Category 1\",\"subCategory\":\"Sub-Category 1\",\"fileDetails\":{\"name\":\"image (2).png\",\"size\":55782,\"type\":\"image/png\",\"orientation\":\"landscape\",\"resolution\":{\"width\":326,\"height\":195},\"thumbnail\":\"https://picsum.photos/id/237/200/300\"},\"dateRange\":{\"start\":null,\"end\":null},\"weekdays\":[],\"hours\":[],\"duration\":5,\"audienceTag\":{\"genders\":[\"Male\"],\"ageGroups\":[],\"timeOfDays\":[],\"seasonalities\":[],\"locations\":[],\"pointOfInterests\":[],\"tags\":[]},\"status\":\"pending\",\"createdOn\":\"2025-08-26T00:32:29.495Z\",\"updatedOn\":\"2025-08-26T00:32:29.495Z\"}],\"status\":\"pending\",\"duration\":5,\"isAuto\":false,\"isActive\":true,\"createdOn\":\"2025-08-26T00:32:29.495Z\",\"updatedOn\":\"2025-08-26T00:32:29.495Z\"},\"fabricObject\":{\"rx\":0,\"ry\":0,\"type\":\"Rect\",\"version\":\"6.7.1\",\"originX\":\"left\",\"originY\":\"top\",\"left\":94,\"top\":115.0288,\"width\":200,\"height\":100,\"fill\":\"transparent\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":3.4933,\"scaleY\":3.4933,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0}},\"type\":\"Rect\",\"version\":\"6.7.1\",\"originX\":\"left\",\"originY\":\"top\",\"left\":94,\"top\":115.0288,\"width\":200,\"height\":100,\"fill\":\"transparent\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":3.4933,\"scaleY\":3.4933,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0}],\"background\":\"#ffffff\"}",
      htmlLayers: [
          {
              "id": 0,
              "top": 115.02880658436192,
              "left": 94,
              "width": 698.6645104762786,
              "height": 349.3322552381393,
              "rotation": 0,
              "content": {
                  "loop": true,
                  "id": 1,
                  "name": "New Playlist",
                  "description": "This is a sample description of a new playlist",
                  "type": "playlist",
                  "transition": {
                      "hasGap": false,
                      "type": "",
                      "speed": 5
                  },
                  "contents": [
                      {
                          "contentId": 1,
                          "id": 1,
                          "code": "NYX001",
                          "name": "image (2).png",
                          "type": "image",
                          "link": "https://picsum.photos/id/237/200/300",
                          "category": "Category 1",
                          "subCategory": "Sub-Category 1",
                          "fileDetails": {
                              "name": "image (2).png",
                              "size": 55782,
                              "type": "image/png",
                              "orientation": "landscape",
                              "resolution": {
                                  "width": 326,
                                  "height": 195
                              },
                              "thumbnail": "https://picsum.photos/id/237/200/300"
                          },
                          "dateRange": {
                              "start": null,
                              "end": null
                          },
                          "weekdays": [],
                          "hours": [],
                          "duration": 5,
                          "audienceTag": {
                              "genders": [
                                  "Male"
                              ],
                              "ageGroups": [],
                              "timeOfDays": [],
                              "seasonalities": [],
                              "locations": [],
                              "pointOfInterests": [],
                              "tags": []
                          },
                          "status": "pending",
                          "createdOn": "2025-08-26T00:32:29.495Z",
                          "updatedOn": "2025-08-26T00:32:29.495Z"
                      }
                  ],
                  "status": "pending",
                  "duration": 5,
                  "isAuto": false,
                  "isActive": true,
                  "createdOn": "2025-08-26T00:32:29.495Z",
                  "updatedOn": "2025-08-26T00:32:29.495Z"
              },
              "fabricObject": {
                  "rx": 0,
                  "ry": 0,
                  "type": "Rect",
                  "version": "6.7.1",
                  "originX": "left",
                  "originY": "top",
                  "left": 94,
                  "top": 115.0288,
                  "width": 200,
                  "height": 100,
                  "fill": "transparent",
                  "stroke": null,
                  "strokeWidth": 0,
                  "strokeDashArray": null,
                  "strokeLineCap": "butt",
                  "strokeDashOffset": 0,
                  "strokeLineJoin": "miter",
                  "strokeUniform": false,
                  "strokeMiterLimit": 4,
                  "scaleX": 3.4933,
                  "scaleY": 3.4933,
                  "angle": 0,
                  "flipX": false,
                  "flipY": false,
                  "opacity": 1,
                  "shadow": null,
                  "visible": true,
                  "backgroundColor": "",
                  "fillRule": "nonzero",
                  "paintFirst": "fill",
                  "globalCompositeOperation": "source-over",
                  "skewX": 0,
                  "skewY": 0
              }
          }
      ],
      color: "#ffffff",
      approvedInfo: {
          "approvedBy": "",
          "approvedOn": null,
          "remarks": ""
      },
      isActive: false,
      screen: {
          "id": 1,
          "code": "NYX001",
          "name": "PLAYER-NYX001",
          "type": "desktop",
          "address": {
              "country": "Philippines",
              "region": "Manila",
              "city": "Quezon City",
              "fullAddress": "Secret of God’s Child Learning Center, Inc., 176 12th Avenue corner Rosal Street,, A. Luna Street, Balong-Bato, San Juan, 1st District, Eastern Manila District, Metro Manila, 1132, Philippines",
              "latitude": 14.6091,
              "longitude": 121.0223,
              "zipCode": "1100"
          },
          "displaySettings": {
              "orientation": "landscape",
              "resolution": "1920x1080"
          },
          status: "inactive",
          screenStatus: "standby",
          displayStatus: "on",
          createdOn: new Date(),
          updatedOn: new Date()
      },
      createdOn: new Date(),
      updatedOn: new Date()
    }
    ])
  }

  onGetDesigns() {
    if (this.designs().length == 0) this.onLoadDesigns();
    return this.designs();
  }

  onSaveDesign(design: DesignLayout) {
    this.onResetZoomCanvas();
    const canvas = this.getCanvas();
    const htmlLayers = this.canvasHTMLLayers();
    const canvasData = canvas.toObject(['html', 'data', 'textBoxProp', 'rectProp']);
    const canvasObjects = canvasData.objects;

    const curDurations: number[] = [];
    canvasObjects.forEach((object: any) => {
      if (object.html) {
        const content: any = object.html.content;
        curDurations.push(content.duration);
      }
      if (object.data) curDurations.push(object.data.duration);
    })

    const maxDuration = Math.max(...curDurations);
    const curDuration = maxDuration > 0 ? maxDuration : 5;
    
    const tempData = this.designs();
    const { id, status, duration, ...info } = design;
    const index = tempData.findIndex(item => item.id == design.id);

    if (index !== -1) tempData[index] = { ...design, duration: curDuration, canvas: JSON.stringify(canvasData), htmlLayers, updatedOn: new Date() };
    else tempData.push({ id: tempData.length + 1, status: 'pending', duration: curDuration, ...info, 
      canvas: JSON.stringify(canvasData), htmlLayers, createdOn: new Date(), updatedOn: new Date(), approvedInfo: { approvedBy: '', approvedOn: null, remarks: '' } });

    this.designSignal.set([...tempData]);
    console.log(this.designSignal());
    
    this.totalRecords.set(this.designs().length);
    /**CALL POST API */
  }

  onEditDesign(canvasElement: HTMLCanvasElement, design: DesignLayout) {
    const { screen, canvas }: any = design;
    const [ width, height ] = screen.displaySettings.resolution.split('x').map(Number);
    
    const canvasData = JSON.parse(canvas);    
    const newCanvas = new fabric.Canvas(canvasElement, {
      width: width * this.DEFAULT_SCALE(), 
      height: height * this.DEFAULT_SCALE(), 
      backgroundColor: canvasData.background,
      selection: false,
      preserveObjectStacking: true,
    });
    

    this.setCanvas(newCanvas);
    newCanvas.loadFromJSON(canvasData, () => {
      setTimeout(() => {
        const objects = newCanvas.getObjects();        
        objects.forEach((obj: any, index: number) => { 
          if (obj.html) {
            const html: any = obj.html;
            const alreadyExists = this.canvasHTMLLayers().find(item => item.id == html.id);            
            if (!alreadyExists ) {
              const htmlLayer = this.createHtmlLayerFromObject(obj, html.id, html.content);
              const { loop, ...info } = htmlLayer.content;
              this.canvasHTMLLayers().push(htmlLayer);
              this.playlistService.onPlayContent(html.content)
            }
          } else if (obj.data) {
            const data: any = obj.data;
            if (data.type == 'video') { 
              this.onAddVideoToCanvas(data, obj);
              newCanvas.remove(obj);
            }
          }
        });
        
        this.registerCanvasEvents(newCanvas);
        this.registerAlignmentGuides(newCanvas);
        if (this.canvasHTMLLayers().length > 0) this.syncDivsWithFabric(newCanvas);
        newCanvas.requestRenderAll();
        
        this.saveState();        
      }, 50);
    });
  }

  onDeleteDesign(design: DesignLayout) { }

  onDuplicateDesign(design: DesignLayout) { }

  onCreateCanvas(canvasElement: HTMLCanvasElement, resolution: { width: number, height: number }, backgroundColor: string = '#ffffff') {
    const canvas = new fabric.Canvas(canvasElement, { 
      width: resolution.width * this.DEFAULT_SCALE(), 
      height: resolution.height * this.DEFAULT_SCALE(), 
      backgroundColor,
      selection: false,
      preserveObjectStacking: true,
    });

    this.registerCanvasEvents(canvas);
    this.setCanvas(canvas);
    this.registerAlignmentGuides(canvas);
    this.syncDivsWithFabric(canvas);
    canvas.renderAll();

    this.saveState();
  }

  /**
   * ====================================================================================================================================
   * Editor Tools
   * ====================================================================================================================================
   */

  onExitCanvas() {
    const canvas = this.getCanvas();
    if (canvas) {
      this.canvas.clear();
      this.canvas.dispose();
      this.canvas = undefined as any;
    }
    cancelAnimationFrame(this.animFrameId);
    this.designForm.reset();
    this.showContents.set(false);
    this.canvasHTMLLayers.set([]);
    this.playlistService.onStopAllContents();
  }

  onZoomCanvas(factor: number) {
    const canvas = this.getCanvas();
    const zoom = canvas.getZoom() * factor;
    const { width, height } = this.canvasDimensions(canvas);
    const canvasWidth = width * factor;
    const canvasHeight = height * factor;      

    if ((canvasWidth * zoom) <= 250) return;

    // Resize the canvas DOM and internal drawing buffer
    canvas.setDimensions({ width: canvasWidth, height: canvasHeight });

    // Scale every object proportionally
    canvas.getObjects().forEach(obj => {
      obj.scaleX! *= factor;
      obj.scaleY! *= factor;
      obj.left! *= factor;
      obj.top! *= factor;
      obj.setCoords();
    });

    canvas.renderAll();
    this.onSetCanvasProps('zoom', true, 'default');
  }

  onResetZoomCanvas() {
    const canvas = this.getCanvas();
    const { screen } = this.designForm.value;
    const [ width, height ] = screen.displaySettings.resolution.split('x');
    canvas.setDimensions({ width: width * this.DEFAULT_SCALE(), height: height * this.DEFAULT_SCALE() });
    // Scale every object proportionally
    canvas.getObjects().forEach(obj => {
      obj.scaleX = obj.scaleX! / canvas.getZoom();
      obj.scaleY = obj.scaleY! / canvas.getZoom();
      obj.left = obj.left! / canvas.getZoom();
      obj.top = obj.top! / canvas.getZoom();
      obj.setCoords();
    });
  }

  onSelection() {
    this.onSetCanvasProps('selection', true, 'default');
    this.onDisableLayersProps(true);
    this.showContents.set(false);
  }

  onPan() {
    this.onSetCanvasProps('drag', false, 'grab');
    this.canvas.discardActiveObject();
    this.onDisableLayersProps(false);
    this.showContents.set(false);
  }

  onMove() {
    this.onSetCanvasProps('move', false, 'pointer');
    this.canvas.discardActiveObject();
    this.onDisableLayersProps(true);
    this.showContents.set(false);
  }

  onChangeColor(color: string) {
    const activeObject: any = this.canvas.getActiveObjects();
    activeObject.forEach((object: fabric.Object) => {
      if (object.type === 'rect') object.set('fill', color);
    });
    this.canvas.requestRenderAll();
  }

  onCopyLayers(canvas: fabric.Canvas) {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.clone().then((cloned: fabric.Object) => {
      this.clipboard = cloned;
    })
  }

  onCutLayers(canvas: fabric.Canvas) {
    const activeObject = canvas.getActiveObjects();
    if (!activeObject || activeObject.length === 0) return;

    activeObject.map((object: fabric.Object) =>
      object.clone().then((cloned) => {
        this.clipboard = cloned;
        canvas.remove(object);
      })
    )

    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  onPasteLayers(canvas: fabric.Canvas) {
    if (!this.clipboard) return

    canvas.discardActiveObject();
    this.clipboard.clone().then((cloned: any) => {
      cloned.set({
        left: cloned.left += 10,
        top: cloned.top += 10,
        evented: true,
        selectable: true,
        ...this.SELECTION_STYLE()
      });
      cloned.setCoords();
      canvas.add(cloned);      
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
      this.saveState();
    });
  }

  onDuplicateLayer(canvas: fabric.Canvas) {
    const activeObject = canvas.getActiveObjects();
    if (!activeObject || activeObject.length === 0) return;

    const clones: fabric.Object[] = [];

    canvas.discardActiveObject();
    Promise.all(
      activeObject.map((object: fabric.Object) =>
        object.clone().then((cloned) => {
          cloned.set({
            left: object.left += 10,
            top: object.top += 10,
            evented: true,
            selectable: true,
            ...this.SELECTION_STYLE()
          });
          cloned.setCoords();
          canvas.add(cloned);
          clones.push(cloned);
        })
      )
    ).then(() => {
      const selection = new fabric.ActiveSelection(clones, { canvas });
      selection.setCoords();
      canvas.setActiveObject(selection);
      canvas.requestRenderAll();
    });
  }

  onSelectAllLayers(canvas: fabric.Canvas) {
    const objects = canvas.getObjects();
    if (objects && objects.length > 0) {
      const selection = new fabric.ActiveSelection(objects, { canvas });
      selection.set(this.SELECTION_STYLE());
      selection.setCoords();
      canvas.setActiveObject(selection);
      canvas.requestRenderAll();
    }
  }

  onUnSelectAllLayers(canvas: fabric.Canvas) {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  onRemoveLayer(canvas: fabric.Canvas) {
    const activeObject = canvas.getActiveObjects();
    if (!activeObject || activeObject.length === 0) return;

    canvas.remove(...activeObject);

    activeObject.forEach((obj: any) => {
      const html = obj.html;
      if (html) {
        this.canvasHTMLLayers().splice(obj.html.index, 1);
        this.playlistService.onStopContent(html.content.id);
      }
    });

    canvas.discardActiveObject();
    canvas.requestRenderAll();
    this.onSetCanvasProps('remove', false, 'default');
    this.saveState();
  }

  onUndoLayer() {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop()!;
      this.redoStack.push(currentState);

      const prevState = this.undoStack[this.undoStack.length - 1]!;
      this.restoreState(prevState);
    }
  }

  onRedoLayer() {
    if (this.redoStack.length > 0) {
      const state = this.redoStack.pop()!;
      this.undoStack.push(state);
      this.restoreState(state);
    }
  }

  onExportCanvas(canvas: fabric.Canvas) {
    const { name } = this.designForm.value;
    const canvasData = canvas.toObject(['html', 'data', 'textBoxProp', 'rectProp']);

    const length = this.designs().length + 1; 

    this.designForm.patchValue({ id: length, canvas: JSON.stringify(canvasData), htmlLayers: this.canvasHTMLLayers(),  createdOn: new Date() });
    const data = JSON.stringify(this.designForm.value);

    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  onImportCanvas(event: Event, canvasElement: HTMLCanvasElement) {
    if (this.canvas) this.canvas.dispose();
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data: any = e.target?.result as string;
      const importData: any = JSON.parse(data);
      this.designForm.patchValue(importData)
      
      this.onEditDesign(canvasElement, importData);
    }
    
    reader.readAsText(file);
  }

  /**
   * ====================================================================================================================================
   * Adding layers
   * Text, Rectangle, Image, Line, Video and HTML
   * ====================================================================================================================================
   */
  onAddTextToCanvas(content: string = 'Enter text here', fill: string = '#000000') {
    this.onSetCanvasProps('text', true, 'default');
    const tempText = new fabric.FabricText(content, { fontSize: 12, fontFamily: 'Arial', fill });

    this.canvas.discardActiveObject();    
    const { width, height } = this.canvasDimensions(this.canvas);
    const left = Math.random() * (width - tempText.width);
    const top = Math.random() * (height - tempText.height);
    const text = new fabric.Textbox(content, {
      left,
      top,
      fontSize: 12,
      fontFamily: 'Arial',
      fill,
      editable: true,
      width: tempText.width,
    })

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.onDisableLayersProps(true);
    this.showContents.set(false);
    this.saveState();
  }

  onAddRectangleToCanvas(color: string = '#808080') {
    this.onSetCanvasProps('rect', true, 'default');
    this.canvas.discardActiveObject();
    
    const rect = new fabric.Rect({
      width: 200,
      height: 100,
      fill: color
    });

    this.canvas.add(rect);
    this.onDisableLayersProps(true);
    this.showContents.set(false);
    this.saveState();
    this.saveState();
  }

  onAddShapeToCanvas(type: string, color: string = '#808080') {
    this.onSetCanvasProps('rect', true, 'default');
    this.canvas.discardActiveObject();

    let shape: any;
    switch (type) {
      case 'circle':
        shape = new fabric.Circle({ radius: 50, width: 100, height: 100, fill: color })
        break;
      case 'triangle':
        shape = new fabric.Triangle({ width: 100, height: 100, fill: color, left: 200, top: 100 });
        break;
      case 'ellipse':
        shape = new fabric.Ellipse({ rx: 50, ry: 25, width: 100, height: 100, fill: color });
        break;
      default:
        shape = new fabric.Rect({ width: 200, height: 100, fill: color });
        break;
    }

    this.canvas.add(shape);
    this.onDisableLayersProps(true);
    this.showContents.set(false);
    this.saveState();
  }

  onAddImageToCanvas(data: any) {
    const resolution: any = data?.fileDetails?.resolution ?? { width: 100, height: 100 };
    
    this.onSetCanvasProps('image', true, 'default');
    this.canvas.discardActiveObject();

    const { width, height } = this.canvasDimensions(this.canvas);
    const left = Math.random() * (width - resolution.width);
    const top = Math.random() * (height - resolution.height);
    
    fabric.FabricImage.fromURL(data.link, { }, { top, left, data }).then((image) => {
      this.canvas.add(image);
      this.canvas.setActiveObject(image);
      this.canvas.requestRenderAll();

      image.setControlsVisibility({ mtr: false, tl: false, tr: false, mt: false, ml: false, mb: false, mr: false,  bl: false,  });
      this.onDisableLayersProps(true);
      this.saveState();
    });
  }

  onAddVideoToCanvas(data: any, fabricObject?: fabric.Object | any) {
    const { width, height }: any = data.fileDetails.resolution;
    this.onSetCanvasProps('video', true, 'default');
    this.canvas.discardActiveObject();
    
    const video = document.createElement('video');
    const videoSource = document.createElement('source');

    video.appendChild(videoSource);
    videoSource.src = data.link;

    video.width = width;
    video.height = height;
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.load();
    video.play();

    const videoObj = new fabric.FabricImage(video, { 
      left: fabricObject?.left ?? 0,
      top: fabricObject?.top ?? 0,
      originX: fabricObject?.originX ?? 'top',
      originY: fabricObject?.originY ?? 'left',
      scaleX: fabricObject?.scaleX ?? 0.2,
      scaleY: fabricObject?.scaleY ?? 0.2,
      objectCaching: false,
      data,
    });

    videoObj.setControlsVisibility({ mtr: false, tl: false, tr: false, mt: false, ml: false, mb: false, mr: false,  bl: false,  });
    this.canvas.add(videoObj);

    this.onStartVideoRender();
    this.onDisableLayersProps(true);
    this.saveState();
  }

  onAddLineToCanvas(color: string = '#808080') {
    this.onSetCanvasProps('line', true, 'default');
    this.canvas.discardActiveObject();
    const line = new fabric.Line([50, 100, 250, 100], {
      stroke: color,
      strokeWidth: 1
    });

    this.canvas.add(line);
    this.canvas.setActiveObject(line);
    this.canvas.requestRenderAll();

    line.setControlsVisibility({ tl: false, tr: false, bl: false, br: false, mt: false, mb: false, });
    this.onDisableLayersProps(true);
    this.onDisableLayersProps(true);
    this.showContents.set(false);
    this.saveState();
  }

  onAddHTMLToCanvas(content: any) {
    this.onSetCanvasProps('content', true, 'default');
    const length: number = this.canvasHTMLLayers().length + 1;
    const rect = new fabric.Rect({
      left: 100 + length * 50,
      top: 100 + length * 50,
      width: 200,
      height: 100,
      fill: 'transparent',
      stroke: null,
      strokeWidth: 0,
      hasControls: true,
      selectable: true,
      lockRotation: true,
    });

    rect.setControlsVisibility({ mtr: false, tl: false, tr: false, mt: false, ml: false, mb: false, mr: false,  bl: false,  });

    this.canvas.add(rect);
    const htmlLayer = this.createHtmlLayerFromObject(rect, length, content);
    this.canvasHTMLLayers().push(htmlLayer);
    
    this.playlistService.onPlayContent(content);

    rect.set('html', htmlLayer);
    this.canvas.setActiveObject(rect);
    this.canvas.requestRenderAll();
    this.onDisableLayersProps(true);
    this.showContents.set(false);
    this.saveState();
  }

  /**
   * ====================================================================================================================================
   * Canvas Functions
   * ====================================================================================================================================
   */

  onSetCanvasProps(props: string, canvasSelection: boolean, cursor: string) {
    const keys = Object.keys(this.canvasProps);
    keys.forEach(key => this.canvasProps[key] = false);
    if (keys.includes(props)) this.canvasProps[props] = true;
    if (this.canvas) {
      this.canvas.selection = canvasSelection;
      this.canvas.defaultCursor = cursor;
    }
  }

  onLayerArrangement(position: string) {
    const object: any = this.canvas.getActiveObject();    
    switch (position) {
      case 'forward':
        this.canvas.bringObjectForward(object, true);
        break;
      case 'backward':
        this.canvas.sendObjectBackwards(object, true);
        break;
      case 'front':
        this.canvas.bringObjectToFront(object);
        break;
      default:
        this.canvas.sendObjectToBack(object);
        break;
    }
    this.canvas.discardActiveObject();
    this.canvas.setActiveObject(object);
    this.canvas.requestRenderAll();
  }

  onLayerAlignment(direction: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') {
    const canvas = this.getCanvas();
    
    const selected = canvas.getActiveObjects();
    if (selected.length < 2) return;
    
    const boundsList = selected.map(obj => ({ obj, bounds: obj.getBoundingRect() }));

    if (!boundsList.length) return;
    let refItem;

    switch (direction) {
      case 'left':
        refItem = boundsList.reduce((a, b) => b.bounds.left < a.bounds.left ? b : a);
        break;
      case 'center':
        refItem = boundsList.reduce((a, b) =>
          (b.bounds.left + b.bounds.width / 2) < (a.bounds.left + a.bounds.width / 2) ? b : a
        );
        break;
      case 'right':
        refItem = boundsList.reduce((a, b) =>
          (b.bounds.left + b.bounds.width) > (a.bounds.left + a.bounds.width) ? b : a
        );
        break;
      case 'top':
        refItem = boundsList.reduce((a, b) => b.bounds.top < a.bounds.top ? b : a);
        break;
      case 'middle':
        refItem = boundsList.reduce((a, b) =>
          (b.bounds.top + b.bounds.height / 2) < (a.bounds.top + a.bounds.height / 2) ? b : a
        );
        break;
      case 'bottom':
        refItem = boundsList.reduce((a, b) =>
          (b.bounds.top + b.bounds.height) > (a.bounds.top + a.bounds.height) ? b : a
        );
        break;
    }

    if (!refItem) return;
    const refBounds = refItem.bounds;
    
    boundsList.forEach(({ obj, bounds }) => {
      switch (direction) {
        case 'left':
          obj.left += refBounds.left - bounds.left;
          break;
        case 'center':
          obj.left += (refBounds.left + refBounds.width / 2) - (bounds.left + bounds.width / 2);
          break;
        case 'right':
          obj.left += (refBounds.left + refBounds.width) - (bounds.left + bounds.width);
          break;
        case 'top':
          obj.top += refBounds.top - bounds.top;
          break;
        case 'middle':
          obj.top += (refBounds.top + refBounds.height / 2) - (bounds.top + bounds.height / 2);
          break;
        case 'bottom':
          obj.top += (refBounds.top + refBounds.height) - (bounds.top + bounds.height);
          break;
      }
      obj.setCoords();
    });

    canvas.discardActiveObject();
    const newSelection = new fabric.ActiveSelection(selected, { canvas });
    canvas.setActiveObject(newSelection);
    canvas.requestRenderAll();
  }

  onLayerSpacing(axis: 'horizontal' | 'vertical') {
    const canvas = this.getCanvas();
    const selected = canvas.getActiveObjects();
    if (selected.length < 3) return; // need at least 3

    // 1) Capture bounds once (absolute AABB, includes rotation/scale)
    const items = selected.map(obj => ({ obj, b: obj.getBoundingRect() }));

    // 2) Sort by axis
    const sorted = items.sort((a, b) =>
      axis === 'horizontal' ? a.b.left - b.b.left : a.b.top - b.b.top
    );

    const first = sorted[0];
    const last  = sorted[sorted.length - 1];

    // 3) Compute available segment between extremes (first's far edge to last's near edge)
    const start = axis === 'horizontal' ? (first.b.left + first.b.width) : (first.b.top + first.b.height);
    const end   = axis === 'horizontal' ?  last.b.left                 :  last.b.top;

    const numGaps = sorted.length - 1;

    // 4) Sum widths/heights of all *middle* items (indices 1..n-2)
    const sumMiddleSizes = sorted.slice(1, -1).reduce((acc, it) =>
      acc + (axis === 'horizontal' ? it.b.width : it.b.height), 0
    );

    // 5) Gap size formula:
    // (end - start) = sumMiddleSizes + numGaps * gap
    const available = end - start;
    const gap = (available - sumMiddleSizes) / numGaps; // can be negative if things overlap

    // 6) Walk from left/top to right/bottom, placing each middle item
    let cursor = start; // this is the right/bottom edge of the "previous" piece initially

    for (let i = 1; i < sorted.length - 1; i++) {
      const it = sorted[i];
      const b  = it.b;

      // target left/top = cursor + gap
      const targetPos = cursor + gap;

      if (axis === 'horizontal') {
        // move by delta between current bounds.left and target left
        it.obj.left += (targetPos - b.left);
        it.obj.setCoords();
        cursor = targetPos + b.width; // update cursor to this item's right edge
      } else {
        it.obj.top += (targetPos - b.top);
        it.obj.setCoords();
        cursor = targetPos + b.height; // update cursor to this item's bottom edge
      }
    }

    // 7) Reselect so selection box fits new positions
    canvas.discardActiveObject();
    canvas.setActiveObject(new fabric.ActiveSelection(selected, { canvas }));
    canvas.requestRenderAll();
  }


  onDisableLayersProps(value: boolean) {
    const objects = this.canvas.getObjects();
    objects.forEach(object => { 
      object.selectable = value; 
      object.evented = value;
    });
  }

  onStartVideoRender() {
    const render = () => {      
      if (this.canvas) this.canvas.requestRenderAll();
      this.animFrameId = fabric.util.requestAnimFrame(render);
    }

    this.animFrameId = fabric.util.requestAnimFrame(render);
  }

  onUpdateTextProperty(value: any) {
    const { size, weight, italic, underline, alignment, color } = value;
    
    const activeObj: any = this.canvas.getActiveObject();
    if (!activeObj) return;
    
    activeObj.set({
      fontSize: size,
      fontWeight: !weight ? 'normal' : 'bold',
      fontStyle: italic ? 'italic' : 'normal',
      underline: underline,
      textAlign: alignment,
      fill: color,
      textBoxProp: value,
    })

    this.canvas.requestRenderAll();
  }

  onUpdateRectProperty(value: any) {
    const { color, transparent, style, strokeWidth } = value;
    const activeObj = this.canvas.getActiveObject();
    if (!activeObj) return;

    activeObj.set('strokeDashArray', undefined)
    switch (style) {
      case 'fill':
        activeObj.set({ stroke: 'transparent', fill: transparent ? 'transparent' : color, strokeWidth: 0, strokeUniform: false });
        break;
      case 'outline':
        activeObj.set({ stroke: color, strokeWidth, fill: 'transparent', strokeUniform: true });
        break;
      case 'dashed':
        activeObj.set('strokeDashArray', [5, 5]);
        activeObj.set({ fill: 'transparent', strokeUniform: true });
        break;
    }
    activeObj.set('rectProp', value);
    this.canvas.requestRenderAll();
  }

  onUpdateLineProperty(value: any) {
    const { color, strokeWidth } = value;
    const activeObj = this.canvas.getActiveObject();
    if (!activeObj) return;
    activeObj.set({ stroke: color, strokeWidth });
    activeObj.set('lineProp', value);
    this.canvas.requestRenderAll();
  }

  /**
   * ====================================================================================================================================
   * Private methods insert here
   * ====================================================================================================================================
   */
  private saveState() {
    const canvas = this.getCanvas();
    const canvasState: any = {
      canvas: JSON.stringify(canvas.toObject()),
      htmlLayers: JSON.stringify(this.canvasHTMLLayers()),
    }

    const lastState: any = this.undoStack[this.undoStack.length - 1];
    
    if (!lastState || lastState.canvas !== canvasState.canvas || lastState.htmlLayers !== canvasState.htmlLayers) {
      this.undoStack.push(canvasState);
      this.redoStack = [];
    }
  }

  private restoreState(state: any) {
    
    const { screen, color } = this.designForm.value;
    const [ width, height ] = screen.displaySettings.resolution.split('x');

    const canvas = this.getCanvas();
    this.isRestoringState.set(true);
    
    const canvasData = JSON.parse(state.canvas);
    
    canvas.setDimensions({ width: width * this.DEFAULT_SCALE(), height: height * this.DEFAULT_SCALE() });
    canvas.set({ backgroundColor: color });
    canvas.set('preserveObjectStacking', true);
    canvas.set('selection', false);

    canvas.loadFromJSON(canvasData, () => {
      canvas.requestRenderAll();
      // this.isRestoringState.set(false);
    })
      // this.syncDivsWithFabric(canvas);
    if (this.canvasHTMLLayers().length > 0) this.canvasHTMLLayers.set(JSON.parse(state.htmlLayers));

    // newCanvas.loadFromJSON(canvasData, () => {
    //   setTimeout(() => {
    //     const objects = newCanvas.getObjects();        
    //     objects.forEach((obj: any, index: number) => { 
    //       if (obj.html) {
    //         const html: any = obj.html;
    //         const alreadyExists = this.canvasHTMLLayers().find(item => item.id == html.id);
                  
    //         if (!alreadyExists ) {
    //           const htmlLayer = this.createHtmlLayerFromObject(obj, html.id, html.content);
    //           this.canvasHTMLLayers().push(htmlLayer);
    //         }
    //       } else if (obj.data) {
    //         const data: any = obj.data;
    //         if (data.type == 'video') { 
    //           this.onAddVideoToCanvas(data, obj);
    //           newCanvas.remove(obj);
    //         }
    //       }
    //     });
        
    //     this.registerCanvasEvents(newCanvas);
    //     this.registerAlignmentGuides(newCanvas);
    //     if (this.canvasHTMLLayers().length > 0) this.syncDivsWithFabric(newCanvas);
    //     newCanvas.requestRenderAll();
        
    //     this.saveState();        
    //   }, 50);
    // });
  }

  private canvasDimensions(canvas: fabric.Canvas) {
    return { width: canvas.getWidth(), height: canvas.getHeight() }
  }
  
  private syncDivsWithFabric(canvas: fabric.Canvas) {
    const events = [
      'object:added',
      'object:moving',
      'object:scaling',
      'object:rotating',
      'object:modified',
      'object:removed',
      'selection:created',
      'selection:updated',
      'selection:cleared',
      'after:render'
    ];

    events.forEach((event: any) =>
      canvas.on(event, () => {
        this.updateHtmlLayers()
      })
    );
  }

  private updateHtmlLayers() {
    this.canvasHTMLLayers().forEach((layer, index) => {
      const obj = layer.fabricObject;
      const updated = this.createHtmlLayerFromObject(obj, index, layer.content);

      Object.assign(layer, updated);
    });
  }

  private createHtmlLayerFromObject(obj: fabric.Object | any, id: any, content: any) {
    const width = (obj.width || 0) * (obj.scaleX || 1);
    const height = (obj.height || 0) * (obj.scaleY || 1);
    const angle = obj.angle || 0;
    const center = obj.getCenterPoint();

    const rad = fabric.util.degreesToRadians(angle);
    const offsetX = -width / 2;
    const offsetY = -height / 2;
    const rotatedX = offsetX * Math.cos(rad) - offsetY * Math.sin(rad);
    const rotatedY = offsetX * Math.sin(rad) + offsetY * Math.cos(rad);

    const topLeftX = center.x + rotatedX;
    const topLeftY = center.y + rotatedY;

    if (obj.html) obj.setControlsVisibility({ mtr: false, tl: false, tr: false, mt: false, ml: false, mb: false, mr: false, bl: false, });
    
    return {
      id,
      top: topLeftY,
      left: topLeftX,
      width,
      height,
      rotation: angle,
      content,
      fabricObject: obj,
    };
  }
  
  private registerCanvasEvents(canvas: fabric.Canvas): void {
    canvas.on('selection:created', (e) => {
      const selectedObjects = e.selected || [];
      if (selectedObjects.length === 0) return;

      if (selectedObjects.length > 1) {
        const activeSelection = canvas.getActiveObject() as fabric.ActiveSelection;
        if (activeSelection) {
          activeSelection.set(this.SELECTION_STYLE())
        }
      } else {
        const selected: any = e.selected?.[0];
        if (selected) {
          selected.set(this.SELECTION_STYLE());
          if (selected.type === 'image') {
            this.onSetCanvasProps('image', true, 'default');
          } else if (selected.type === 'textbox') {
            this.textPropsForm.patchValue(selected.textBoxProp)
            this.onSetCanvasProps('text', true, 'default');
          } else if (['rect', 'circle', 'triangle', 'ellipse'].includes(selected.type) && !selected.html) {
            this.rectPropsForm.patchValue(selected.rectProp)
            this.onSetCanvasProps('rect', true, 'default');
          } else if (selected.type == 'line') {
            this.rectPropsForm.patchValue(selected.lineProp)
            this.onSetCanvasProps('line', true, 'default');
          } else {
            this.onSetCanvasProps('content', true, 'default');
          }
        }
      }
    });

    canvas.on('selection:updated', (e) => {
      const selected: any = e.selected?.[0];      
      if (selected) {
        selected.set(this.SELECTION_STYLE());
        if (selected.type === 'image') {
          this.onSetCanvasProps('image', true, 'default');
        } else if (selected.type === 'textbox') {
          this.textPropsForm.patchValue(selected.textBoxProp)
          this.onSetCanvasProps('text', true, 'default');
        } else if (['rect', 'circle', 'triangle', 'ellipse'].includes(selected.type) && !selected.html) {
          this.rectPropsForm.patchValue(selected.rectProp)
          this.onSetCanvasProps('rect', true, 'default');
        } else if (selected.type == 'line') {
          this.rectPropsForm.patchValue(selected.lineProp)
          this.onSetCanvasProps('line', true, 'default');
        } else {
          this.onSetCanvasProps('content', true, 'default');
        }
      }
    });

    canvas.on('selection:cleared', () => {
      // this.onMove();
      this.textPropsForm.reset();
      this.rectPropsForm.reset();
      this.onSetCanvasProps('cleared', true, 'default');
    });

    // canvas.on('object:moving', (e) => {
    //   const selected = e.target;
    //   if (selected) {
    //     console.log(selected);
        
    //   }
    // })

    canvas.on('object:scaling', (e) => {
      const { width, height } = this.canvasDimensions(canvas);
      const obj: any = e.target;      
      if (!obj || !obj.html) return;
      
      const canvasWidth = width;
      const canvasHeight = height;

      const maxWidth = canvasWidth - (obj.left ?? 0);
      const maxHeight = canvasHeight - (obj.top ?? 0);

      const scaledWidth = obj.width! * obj.scaleX!;
      const scaledHeight = obj.height! * obj.scaleY!;

      const MIN_WIDTH = 200;
      const MIN_HEIGHT = 100;

      // ✅ Clamp minimum size
      if (scaledWidth < MIN_WIDTH) obj.scaleX = MIN_WIDTH / obj.width!;
      if (scaledHeight < MIN_HEIGHT)obj.scaleY = MIN_HEIGHT / obj.height!;

      // ✅ Clamp maximum size (canvas bounds)
      if (scaledWidth > maxWidth) obj.scaleX = maxWidth / obj.width!;
      if (scaledHeight > maxHeight) obj.scaleY = maxHeight / obj.height!;

      canvas.requestRenderAll();
    })
  }

  private registerAlignmentGuides(canvas: fabric.Canvas) {
    canvas.on('object:moving', (e) => {
      const { width, height } = this.canvasDimensions(canvas);
      const activeObject: any = e.target;
      if (!activeObject || !activeObject.html) return;

      this.clearGuides(canvas);

      const boundX = width - activeObject.getScaledWidth();
      const boundY = height - activeObject.getScaledHeight();

      activeObject.left = Math.max(0, Math.min(activeObject.left || 0, boundX));
      activeObject.top = Math.max(0, Math.min(activeObject.top || 0, boundY));

      const objects = canvas.getObjects().filter(o => o !== activeObject);
      const aCenter = activeObject.getCenterPoint();

      objects.forEach(obj => {
        const oCenter = obj.getCenterPoint();

        // Vertical alignment (center)
        if (Math.abs(aCenter.x - oCenter.x) < this.alignThreshold) {
          this.addVerticalGuide(canvas, oCenter.x);
        }

        // Horizontal alignment (center)
        if (Math.abs(aCenter.y - oCenter.y) < this.alignThreshold) {
          this.addHorizontalGuide(canvas, oCenter.y);
        }

        // Left alignment
        if (Math.abs((activeObject.left || 0) - (obj.left || 0)) < this.alignThreshold) {
          this.addVerticalGuide(canvas, obj.left || 0);
        }

        // Right alignment
        const aRight = (activeObject.left || 0) + (activeObject.width || 0) * (activeObject.scaleX || 1);
        const oRight = (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1);
        if (Math.abs(aRight - oRight) < this.alignThreshold) {
          this.addVerticalGuide(canvas, oRight);
        }

        // Top alignment
        if (Math.abs((activeObject.top || 0) - (obj.top || 0)) < this.alignThreshold) {
          this.addHorizontalGuide(canvas, obj.top || 0);
        }

        // Bottom alignment
        const aBottom = (activeObject.top || 0) + (activeObject.height || 0) * (activeObject.scaleY || 1);
        const oBottom = (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1);
        if (Math.abs(aBottom - oBottom) < this.alignThreshold) {
          this.addHorizontalGuide(canvas, oBottom);
        }
      });

      canvas.requestRenderAll();
    });

    canvas.on('mouse:up', () => {
      this.clearGuides(canvas);
      canvas.requestRenderAll();
    });
  }

  private addVerticalGuide(canvas: fabric.Canvas, x: number) {
    const guide = new fabric.Line([x, 0, x, canvas.getHeight()], {
      stroke: '#4BC0C0',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    });
    canvas.add(guide);
    this.guides.push({ line: guide });
  }

  private addHorizontalGuide(canvas: fabric.Canvas, y: number) {
    const guide = new fabric.Line([0, y, canvas.getWidth(), y], {
      stroke: '#4BC0C0',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false
    });
    canvas.add(guide);
    this.guides.push({ line: guide });
  }

  private clearGuides(canvas: fabric.Canvas) {
    this.guides.forEach(g => canvas.remove(g.line));
    this.guides = [];
  }
}
