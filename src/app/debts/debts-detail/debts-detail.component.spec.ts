import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtsDetailComponent } from './debts-detail.component';
import { UsersService } from '@users/shared/users.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DebtsDetailComponent', () => {
  let component: DebtsDetailComponent;
  let fixture: ComponentFixture<DebtsDetailComponent>;

  beforeEach(async () => {
    const mockUsersService = {
      getIterableUsers: jest.fn().mockReturnValue(of([])),
    };
    const mockCurrencyService = {
      getCurrencySettings: jest.fn().mockReturnValue({}),
    };
    const mockExpensesService = {
      getIterableExpenses: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [DebtsDetailComponent],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: ExpensesService, useValue: mockExpensesService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
