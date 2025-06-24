import { TestBed } from '@angular/core/testing';

import { AudienceTagService } from './audience-tag.service';

describe('AudienceTagService', () => {
  let service: AudienceTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudienceTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
