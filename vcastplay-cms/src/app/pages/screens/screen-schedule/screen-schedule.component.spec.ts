import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenScheduleComponent } from './screen-schedule.component';

describe('ScreenScheduleComponent', () => {
  let component: ScreenScheduleComponent;
  let fixture: ComponentFixture<ScreenScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
