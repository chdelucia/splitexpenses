import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsComponent } from './stats.component';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { UsersService } from '@users/shared/users.service';
import { signal } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  beforeEach(async () => {
    const mockExpensesService = {
      getTotalCost: jest.fn().mockReturnValue(0),
      getAverageCostPerDay: jest.fn().mockReturnValue(0),
      gettotalCostEachDayPerType: jest.fn().mockReturnValue({ labels: [], data: [] }),
      getExpensesByType: jest.fn().mockReturnValue({ labels: [], data: [] }),
    };
    const mockCurrencyService = {
      getCurrencySettings: jest.fn().mockReturnValue({}),
    };
    const mockUsersService = {
      iterableUsers: signal([]),
    };

    await TestBed.configureTestingModule({
      imports: [StatsComponent],
      providers: [
        { provide: ExpensesService, useValue: mockExpensesService },
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: UsersService, useValue: mockUsersService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
