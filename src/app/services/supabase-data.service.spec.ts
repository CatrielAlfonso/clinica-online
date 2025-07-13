import { TestBed } from '@angular/core/testing';

import { SupabaseDataService } from './supabase-data.service';

describe('SupabaseDataService', () => {
  let service: SupabaseDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
