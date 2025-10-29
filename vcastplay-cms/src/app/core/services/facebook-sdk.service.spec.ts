import { TestBed } from '@angular/core/testing';

import { FacebookSDKService } from './facebook-sdk.service';

describe('FacebookSDKService', () => {
  let service: FacebookSDKService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacebookSDKService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
