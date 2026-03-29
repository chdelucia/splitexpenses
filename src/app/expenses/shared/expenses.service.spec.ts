import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { ExpensesService } from './expenses.service';
import {
  addExpense,
  removeExpense,
  updateExpense,
} from '@state/expenses/expenses.actions';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Expense } from '@shared/models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

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
  let mockStore: MockStore;
  const initialState = {
    expenses: {
      expenses: {
        '1': expense1,
        '2': expense2,
      },
    },
  };

  beforeEach(() => {
    const mockLocalStorageService = {
      getData: jest.fn().mockReturnValue({ expenses: {} }),
      saveDataToLocalStorage: jest.fn(),
      getSettings: jest.fn().mockReturnValue({ graph: { types: {} } }),
    };

    TestBed.configureTestingModule({
      providers: [
        ExpensesService,
        { provide: LocalstorageService, useValue: mockLocalStorageService },
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(ExpensesService);
    mockStore = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addExpense', () => {
    it('should dispatch addExpense action', async () => {
      jest.spyOn(mockStore, 'dispatch');
      jest
        .spyOn(service, 'saveExpensesIntoLocalStorage')
        .mockReturnValue(undefined);
      const expense = { ...expense1, id: 'new' };
      service.addExpense(expense);

      expect(mockStore.dispatch).toHaveBeenCalledWith(addExpense({ expense }));
    });
  });

  describe('deleteExpense', () => {
    it('should dispatch removeExpense action', () => {
      jest.spyOn(mockStore, 'dispatch');
      jest
        .spyOn(service, 'saveExpensesIntoLocalStorage')
        .mockReturnValue(undefined);

      service.deleteExpense('1');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        removeExpense({ id: '1' }),
      );
    });
  });

  describe('getExpenses', () => {
    it('should return expenses', async () => {
      const result = await firstValueFrom(service.getExpenses());
      expect(result).toBeDefined();
    });
  });

  describe('editExpense', () => {
    it('should dispatch an updateExpense action', () => {
      const expense = expense1;
      jest.spyOn(mockStore, 'dispatch');
      jest
        .spyOn(service, 'saveExpensesIntoLocalStorage')
        .mockReturnValue(undefined);
      service.editExpense(expense1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        updateExpense({ expense }),
      );
    });
  });

  describe('getExpenseByID', () => {
    it('should return an observable of Expense or undefined', async () => {
      const result = await firstValueFrom(service.getExpenseByID('1'));
      expect(result).toEqual(expense1);
    });
  });
});
