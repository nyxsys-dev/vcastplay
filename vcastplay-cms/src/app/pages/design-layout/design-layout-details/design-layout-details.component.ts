import { Component, ElementRef, HostListener, inject, signal, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayoutService } from '../../../core/services/design-layout.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ScreenSelectionComponent } from '../../../components/screen-selection/screen-selection.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { PlaylistService } from '../../../core/services/playlist.service';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { PlaylistMainPlayerComponent } from '../../playlist/playlist-main-player/playlist-main-player.component';

@Component({
  selector: 'app-design-layout-details',
  imports: [ PrimengUiModule, ComponentsModule, PlaylistMainPlayerComponent ],
  templateUrl: './design-layout-details.component.html',
  styleUrl: './design-layout-details.component.scss',
  providers: [ MessageService ]
})
export class DesignLayoutDetailsComponent {

  @ViewChild('screen') screenElement!: ScreenSelectionComponent;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('importFile') importFileElement!: ElementRef<HTMLInputElement>;
  @ViewChild(CdkDrag) cdkDrag!: CdkDrag;
  
  router = inject(Router);

  designLayoutService = inject(DesignLayoutService);
  playlistService = inject(PlaylistService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  
  showInfo = signal<boolean>(false);
  layoutItems: MenuItem[] = [
    {
      label: 'File',
      icon: 'pi pi-file',
      items: [
        { label: 'New', command: () => this.showCanvasSize.set(true), disabled: false, shortcut: 'Alt+Ctrl+N' },
        { label: 'Save', command: (event: any) => this.onClickSaveDesign(event), disabled: true, shortcut: 'Ctrl+S' },
        {  separator: true },
        { label: 'Import', command: () => this.onClickImportCanvas() },
        { label: 'Export', command: () => this.onClickExportCanvas(), disabled: true },
        { label: 'Info', command: () => this.showInfo.set(true), disabled: true },
        {  separator: true },
        { label: 'Exit', command: () => this.router.navigate(['/layout/design-layout-library']) },
      ]
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      items: [
        { label: 'Undo', command: () => this.onClickUndoLayer(), disabled: true, shortcut: 'Ctrl+Z' },
        { label: 'Redo', command: () => this.onClickRedoLayer(), disabled: true, shortcut: 'Ctrl+Y' },
        { label: 'Select All', command: () => this.onClickSelectAllLayers(), disabled: true, shortcut: 'Ctrl+A' },
        {  separator: true },
        { label: 'Cut', command: () => this.onClickCutLayer(), disabled: true, shortcut: 'Ctrl+X' },
        { label: 'Copy', command: () => this.onClickCopyLayer(), disabled: true, shortcut: 'Ctrl+C' },
        { label: 'Paste', command: () => this.onClickPasteLayer(), disabled: true, shortcut: 'Ctrl+V' },
      ]
    },
    {
      label: 'Layers',
      icon: 'pi pi-th-large',
      items: [
        { 
          label: 'New Layer', 
          childIcon: 'pi pi-chevron-right',
          items: [
            { label: 'Text', command: () => this.onClickAddLayer('text'), disabled: false },
            { label: 'Line', command: () => this.onClickAddLayer('line'), disabled: false },
            { label: 'Contents', command: () => this.onClickAddLayer('content'), disabled: false },
            {
              label: 'Shapes',
              childIcon: 'pi pi-chevron-right',
              items: [
                { label: 'Circle', command: () => this.onClickAddShape('circle'), disabled: false },
                { label: 'Rectangle', command: () => this.onClickAddShape('rectangle'), disabled: false },
                { label: 'Triangle', command: () => this.onClickAddShape('triangle'), disabled: false },
                { label: 'Ellipse', command: () => this.onClickAddShape('ellipse'), disabled: false },
              ]
            }
          ],
          disabled: true
        },
        { label: 'Duplicate', command: () => this.onClickDuplicateLayer(), disabled: true, shortcut: 'Ctrl+D' },
        { label: 'Delete', command: () => this.onClickRemoveLayer(), disabled: true, shortcut: 'Del' },
        { separator: true },
        { 
          label: 'Arrange',
          childIcon: 'pi pi-chevron-right',
          items: [
            { label: 'Bring to Front', command: () => this.onClickLayerArrangement('front'), disabled: false },
            { label: 'Send to Back', command: () => this.onClickLayerArrangement('back'), disabled: false },
            { label: 'Bring Forward', command: () => this.onClickLayerArrangement('forward'), disabled: false },
            { label: 'Send Backward', command: () => this.onClickLayerArrangement('backward'), disabled: false },
          ],
          disabled: true
        },
      ]
    }
  ];

  objectAlignments: any[] = [
    { label: 'Align Left', command: () => this.onClickLayerAlignment('left'), image: 'assets/icons/align-left.png' },
    { label: 'Align Center', command: () => this.onClickLayerAlignment('center'), image: 'assets/icons/align-center.png' },
    { label: 'Align Right', command: () => this.onClickLayerAlignment('right'), image: 'assets/icons/align-right.png' },
    { label: 'Spacing Center', command: () => this.onClickLayerSpacing('horizontal'), image: 'assets/icons/spacing-center.png' },
    { label: 'Align Top', command: () => this.onClickLayerAlignment('top'), image: 'assets/icons/align-top.png' },
    { label: 'Align Middle', command: () => this.onClickLayerAlignment('middle'), image: 'assets/icons/align-middle.png' },
    { label: 'Align Bottom', command: () => this.onClickLayerAlignment('bottom'), image: 'assets/icons/align-bottom.png' },
    { label: 'Spacing Middle', command: () => this.onClickLayerSpacing('vertical'), image: 'assets/icons/spacing-middle.png' },
  ]

  @HostListener('wheel', ['$event']) onWheel(event: WheelEvent) {
    if (!event.ctrlKey) return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.1 : 0.9;    
    if(this.canvasProps.zoom) this.designLayoutService.onZoomCanvas(factor);
  }

  @HostListener('document:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {   
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'n') {
      event.preventDefault();
      event.stopPropagation(); 
      this.showCanvasSize.set(true)
    }

    // Copy
    if ((event.key === 'c' && event.ctrlKey) && !this.showCanvasSize()) {
      event.preventDefault();
      event.stopPropagation(); 
      this.onClickCopyLayer();
    }

    // Cut
    if ((event.key === 'x' && event.ctrlKey) && !this.showCanvasSize()) {
      event.preventDefault();
      event.stopPropagation(); 
      this.onClickCutLayer();
    }

    // Paste
    if ((event.key === 'v' && event.ctrlKey) && !this.showCanvasSize()) {
      event.preventDefault();
      event.stopPropagation(); 
      this.onClickPasteLayer();
    }

    //Delete
    if (event.key === 'Delete' && !this.showCanvasSize()) this.onClickRemoveLayer();

    //Duplicate
    if ((event.key === 'd' && event.ctrlKey) && !this.showCanvasSize()) {
      event.preventDefault();
      event.stopPropagation(); 
      this.onClickDuplicateLayer();
    }

    //Select All
    if ((event.key === 'a' && event.ctrlKey) && !this.showCanvasSize()) {
      event.preventDefault();
      event.stopPropagation(); 
      this.onClickSelectAllLayers();
    }

    // Undo
    if ((event.key === 'z' && event.ctrlKey) && !this.showCanvasSize()) {
      event.preventDefault();
      event.stopPropagation(); 
      this.onClickUndoLayer();
    }

    // Redo
    if ((event.key === 'y' && event.ctrlKey) && !this.showCanvasSize()) {
      event.preventDefault();
      event.stopPropagation(); 
      this.onClickRedoLayer();
    }
  }
  
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.hasUnsavedData()) {
      $event.returnValue = true;
    }
  }

  hasUnsavedChanges!: () => boolean;

  ngOnInit() {
    this.designLayoutService.onGetDesigns();
  }

  ngOnDestroy() {
    this.isEditMode.set(false);
    this.playlistService.onStopAllContents();
    this.designLayoutService.onSetCanvasProps('exit', false, 'default');
    this.designLayoutService.onExitCanvas();
  }

  ngAfterViewInit() {
    if (this.isEditMode()) {
      this.designLayoutService.onEditDesign(this.canvasElement.nativeElement, this.designForm.value);
      this.onUpdateMenus();
    }
  }
  
  hasUnsavedData(): boolean {
    return this.designForm.invalid;
  }

  onClickCreateCanvas() {
    const { screen, color } = this.designForm.value;
    const resolution = screen.displaySettings.resolution.split('x');
    this.designLayoutService.onCreateCanvas(this.canvasElement.nativeElement, { width: resolution[0], height: resolution[1] }, color);
    this.showCanvasSize.set(false);
    this.screenElement.selectedScreen.set(null);
    this.onUpdateMenus();
    // this.designLayoutService.onDisableMenu();
  }

  onClickSaveDesign(event: Event) {
    if (this.designForm.invalid) return;
    
    this.confirmation.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to save changes?',
      header: 'Confirm Save',
      icon: 'pi pi-question-circle',
      acceptButtonProps: { label: 'Save' },
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
      accept: () => {
        this.message.add({ severity: 'success', summary: 'Success', detail: 'Design saved successfully!' });
        this.designLayoutService.onSaveDesign(this.designForm.value);
        this.router.navigate([ '/layout/design-layout-library' ]);
      },
    });
  }

  onClickAddLayer(type: string) {
    switch (type) {
      case 'text':
        this.designLayoutService.onAddTextToCanvas('Enter text here', this.selectedColor());
        break;
      case 'line':
        this.designLayoutService.onAddLineToCanvas(this.selectedColor());
        break;
      default:
        this.showContents.set(true);
        break;
    }
    this.onResetCanvasPosition();
    this.designLayoutService.onLayerArrangement('front');
  }
  
  onClickAddShape(type: string) {
    this.onResetCanvasPosition();
    this.designLayoutService.onAddShapeToCanvas(type, this.selectedColor());
  }

  onClickCloseCanvasSize() { 
    this.showCanvasSize.set(false);
    this.designForm.reset();
  }

  onClickZoom(factor: number) {
    this.designLayoutService.onZoomCanvas(factor);
  }

  onClickResetZoom() {
    this.designLayoutService.onResetZoomCanvas();
  }

  onClickLayerArrangement(position: string) {
    this.onResetCanvasPosition();
    this.designLayoutService.onLayerArrangement(position);
  }

  onClickLayerAlignment(position: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') {
    this.onResetCanvasPosition();
    this.designLayoutService.onLayerAlignment(position);
  }

  onClickLayerSpacing(axis: 'horizontal' | 'vertical') {
    this.onResetCanvasPosition();
    this.designLayoutService.onLayerSpacing(axis);
  }

  onClickCopyLayer() {
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onCopyLayers(canvas);
  }

  onClickCutLayer() {
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onCutLayers(canvas);
  }

  onClickPasteLayer() {
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onPasteLayers(canvas);
  }

  onClickDuplicateLayer() {
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onDuplicateLayer(canvas);
  }

  onClickSelectAllLayers() {
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onSelectAllLayers(canvas);
  }

  onClickRemoveLayer() {
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onRemoveLayer(canvas);
  }

  onClickUndoLayer() {  
    this.designLayoutService.onUndoLayer();
  }

  onClickRedoLayer() {
    this.designLayoutService.onRedoLayer();
  }

  onClickExportCanvas() {
    const canvas = this.designLayoutService.getCanvas();
    this.designLayoutService.onExportCanvas(canvas);
  }

  onClickImportCanvas() {
    this.importFileElement.nativeElement.click();
  }

  onSelectionChange(event: any) {
    if (!event) {
      this.designForm.patchValue({ screen: null });
      return;
    }
    this.designForm.patchValue({ screen: event });
  }

  onSelectedContentChange(event: any) {
    const { loop, type, ...info }: any = event;
    switch (type) {
      case 'image':
      case 'clipart':
        this.designLayoutService.onAddImageToCanvas(event);
        break;
      case 'playlist':
        this.designLayoutService.onAddHTMLToCanvas({ loop: true, type, ...info });
        break;
      default:
        this.designLayoutService.onAddVideoToCanvas(event);
        break;
    }
  }

  onDropped(event: any) {
    const { item: { data } } = event;    
    switch (data.type) {
      case 'image':
      case 'clipart':
        this.designLayoutService.onAddImageToCanvas(data);
        break;
      default:
        this.designLayoutService.onAddVideoToCanvas(data);
        break;
    }
  }

  onUpdateMenus() {
    this.layoutItems.forEach(menu => {
      const items = menu.items;
      if (items) {
        items.forEach(item => {
          if (item.label == 'Export') item.disabled = !this.isEditMode();
          else item.disabled = false;
        });
      }
    })
  }

  onImportFile(event: any) {
    this.isEditMode.set(true);
    this.designLayoutService.onImportCanvas(event, this.canvasElement.nativeElement);
    this.onUpdateMenus();
  }

  onResetCanvasPosition() {
    this.cdkDrag.reset();
  }

  get isEditMode() { return this.designLayoutService.isEditMode; }
  get designForm() { return this.designLayoutService.designForm; }
  get canvasProps() { return this.designLayoutService.canvasProps; }
  get showContents() { return this.designLayoutService.showContents; }
  get selectedColor() { return this.designLayoutService.selectedColor; }
  get showCanvasSize() { return this.designLayoutService.showCanvasSize; }
  get designFormValue() { return this.designLayoutService.designForm.value; }
  get canvasHTMLLayers() { return this.designLayoutService.canvasHTMLLayers; }

  get colors() { return this.utils.colors; }

  get isMobile() { return this.utils.isMobile(); }
  get isTablet() { return this.utils.isTablet(); }
}
