import { TestBed, inject } from '@angular/core/testing';

import { CheckVrrpServiceService } from './check-vrrp-service.service';

describe('CheckVrrpServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckVrrpServiceService]
    });
  });

  it('should be created', inject([CheckVrrpServiceService], (service: CheckVrrpServiceService) => {
    expect(service).toBeTruthy();
  }));
});
