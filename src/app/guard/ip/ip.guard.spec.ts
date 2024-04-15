import { TestBed } from '@angular/core/testing';

import { IpGuard } from './ip.guard';

describe('IpGuard', () => {
  let guard: IpGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IpGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
