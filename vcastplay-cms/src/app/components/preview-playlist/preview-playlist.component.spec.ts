import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPlaylistComponent } from './preview-playlist.component';

describe('PreviewPlaylistComponent', () => {
  let component: PreviewPlaylistComponent;
  let fixture: ComponentFixture<PreviewPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewPlaylistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
