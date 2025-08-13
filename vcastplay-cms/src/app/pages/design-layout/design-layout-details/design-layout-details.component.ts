import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayoutService } from '../../../core/services/design-layout.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ScreenSelectionComponent } from '../../../components/screen-selection/screen-selection.component';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { PlaylistService } from '../../../core/services/playlist.service';

@Component({
  selector: 'app-design-layout-details',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './design-layout-details.component.html',
  styleUrl: './design-layout-details.component.scss',
  providers: [ ConfirmationService, MessageService ]
})
export class DesignLayoutDetailsComponent {

  @ViewChild('screen') screenElement!: ScreenSelectionComponent;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  
  router = inject(Router);

  designLayoutService = inject(DesignLayoutService);
  playlistService = inject(PlaylistService);
  utils = inject(UtilityService);
  confirmation = inject(ConfirmationService);
  message = inject(MessageService);
  
  layoutItems: MenuItem[] = [
    {
      label: 'File',
      icon: 'pi pi-file',
      items: [
        { label: 'New', command: () => this.showCanvasSize.set(true), disabled: false, shortcut: 'Alt+Ctrl+N' },
        {  separator: true },
        { label: 'Save', command: (event: any) => this.onClickSaveDesign(event), disabled: false, shortcut: 'Ctrl+S' },
        { label: 'Save As', command: () => {}, disabled: true },
        {  separator: true },
        { label: 'Import', command: () => {}, disabled: true },
        { label: 'Export', command: () => {}, disabled: true },
        {  separator: true },
        { label: 'Print', command: () => {}, disabled: true, shortcut: 'Ctrl+P' },
        { label: 'Info', command: () => {}, disabled: true },
        {  separator: true },
        { label: 'Exit', command: () => {
          this.designLayoutService.onExitCanvas();
          this.router.navigate(['/layout/design-layout-library']);
        }},
      ]
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      items: [
        { label: 'Undo/Redo', command: () => {}, disabled: true, shortcut: 'Ctrl+Z' },
        { label: 'Select All', command: () => this.onClickSelectAllLayers(), disabled: false, shortcut: 'Ctrl+A' },
        {  separator: true },
        { label: 'Cut', command: () => {}, disabled: true, shortcut: 'Ctrl+X' },
        { label: 'Copy', command: () => {}, disabled: true, shortcut: 'Ctrl+C' },
        { label: 'Paste', command: () => {}, disabled: true, shortcut: 'Ctrl+V' },
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
            { label: 'Rectangle', command: () => this.onClickAddLayer('rectangle'), disabled: false },
            { label: 'Line', command: () => this.onClickAddLayer('line'), disabled: false },
            { label: 'Contents', command: () => this.onClickAddLayer('content'), disabled: false },
          ],
          // disabled: true
        },
        { label: 'Duplicate', command: () => this.onClickDuplicateLayer(), disabled: false, shortcut: 'Ctrl+D' },
        { label: 'Delete', command: () => this.onClickRemoveLayer(), disabled: false, shortcut: 'Del' },
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
          // disabled: true
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
  }  

  ngOnInit() { }

  ngOnDestroy() {
    this.designLayoutService.onExitCanvas();
    this.canvasHTMLLayers.set([]);
    if (this.playlistService.isPlaying()) this.playlistService.onStopPreview();
  }

  ngAfterViewInit() {
    if (this.isEditMode()) {
      this.designLayoutService.onEditDesign(this.canvasElement.nativeElement, this.designForm.value);
    }
  }

  onClickCreateCanvas() {
    const { screen, color } = this.designForm.value;
    const resolution = screen.displaySettings.resolution.split('x');
    this.designLayoutService.onCreateCanvas(this.canvasElement.nativeElement, { width: resolution[0], height: resolution[1] }, color);
    this.showCanvasSize.set(false);
    this.screenElement.selectedScreen.set(null);
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
        this.designForm.reset();
        this.isEditMode.set(false);
        this.canvasHTMLLayers.set([]);
        if (this.playlistService.isPlaying()) this.playlistService.onStopPreview();
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
      case 'rectangle':
        this.designLayoutService.onAddRectangleToCanvas(this.selectedColor());
        break;
      default:
        this.showContents.set(true);
        break;
    }
    this.designLayoutService.onLayerArrangement('front');
  }

  onClickCloseCanvasSize() { 
    this.showCanvasSize.set(false);
    this.designForm.reset();
  }

  onClickZoom(factor: number) {
    this.designLayoutService.onZoomCanvas(factor);
  }

  onClickLayerArrangement(position: string) {
    this.designLayoutService.onLayerArrangement(position);
  }

  onClickLayerAlignment(position: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') {
    this.designLayoutService.onLayerAlignment(position);
  }

  onClickLayerSpacing(axis: 'horizontal' | 'vertical') {
    this.designLayoutService.onLayerSpacing(axis);
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

  onSelectionChange(event: any) {
    if (!event) {
      this.designForm.patchValue({ screen: null });
      return;
    }
    this.designForm.patchValue({ screen: event });
  }

  onDropped(event: any) {
    const { item: { data } } = event;
    switch (data.type) {
      case 'image':
        this.designLayoutService.onAddImageToCanvas(data);
        break;
      default:
        this.designLayoutService.onAddVideoToCanvas(data);
        break;
    }
  }

  get isEditMode() { return this.designLayoutService.isEditMode; }
  get designForm() { return this.designLayoutService.designForm; }
  get canvasProps() { return this.designLayoutService.canvasProps; }
  get showContents() { return this.designLayoutService.showContents; }
  get selectedColor() { return this.designLayoutService.selectedColor; }
  get showCanvasSize() { return this.designLayoutService.showCanvasSize; }
  get canvasHTMLLayers() { return this.designLayoutService.canvasHTMLLayers; }

  get colors() { return this.utils.colors; }

  get isMobile() { return this.utils.isMobile(); }
  get isTablet() { return this.utils.isTablet(); }
}
