import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenMonitoringComponent } from './screen-monitoring.component';

describe('ScreenMonitoringComponent', () => {
  let component: ScreenMonitoringComponent;
  let fixture: ComponentFixture<ScreenMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenMonitoringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
