import { TestBed } from '@angular/core/testing';

import { EaseeApiService } from './easee-api.service';

describe('EaseeApiService', () => {
  let service: EaseeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EaseeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
