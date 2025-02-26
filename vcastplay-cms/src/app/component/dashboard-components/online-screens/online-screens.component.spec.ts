import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineScreensComponent } from './online-screens.component';

describe('OnlineScreensComponent', () => {
  let component: OnlineScreensComponent;
  let fixture: ComponentFixture<OnlineScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineScreensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
