import { TestBed } from '@angular/core/testing';

import { CaptchatoggleService } from './captchatoggle.service';

describe('CaptchatoggleService', () => {
  let service: CaptchatoggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaptchatoggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
