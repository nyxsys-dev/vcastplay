import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrubberTimelineComponent } from './scrubber-timeline.component';

describe('ScrubberTimelineComponent', () => {
  let component: ScrubberTimelineComponent;
  let fixture: ComponentFixture<ScrubberTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrubberTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrubberTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
