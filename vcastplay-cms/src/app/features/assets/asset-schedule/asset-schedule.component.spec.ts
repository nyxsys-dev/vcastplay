import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetScheduleComponent } from './asset-schedule.component';

describe('AssetScheduleComponent', () => {
  let component: AssetScheduleComponent;
  let fixture: ComponentFixture<AssetScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
