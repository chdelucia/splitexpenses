import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtsDetailComponent } from './debts-detail.component';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsersService } from '@users/shared/users.service';

describe('DebtsDetailComponent', () => {
  let component: DebtsDetailComponent;
  let fixture: ComponentFixture<DebtsDetailComponent>;

  beforeEach(async () => {
    const debtsServiceMock = {
      getIterableDebts: jest.fn().mockReturnValue(of([])),
    };
    const expensesServiceMock = {
      getIterableExpenses: jest.fn().mockReturnValue(of([])),
    };
    const currencyServiceMock = {
      getCurrencySettings: jest.fn().mockReturnValue({ currencySymbol: '€', active: false }),
    };
    const usersServiceMock = {
      getIterableUsers: jest.fn().mockReturnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, HttpClientTestingModule, DebtsDetailComponent],
      providers: [
        { provide: DebtsService, useValue: debtsServiceMock },
        { provide: ExpensesService, useValue: expensesServiceMock },
        { provide: CurrencyService, useValue: currencyServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
        provideMockStore()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DebtsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
