import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalScreensComponent } from './total-screens.component';

describe('TotalScreensComponent', () => {
  let component: TotalScreensComponent;
  let fixture: ComponentFixture<TotalScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalScreensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
