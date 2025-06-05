import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceTagComponent } from './audience-tag.component';

describe('AudienceTagComponent', () => {
  let component: AudienceTagComponent;
  let fixture: ComponentFixture<AudienceTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienceTagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudienceTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
