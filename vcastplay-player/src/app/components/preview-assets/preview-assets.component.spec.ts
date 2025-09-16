import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAssetsComponent } from './preview-assets.component';

describe('PreviewAssetsComponent', () => {
  let component: PreviewAssetsComponent;
  let fixture: ComponentFixture<PreviewAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
