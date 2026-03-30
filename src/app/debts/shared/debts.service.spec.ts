import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DebtsService } from './debts.service';
import { UsersService } from '@users/shared/users.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { Expense, User } from '@shared/models';
import { provideMockStore } from '@ngrx/store/testing';

describe('DebtsService', () => {
  let debtsService: DebtsService;
  let userServiceSpy: any;
  let expensesServiceSpy: any;

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

  beforeEach(() => {
    const usersServiceSpyObj = {
      getUsers: jest.fn().mockReturnValue(of({ [mockUser.id]: mockUser })),
    };

    const expensesServiceSpyObj = {
      getIterableExpenses: jest.fn().mockReturnValue(of([mockExpense])),
      getEnrichedDebts: jest.fn().mockReturnValue(of({})),
    };

    TestBed.configureTestingModule({
      providers: [
        DebtsService,
        { provide: UsersService, useValue: usersServiceSpyObj },
        { provide: ExpensesService, useValue: expensesServiceSpyObj },
        provideMockStore({
          initialState: {
            users: { users: {} },
            expenses: { expenses: {} },
            debts: { debts: {} },
          },
        }),
      ],
    });

    debtsService = TestBed.inject(DebtsService);
    userServiceSpy = TestBed.inject(UsersService);
    expensesServiceSpy = TestBed.inject(ExpensesService);
  });

  it('should initialize debts and debtTracing', () => {
    expect(debtsService['debts']).toEqual({});
    expect(debtsService['debtTracing']).toEqual([]);
  });

  describe('getDebts', () => {
    it('should return the debts map', (done) => {
      debtsService.getDebts().subscribe((debts) => {
        expect(debts).toEqual(debtsService['debts']);
        done();
      });
    });
  });

  describe('getdebtTracing', () => {
    it('should return the debtTracing array', () => {
      const debtTracing = debtsService.getDebtTracing();
      expect(debtTracing).toEqual(debtsService['debtTracing']);
    });
  });

  it('should create structure', async () => {
    await debtsService.createStructure({ [mockUser.id]: mockUser });
    expect(Object.keys(debtsService['debts']).length).toBe(1);
    expect(debtsService['debts'][mockUser.id]).toBeDefined();
  });

  it('should get trace debts', () => {
    const debtTracing = debtsService.getDebtTracing();
    expect(debtTracing).toEqual([]);
  });

  it('should get debts', (done) => {
    debtsService.getDebts().subscribe((debts) => {
      expect(debts).toEqual({});
      done();
    });
  });
});
