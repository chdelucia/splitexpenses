import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { UsersService } from '@users/shared/users.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { signal } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn,
} from '@angular/router';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    const usersServiceSpy = { getUsers: jest.fn().mockReturnValue(signal({})) };
    const expensesServiceSpy = {
      getExpenses: jest.fn().mockReturnValue(signal({})),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: ExpensesService, useValue: expensesServiceSpy },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow activation', () => {
    const result = executeGuard(
      {} as ActivatedRouteSnapshot,
      {
        url: 'test',
      } as RouterStateSnapshot,
    );
    expect(result).toBe(true);
  });
});
