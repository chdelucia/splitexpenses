import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { ExpensesService } from './expenses.service';
import { ExpensesStore } from '@state/expenses/expenses.store';
import { UserStore } from '@state/user/user.store';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Expense } from '@shared/models';
import { HttpClient } from '@angular/common/http';

const expense1: Expense = {
  id: '1',
  title: 'Expense 1',
  cost: 10,
  sharedBy: ['1', '2'],
  typeId: '1',
  paidBy: '1',
  date: '2022-01-01',
  originalCost: 100,
  settleBy: [],
};

const expense2: Expense = {
  id: '2',
  title: 'Expense 2',
  cost: 5,
  sharedBy: ['1', '2'],
  typeId: '2',
  paidBy: '1',
  date: '2022-01-01',
  originalCost: 50,
  settleBy: [],
};

describe('ExpensesService', () => {
  let service: ExpensesService;
  let expensesStore: InstanceType<typeof ExpensesStore>;
  let userStore: InstanceType<typeof UserStore>;

  const mockLocalStorageService = {
    getData: jest.fn().mockReturnValue({ expenses: {} }),
    saveDataToLocalStorage: jest.fn(),
    getSettings: jest.fn().mockReturnValue({ graph: { types: {} } }),
  };

  const mockHttpClient = {
    get: jest.fn().mockReturnValue(of([])),
    post: jest.fn().mockReturnValue(of({})),
    put: jest.fn().mockReturnValue(of({})),
    delete: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExpensesService,
        ExpensesStore,
        UserStore,
        { provide: LocalstorageService, useValue: mockLocalStorageService },
        { provide: HttpClient, useValue: mockHttpClient },
      ],
    });
    service = TestBed.inject(ExpensesService);
    expensesStore = TestBed.inject(ExpensesStore);
    userStore = TestBed.inject(UserStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load expenses from local storage', () => {
    jest.spyOn(service, 'loadExpensesFromLocalStorage');
    service.loadExpensesFromLocalStorage();
    expect(service.loadExpensesFromLocalStorage).toHaveBeenCalled();
  });

  describe('addExpense', () => {
    it('should add expense to expenses store', () => {
      jest.spyOn(service, 'saveExpensesIntoLocalStorage').mockReturnValue();
      const expense: Expense = {
        id: '1',
        title: 'Expense Test',
        date: '2023-01-01',
        cost: 100,
        originalCost: 100,
        paidBy: 'user1',
        sharedBy: ['user1', 'user2'],
        typeId: '1',
        settleBy: [],
      };
      service.addExpense(expense);

      expect(expensesStore.expenses()['1']).toBeDefined();
      expect(service.saveExpensesIntoLocalStorage).toHaveBeenCalled();
    });
  });

  describe('deleteExpense', () => {
    it('should remove expense from store', () => {
      expensesStore.addExpense(expense1);
      jest.spyOn(service, 'saveExpensesIntoLocalStorage').mockReturnValue();

      service.deleteExpense('1');

      expect(expensesStore.expenses()['1']).toBeUndefined();
      expect(service.saveExpensesIntoLocalStorage).toHaveBeenCalled();
    });
  });

  describe('getExpenses', () => {
    it('should return expenses$', async () => {
      expensesStore.addExpense(expense1);
      const result = await firstValueFrom(service.getExpenses());
      expect(result).toEqual({ '1': expense1 });
    });
  });

  describe('editExpense', () => {
    it('should update expense in store and save to local storage', () => {
      expensesStore.addExpense(expense1);
      jest.spyOn(service, 'saveExpensesIntoLocalStorage').mockReturnValue();

      const updatedExpense = { ...expense1, title: 'Updated' };
      service.editExpense(updatedExpense);

      expect(expensesStore.expenses()['1'].title).toBe('Updated');
      expect(service.saveExpensesIntoLocalStorage).toHaveBeenCalled();
    });
  });

  describe('getExpenseByID', () => {
    it('should return an observable of Expense or undefined', async () => {
      expensesStore.addExpense(expense1);
      const result = await firstValueFrom(service.getExpenseByID('1'));
      expect(result).toEqual(expense1);
    });
  });

  describe('getTotalPaidByUserToOthers', () => {
    it('should return 0 if the user has not paid for any expenses', () => {
      expect(service.getTotalPaidByUserToOthers('1')).toBe(0);
    });

    it('should return total paid by user to others', () => {
      expensesStore.addExpenses({ '1': expense1, '2': expense2 });
      expect(service.getTotalPaidByUserToOthers('1')).toBe(135);
    });
  });
});
