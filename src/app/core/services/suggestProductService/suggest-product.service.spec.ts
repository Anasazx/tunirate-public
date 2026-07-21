import { TestBed } from '@angular/core/testing';

import { SuggestProductService } from './suggest-product.service';

describe('SuggestProductService', () => {
  let service: SuggestProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuggestProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
