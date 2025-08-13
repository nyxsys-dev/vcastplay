import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLayoutContentsComponent } from './design-layout-contents.component';

describe('DesignLayoutContentsComponent', () => {
  let component: DesignLayoutContentsComponent;
  let fixture: ComponentFixture<DesignLayoutContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignLayoutContentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignLayoutContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
