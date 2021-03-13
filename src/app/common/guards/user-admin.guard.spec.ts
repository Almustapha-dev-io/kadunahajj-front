import { TestBed } from '@angular/core/testing';

import { UserAdminGuard } from './user-admin.guard';

describe('UserAdminGuard', () => {
  let guard: UserAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
