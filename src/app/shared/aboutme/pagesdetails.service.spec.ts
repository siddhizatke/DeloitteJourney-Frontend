import { TestBed } from '@angular/core/testing';
import { PagesdetailsService } from './pagesdetails.service'; // Adjust the path as needed


describe('PagesdetailsService', () => {
  let service: PagesdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagesdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
