import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewContentRendererComponent } from './preview-content-renderer.component';

describe('PreviewContentRendererComponent', () => {
  let component: PreviewContentRendererComponent;
  let fixture: ComponentFixture<PreviewContentRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewContentRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewContentRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
