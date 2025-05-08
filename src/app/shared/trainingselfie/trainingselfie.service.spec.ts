import { TestBed } from '@angular/core/testing';

import { TrainingselfieService } from './trainingselfie.service';

describe('TrainingselfieService', () => {
  let service: TrainingselfieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingselfieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
