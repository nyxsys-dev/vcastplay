import { Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { PrimengUiModule } from '../../../core/modules/primeng-ui/primeng-ui.module';
import { DesignLayoutService } from '../../../core/services/design-layout.service';
import { UtilityService } from '../../../core/services/utility.service';
import { ComponentsModule } from '../../../core/modules/components/components.module';
import { ScreenSelectionComponent } from '../../../components/screen-selection/screen-selection.component';
import * as fabric from 'fabric';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-design-layout-details',
  imports: [ PrimengUiModule, ComponentsModule ],
  templateUrl: './design-layout-details.component.html',
  styleUrl: './design-layout-details.component.scss'
})
export class DesignLayoutDetailsComponent {

  @ViewChild('screen') screenElement!: ScreenSelectionComponent;
  @ViewChild('canvas', { static: true }) canvasElement!: ElementRef<HTMLCanvasElement>;
  canvas!: fabric.Canvas;
  
  router = inject(Router);

  designLayoutService = inject(DesignLayoutService);
  utils = inject(UtilityService);
  
  layoutItems: MenuItem[] = [
    {
      label: 'File',
      icon: 'pi pi-file',
      items: [
        { label: 'New', command: () => this.showCanvasSize.set(true), disabled: false, shortcut: 'Alt+Ctrl+N' },
        {  separator: true },
        { label: 'Save', command: () => this.onClickSaveDesign(), disabled: false, shortcut: 'Ctrl+S' },
        { label: 'Save As', command: () => {}, disabled: true },
        {  separator: true },
        { label: 'Import', command: () => {}, disabled: true },
        { label: 'Export', command: () => {}, disabled: true },
        {  separator: true },
        { label: 'Print', command: () => {}, disabled: true, shortcut: 'Ctrl+P' },
        { label: 'Info', command: () => {}, disabled: true },
        {  separator: true },
        { label: 'Exit', command: () => {
          this.router.navigate(['/layout/design-layout-library']);
          this.designForm.reset();
        }},
      ]
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      items: [
        { label: 'Undo/Redo', command: () => {}, disabled: true, shortcut: 'Ctrl+Z' },
        {  separator: true },
        { label: 'Cut', command: () => {}, disabled: true, shortcut: 'Ctrl+X' },
        { label: 'Copy', command: () => {}, disabled: true, shortcut: 'Ctrl+C' },
        { label: 'Paste', command: () => {}, disabled: true, shortcut: 'Ctrl+V' },
        {  separator: true },
        { label: 'Properties', command: () => {}, disabled: true },
      ]
    },
    {
      label: 'Layers',
      icon: 'pi pi-th-large',
      items: [
        { label: 'New Layer', command: () => this.onClickNewLayer(), disabled: false, shortcut: 'Ctrl+L' },
        { label: 'Duplicate', command: () => {}, disabled: true, shortcut: 'Ctrl+D' },
        {  separator: true },
        { label: 'Delete', command: () => {}, disabled: true, shortcut: 'Del' },
      ]
    }
  ];

  @HostListener('wheel', ['$event']) onWheel(event: WheelEvent) {
    if (!event.ctrlKey || !this.canvas) return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.1 : 0.9;    
    this.designLayoutService.onZoomCanvas(this.canvas, factor);
  }

  @HostListener('document:keydown', ['$event']) onKeyDown(event: KeyboardEvent) {   
    if (event.ctrlKey && event.altKey && event.key.toLowerCase() === 'n') {
      event.preventDefault();
      event.stopPropagation(); 
      this.showCanvasSize.set(true)
    }
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  onClickCreateCanvas() {
    const { screen, color } = this.designForm.value;
    const resolution = screen.displaySettings.resolution.split('x');
    if (this.canvas) this.canvas.dispose();
    this.canvas = this.designLayoutService.onCreateCanvas(this.canvasElement.nativeElement, { width: resolution[0], height: resolution[1] }, color);
    this.canvas.renderAll();
    this.showCanvasSize.set(false);
    this.screenElement.selectedScreen.set(null);
    // this.designLayoutService.onDisableMenu();
  }

  onClickNewLayer() {
    this.designLayoutService.onAddTextToCanvas(this.canvas, 'New Layer');
  }

  onClickSaveDesign() {
    this.designLayoutService.onSaveCanvas(this.canvas);
  }

  onClickCloseCanvasSize() { 
    this.showCanvasSize.set(false);
    this.designForm.reset();
  }

  onClickZoom(factor: number) {
    this.designLayoutService.onZoomCanvas(this.canvas, factor);
  }

  onSelectionChange(event: any) {
    if (!event) {
      this.designForm.patchValue({ screen: null });
      return;
    }
    this.designForm.patchValue({ screen: event });
  }

  get isEditMode() { return this.designLayoutService.isEditMode; }
  get designForm() { return this.designLayoutService.designForm; }
  get showCanvasSize() { return this.designLayoutService.showCanvasSize; }

  get colors() { return this.utils.colors; }
}
