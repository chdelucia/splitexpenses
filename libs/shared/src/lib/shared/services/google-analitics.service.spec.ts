import { TestBed } from '@angular/core/testing';

import { GoogleAnaliticsService } from './google-analitics.service';

describe('GoogleAnaliticsService', () => {
  let service: GoogleAnaliticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAnaliticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
