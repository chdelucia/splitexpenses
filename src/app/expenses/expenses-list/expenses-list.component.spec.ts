import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensesListComponent } from './expenses-list.component';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { UsersService } from '@users/shared/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoggerService } from '@core/services/logger.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';

describe('ExpensesListComponent', () => {
  let component: ExpensesListComponent;
  let fixture: ComponentFixture<ExpensesListComponent>;

  beforeEach(async () => {
    const expensesServiceSpy = {
      getEnrichedExpensesOrderByDatesDesc: jest.fn().mockReturnValue(of([])),
      deleteExpense: jest.fn(),
    };
    const currencyServiceSpy = {
      getCurrencySettings: jest.fn().mockReturnValue({}),
    };
    const usersServiceSpy = {
      getNumberOfUser: jest.fn().mockReturnValue(of(0)),
    };
    const loggerServiceSpy = {
      info: jest.fn(),
    };
    const snackBarSpy = {
      open: jest.fn(),
    };
    const routerSpy = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExpensesListComponent, NoopAnimationsModule],
      providers: [
        { provide: ExpensesService, useValue: expensesServiceSpy },
        { provide: CurrencyService, useValue: currencyServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: LoggerService, useValue: loggerServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
        provideMockStore({
          initialState: {
            expenses: { expenses: {} },
            users: { users: {} },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
