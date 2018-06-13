import { TestBed, inject } from '@angular/core/testing';

import { CommonserviceService } from './commonservice.service';

describe('CommonserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonserviceService]
    });
  });

  it('should be created', inject([CommonserviceService], (service: CommonserviceService) => {
    expect(service).toBeTruthy();
  }));
});
