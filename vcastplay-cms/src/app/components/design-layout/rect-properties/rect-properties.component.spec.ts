import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectPropertiesComponent } from './rect-properties.component';

describe('RectPropertiesComponent', () => {
  let component: RectPropertiesComponent;
  let fixture: ComponentFixture<RectPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RectPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RectPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
