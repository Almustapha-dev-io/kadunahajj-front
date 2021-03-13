import { TestBed } from '@angular/core/testing';

import { InitiatorGuard } from './initiator.guard';

describe('InitiatorGuard', () => {
  let guard: InitiatorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InitiatorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
