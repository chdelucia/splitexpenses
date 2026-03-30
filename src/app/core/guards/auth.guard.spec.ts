import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { UsersService } from '@users/shared/users.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { of } from 'rxjs';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn,
} from '@angular/router';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    const usersServiceSpy = { getUsers: jest.fn().mockReturnValue(of({})) };
    const expensesServiceSpy = {
      getExpenses: jest.fn().mockReturnValue(of({})),
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

  it('should allow activation', (done) => {
    const result = executeGuard({} as ActivatedRouteSnapshot, {
      url: 'test',
    } as RouterStateSnapshot);
    if (typeof result === 'boolean') {
      expect(result).toBe(true);
      done();
    } else {
      (result as any).subscribe((res: boolean) => {
        expect(res).toBe(true);
        done();
      });
    }
  });
});
