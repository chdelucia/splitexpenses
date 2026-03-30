import { TestBed } from '@angular/core/testing';
import { ExpensesService } from './expenses.service';
import {
  addExpense,
  removeExpense,
  updateExpense,
} from '@state/expenses/expenses.actions';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Expense } from '@shared/models';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

describe('ExpensesService', () => {
  let service: ExpensesService;
  let mockStore: MockStore;

  const initialState = {
    expenses: {
      expenses: {
        '1': expense1
      }
    },
  };

  beforeEach(() => {
    const localStorageSpy = {
      getData: jest.fn().mockReturnValue({ expenses: {} }),
      saveDataToLocalStorage: jest.fn(),
      getSettings: jest.fn().mockReturnValue({ graph: { types: {} } }),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ExpensesService,
        { provide: LocalstorageService, useValue: localStorageSpy },
        provideMockStore({ initialState }),
      ],
    });
    service = TestBed.inject(ExpensesService);
    mockStore = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addExpense', () => {
    it('should dispatch addExpense action', () => {
      const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
      const expense = { ...expense1, id: '' };

      service.addExpense(expense);

      expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
        type: addExpense.type
      }));
    });
  });

  describe('deleteExpense', () => {
    it('should dispatch removeExpense action', () => {
      const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
      service.deleteExpense('1');
      expect(dispatchSpy).toHaveBeenCalledWith(removeExpense({ id: '1' }));
    });
  });

  describe('editExpense', () => {
    it('should dispatch an updateExpense action', () => {
      const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
      service.editExpense(expense1);
      expect(dispatchSpy).toHaveBeenCalledWith(updateExpense({ expense: expense1 }));
    });
  });

  describe('getExpenseByID', () => {
    it('should return an observable of Expense', (done) => {
      service.getExpenseByID('1').subscribe(result => {
        expect(result).toEqual(expense1);
        done();
      });
    });
  });
});
