import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewDesignLayoutComponent } from './preview-design-layout.component';

describe('PreviewDesignLayoutComponent', () => {
  let component: PreviewDesignLayoutComponent;
  let fixture: ComponentFixture<PreviewDesignLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewDesignLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewDesignLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
