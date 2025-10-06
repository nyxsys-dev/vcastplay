import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistListItemComponent } from './playlist-list-item.component';

describe('PlaylistListItemComponent', () => {
  let component: PlaylistListItemComponent;
  let fixture: ComponentFixture<PlaylistListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
