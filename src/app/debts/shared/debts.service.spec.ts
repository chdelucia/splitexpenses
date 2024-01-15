import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DebtsService } from './debts.service';
import { UsersService } from '../../users/shared/users.service';
import { ExpensesService } from '../../expenses/shared/expenses.service';
import { Expense, User } from '../../shared/models/models';

describe('DebtsService', () => {
  let debtsService: DebtsService;
  let userServiceSpy: jasmine.SpyObj<UsersService>;
  let expensesServiceSpy: jasmine.SpyObj<ExpensesService>;

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
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers']);
    usersServiceSpy.getUsers.and.returnValue(
      of(new Map([[mockUser.id, mockUser]])),
    );

    let expensesServiceSpy = jasmine.createSpyObj('ExpensesService', [
      'getIterableExpenses',
    ]);
    expensesServiceSpy.getIterableExpenses.and.returnValue(of([mockExpense]));

    TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: ExpensesService, useValue: expensesServiceSpy },
      ],
    });

    debtsService = TestBed.inject(DebtsService);
    userServiceSpy = TestBed.inject(
      UsersService,
    ) as jasmine.SpyObj<UsersService>;
    expensesServiceSpy = TestBed.inject(
      ExpensesService,
    ) as jasmine.SpyObj<ExpensesService>;
  });

  it('should initialize debts and debtTracing', () => {
    expect(debtsService['debts']).toEqual(new Map());
    expect(debtsService['debtTracing']).toEqual([]);
  });

  describe('getDebts', () => {
    it('should return the debts map', () => {
      const debts = debtsService.getDebts();
      expect(debts).toEqual(debtsService['debts']);
    });
  });

  describe('getdebtTracing', () => {
    it('should return the debtTracing array', () => {
      const debtTracing = debtsService.getdebtTracing();
      expect(debtTracing).toEqual(debtsService['debtTracing']);
    });
  });

  it('should create structure', async () => {
    await debtsService.createStructure(new Map([[mockUser.id, mockUser]]));
    expect(debtsService['debts'].size).toBe(1);
    expect(debtsService['debts'].get(mockUser.id)).toBeDefined();
  });

  it('should get trace debts', () => {
    const debtTracing = debtsService.getdebtTracing();
    expect(debtTracing).toEqual([]);
  });

  it('should get debts', () => {
    const debts = debtsService.getDebts();
    expect(debts).toEqual(new Map());
  });
});
