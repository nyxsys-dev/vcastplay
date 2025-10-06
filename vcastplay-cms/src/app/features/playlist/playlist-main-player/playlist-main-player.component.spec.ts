import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistMainPlayerComponent } from './playlist-main-player.component';

describe('PlaylistMainPlayerComponent', () => {
  let component: PlaylistMainPlayerComponent;
  let fixture: ComponentFixture<PlaylistMainPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistMainPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistMainPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
