import { TestBed } from '@angular/core/testing';

import { ServiceIntakeService } from './service-intake.service';

describe('ServiceIntakeService', () => {
  let service: ServiceIntakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceIntakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
