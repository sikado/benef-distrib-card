import { TestBed } from '@angular/core/testing';

import { CanvaService } from './canva.service';

describe('CanvaService', () => {
  let service: CanvaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
