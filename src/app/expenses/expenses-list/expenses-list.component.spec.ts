import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ExpensesListComponent } from './expenses-list.component';
import { signal } from '@angular/core';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { UsersService } from '@users/shared/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from 'src/app/core/services/logger.service';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('ExpensesListComponent', () => {
  let component: ExpensesListComponent;
  let fixture: ComponentFixture<ExpensesListComponent>;

  beforeEach(async () => {
    const mockExpensesService = {
      expensesOrderByDateDescSignal: signal([]),
      getExpensesOrderByDatesDesc: jest.fn().mockReturnValue(of([])),
      deleteExpense: jest.fn(),
    };
    const mockCurrencyService = {
      getCurrencySettings: jest.fn().mockReturnValue({}),
    };
    const mockUsersService = {
      users: signal({}),
      getUsers: jest.fn().mockReturnValue(of({})),
    };
    const mockSnackBar = {
      open: jest.fn(),
    };
    const mockLoggerService = {
      info: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExpensesListComponent],
      providers: [
        provideNativeDateAdapter(),
        { provide: ExpensesService, useValue: mockExpensesService },
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
