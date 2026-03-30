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
    const usersServiceSpy = {
      getIterableUsers: jest.fn().mockReturnValue(of([])),
    };
    const currencyServiceSpy = {
      getCurrencySettings: jest.fn().mockReturnValue({}),
    };
    const expensesServiceSpy = {
      getEnrichedExpenses: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      declarations: [DebtsDetailComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: CurrencyService, useValue: currencyServiceSpy },
        { provide: ExpensesService, useValue: expensesServiceSpy },
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
