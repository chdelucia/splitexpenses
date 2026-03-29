import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { of } from 'rxjs';
import { UsersService } from '@users/shared/users.service';
import { ExpensesService } from '@expenses/shared/expenses.service';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    const mockUsersService = { getUsers: jest.fn().mockReturnValue(of({})) };
    const mockExpensesService = {
      getExpenses: jest.fn().mockReturnValue(of({})),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: ExpensesService, useValue: mockExpensesService },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true', (done) => {
    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    );
    if (typeof result === 'boolean') {
      expect(result).toBe(true);
      done();
    } else {
      (result as any).subscribe((val: boolean) => {
        expect(val).toBe(true);
        done();
      });
    }
  });
});
