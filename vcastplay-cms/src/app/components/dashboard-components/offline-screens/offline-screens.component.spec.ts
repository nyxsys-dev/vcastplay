import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineScreensComponent } from './offline-screens.component';

describe('OfflineScreensComponent', () => {
  let component: OfflineScreensComponent;
  let fixture: ComponentFixture<OfflineScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineScreensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfflineScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
