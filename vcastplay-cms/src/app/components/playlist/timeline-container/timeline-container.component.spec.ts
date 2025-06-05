import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineContainerComponent } from './timeline-container.component';

describe('TimelineContainerComponent', () => {
  let component: TimelineContainerComponent;
  let fixture: ComponentFixture<TimelineContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
