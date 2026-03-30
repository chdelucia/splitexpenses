import { TestBed } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { UsersService } from '@users/shared/users.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { of } from 'rxjs';

describe('authGuard', () => {
  beforeEach(() => {
    const usersServiceMock = { getUsers: jest.fn().mockReturnValue(of({})) };
    const expensesServiceMock = { getExpenses: jest.fn().mockReturnValue(of({})) };

    TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: ExpensesService, useValue: expensesServiceMock },
      ]
    });
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });
});
