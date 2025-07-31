import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenInventoryComponent } from './screen-inventory.component';

describe('ScreenInventoryComponent', () => {
  let component: ScreenInventoryComponent;
  let fixture: ComponentFixture<ScreenInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
