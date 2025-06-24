import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceTagListComponent } from './audience-tag-list.component';

describe('AudienceTagListComponent', () => {
  let component: AudienceTagListComponent;
  let fixture: ComponentFixture<AudienceTagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienceTagListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudienceTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
