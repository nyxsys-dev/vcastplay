import { TestBed } from '@angular/core/testing';

import { YoutubeSdkService } from './youtube-sdk.service';

describe('YoutubeSdkService', () => {
  let service: YoutubeSdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubeSdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
