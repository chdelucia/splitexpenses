import { TestBed, tick } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { firstValueFrom, from, fromEvent, Observable, of } from 'rxjs';
import { ExpensesService } from './expenses.service';
import {
  addExpense,
  addExpenses,
  removeExpense,
  updateExpense,
} from '@state/expenses/expenses.actions';
import {
  selectExpenses,
  selectIterableExpenses,
  selectExpensesFilterByType,
  selectExpensesDates,
  selectExpenseByID,
} from '@state/expenses/expenses.selectors';
import { LocalstorageService } from '@shared/services/localstorage.service';
import { Expense, Settings } from '@shared/models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

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

const expensesMap = new Map<string, Expense>();
expensesMap.set(expense1.id, expense1);
expensesMap.set(expense2.id, expense2);

const expensesList = [expense1, expense2];

const mockLocalStorageService = {
  getData: jasmine.createSpy('getData'),
  saveDataToLocalStorage: jasmine.createSpy('saveDataToLocalStorage'),
  getSettings: jasmine
    .createSpy('getSettings')
    .and.returnValue({ graph: { types: new Map() } }),
};

const mockStore = {
  dispatch: jasmine.createSpy('dispatch'),
  select: (selector: any): Observable<any> => {
    switch (selector) {
      case selectExpenses:
        return of(expensesMap);
      case selectIterableExpenses:
        return of(expensesList);
      case selectExpensesFilterByType('1'):
        return of([expense1]);
      case selectExpensesDates:
        return of(['2022-01-01']);
      case selectExpenseByID(expense1.id):
        return of(expense1);
      default:
        return of({});
    }
  },
};

const expensesMock = new Map([
  ['1', expense1],
  ['2', expense2],
]);

describe('ExpensesService', () => {
  let service: ExpensesService;
  let mockStore: MockStore;
  const initialState = {
    expenses: {
      ids: ['1', '2'],
      entities: {
        '1': {
          id: '1',
          name: 'Expense 1',
          originalCost: 100,
          cost: 50,
          date: '2022-03-23',
          paidBy: 'user1',
          sharedBy: ['user1', 'user2'],
          typeId: '1',
        },
        '2': {
          id: '2',
          name: 'Expense 2',
          originalCost: 200,
          cost: 100,
          date: '2022-03-24',
          paidBy: 'user2',
          sharedBy: ['user2'],
          typeId: '2',
        },
      },
      filter: null,
      dates: [],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExpensesService,
        LocalstorageService,
        provideMockStore({ initialState }),
      ],
    });
    service = TestBed.inject(ExpensesService);
    mockStore = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load expenses from local storage', async () => {
    spyOn(service, 'loadExpensesFromLocalStorage');
    service.loadExpensesFromLocalStorage();
    const result = service.loadExpensesFromLocalStorage();
    expect(result).toBeDefined();
    service.getExpenses().subscribe((expenses) => {
      expect(expenses.size).toBe(1);
      expect(expenses.get('1')?.title).toBe('Expense 1');
    });
  });

  describe('addExpense', () => {
    it('should dispatch addExpense action', async () => {
      spyOn(mockStore, 'dispatch').and.callThrough();
      spyOn(service, 'saveExpensesIntoLocalStorage').and.returnValue(
        Promise.resolve(),
      );
      const expense = {
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

      expect(mockStore.dispatch).toHaveBeenCalledWith(addExpense({ expense }));
      expect(service.saveExpensesIntoLocalStorage).toHaveBeenCalled();
    });
  });

  describe('deleteExpense', () => {
    it('should dispatch removeExpense action', () => {
      spyOn(mockStore, 'dispatch').and.callThrough();
      spyOn(service, 'saveExpensesIntoLocalStorage').and.returnValue(
        Promise.resolve(),
      );

      service.deleteExpense('1');

      expect(mockStore.dispatch).toHaveBeenCalledWith(
        removeExpense({ id: '1' }),
      );
      expect(service.saveExpensesIntoLocalStorage).toHaveBeenCalled();
    });
  });

  describe('getExpenses', async () => {
    it('should return expenses$', async () => {
      const expense = new Map<string, Expense>();
      expense.set('1', expense1);
      //spyOnProperty(service, 'expenses$').and.returnValue(expense1);
      spyOn(mockStore, 'select').and.returnValue(of(expense));
      const result = await firstValueFrom(service.getExpenses());
      expect(result).toEqual(expense);
    });
  });

  describe('editExpense', () => {
    it('should dispatch an updateExpense action and save expenses to local storage', () => {
      const expense = expense1;
      spyOn(mockStore, 'dispatch');
      spyOn(service, 'saveExpensesIntoLocalStorage');
      service.editExpense(expense1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        updateExpense({ expense }),
      );
      expect(service.saveExpensesIntoLocalStorage).toHaveBeenCalled();
    });
  });

  describe('getExpenseByID', () => {
    it('should return an observable of Expense or undefined', async () => {
      spyOn(mockStore, 'select').and.returnValue(of(expense1));
      const resutl = await firstValueFrom(service.getExpenseByID('1'));
      expect(resutl).toEqual(expense1);
    });
  });

  describe('getTotalPaidByUserToOthers', () => {
    it('should return 0 if the user has not paid for any expenses', () => {
      expect(service.getTotalPaidByUserToOthers('1')).toBe(0);
    });

    it('should return the total amount paid by the user if the user has only paid for their own expenses', () => {
      spyOn(mockStore, 'dispatch');
      service.addExpense(expense1);
      service.addExpense(expense2);
      expect(service.getTotalPaidByUserToOthers('1')).toBe(150);
    });
  });
});
