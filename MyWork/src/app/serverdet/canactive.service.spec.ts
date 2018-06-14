import { TestBed, inject } from '@angular/core/testing';

import { CanactiveService } from './canactive.service';

describe('CanactiveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanactiveService]
    });
  });

  it('should be created', inject([CanactiveService], (service: CanactiveService) => {
    expect(service).toBeTruthy();
  }));
});
