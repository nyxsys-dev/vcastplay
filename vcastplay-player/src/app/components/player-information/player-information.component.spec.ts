import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerInformationComponent } from './player-information.component';

describe('PlayerInformationComponent', () => {
  let component: PlayerInformationComponent;
  let fixture: ComponentFixture<PlayerInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
