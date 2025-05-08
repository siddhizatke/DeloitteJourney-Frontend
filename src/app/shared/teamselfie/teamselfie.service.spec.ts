import { TestBed } from '@angular/core/testing';

import { TeamselfieService } from './teamselfie.service';

describe('TeamselfieService', () => {
  let service: TeamselfieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamselfieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
