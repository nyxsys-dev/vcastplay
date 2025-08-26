import { TestBed } from '@angular/core/testing';

import { ConfirmleaveService } from './confirmleave.service';

describe('ConfirmleaveService', () => {
  let service: ConfirmleaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmleaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
