import { TestBed } from '@angular/core/testing';

import { TrainingdetailsService } from './trainingdetails.service';

describe('TrainingdetailsService', () => {
  let service: TrainingdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
