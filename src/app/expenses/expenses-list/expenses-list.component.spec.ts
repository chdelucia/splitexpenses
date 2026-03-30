import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpensesListComponent } from './expenses-list.component';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { UsersService } from '@users/shared/users.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerService } from '@core/services/logger.service';

describe('ExpensesListComponent', () => {
  let component: ExpensesListComponent;
  let fixture: ComponentFixture<ExpensesListComponent>;

  beforeEach(async () => {
    const expensesServiceMock = {
      getExpensesOrderByDatesDesc: jest.fn().mockReturnValue(of([])),
      deleteExpense: jest.fn(),
    };
    const currencyServiceMock = {
      getCurrencySettings: jest.fn().mockReturnValue({ currencySymbol: '€', active: false }),
    };
    const usersServiceMock = {
      getUsers: jest.fn().mockReturnValue(of({})),
    };
    const loggerServiceMock = {
      info: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ExpensesListComponent, NoopAnimationsModule],
      providers: [
        { provide: ExpensesService, useValue: expensesServiceMock },
        { provide: CurrencyService, useValue: currencyServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
        { provide: LoggerService, useValue: loggerServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
