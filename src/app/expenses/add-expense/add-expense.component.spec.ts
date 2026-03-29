import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddExpenseComponent } from './add-expense.component';
import { provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { UsersService } from '@users/shared/users.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { signal } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('AddExpenseComponent', () => {
  let component: AddExpenseComponent;
  let fixture: ComponentFixture<AddExpenseComponent>;
  const initialState = {
    expenses: {
      '1': { id: '1', title: 'Expense 1', cost: 10, sharedBy: [] },
      '2': { id: '2', title: 'Expense 2', cost: 20, sharedBy: [] },
    },
  };

  beforeEach(async () => {
    const mockExpensesService = {
      getExpensesTypes: jest.fn().mockReturnValue([]),
      getExpenseByID: jest.fn().mockReturnValue(of(undefined)),
      addExpense: jest.fn(),
      editExpense: jest.fn(),
    };
    const mockUsersService = {
      getIterableUsers: jest.fn().mockReturnValue(of([])),
      users: signal({}),
    };
    const mockCurrencyService = {
      getCurrencySettings: jest.fn().mockReturnValue({}),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, AddExpenseComponent],
      providers: [
        provideNativeDateAdapter(),
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => null } },
            paramMap: of({ get: () => null }),
          },
        },
        { provide: ExpensesService, useValue: mockExpensesService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: CurrencyService, useValue: mockCurrencyService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
