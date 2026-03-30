import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DebtsService } from './debts.service';
import { UsersService } from '@users/shared/users.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { Expense, User } from '@shared/models';
import { provideMockStore } from '@ngrx/store/testing';

describe('DebtsService', () => {
  let debtsService: DebtsService;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
  };

  const mockExpense: Expense = {
    id: '1',
    title: 'Expense 1',
    cost: 100,
    date: 'string',
    paidBy: '1',
    sharedBy: ['1', '2'],
    originalCost: 23,
    settleBy: [],
    typeId: '7',
  };

  const initialState = {
    users: { users: { [mockUser.id]: mockUser } },
    expenses: { expenses: { [mockExpense.id]: mockExpense } }
  };

  beforeEach(() => {
    const usersServiceMock = {
      getUsers: jest.fn().mockReturnValue(of(initialState.users.users)),
      getIterableUsers: jest.fn().mockReturnValue(of([mockUser]))
    };

    const expensesServiceMock = {
      getIterableExpenses: jest.fn().mockReturnValue(of([mockExpense]))
    };

    TestBed.configureTestingModule({
      providers: [
        DebtsService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: ExpensesService, useValue: expensesServiceMock },
        provideMockStore({ initialState }),
      ],
    });

    debtsService = TestBed.inject(DebtsService);
  });

  it('should initialize debts and debtTracing', () => {
    expect(debtsService.getDebtTracing()).toBeDefined();
  });

  describe('getdebtTracing', () => {
    it('should return an observable of debtTracing', (done) => {
      debtsService.getDebtTracing().subscribe(result => {
        expect(Array.isArray(result)).toBe(true);
        done();
      });
    });
  });
});
