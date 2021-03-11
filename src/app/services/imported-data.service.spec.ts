import { TestBed } from '@angular/core/testing';

import { ImportedDataService } from './imported-data.service';

describe('ImportedDataService', () => {
  let service: ImportedDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportedDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
