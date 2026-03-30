import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtsComponent } from './debts.component';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { UsersService } from '@users/shared/users.service';
import { DebtsService } from './shared/debts.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DebtsComponent', () => {
  let component: DebtsComponent;
  let fixture: ComponentFixture<DebtsComponent>;
  let debtsServiceSpy: jest.Mocked<DebtsService>;
  let usersServiceSpy: jest.Mocked<UsersService>;
  let currencyServiceSpy: jest.Mocked<CurrencyService>;

  beforeEach(async () => {
    debtsServiceSpy = {
      getEnrichedDebts: jest.fn().mockReturnValue(of({})),
      getDebtTracing: jest.fn().mockReturnValue([]),
    } as any;

    usersServiceSpy = {
      getIterableUsers: jest.fn().mockReturnValue(of([])),
    } as any;

    currencyServiceSpy = {
      getCurrencySettings: jest.fn().mockReturnValue({
        currencySymbol: '€',
        active: false,
        currencyExchangeSymbol: '$',
      }),
    } as any;

    await TestBed.configureTestingModule({
      imports: [DebtsComponent],
      providers: [
        { provide: DebtsService, useValue: debtsServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: CurrencyService, useValue: currencyServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DebtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize debts signal', () => {
    expect(debtsServiceSpy.getEnrichedDebts).toHaveBeenCalled();
    expect(component.debts()).toEqual({});
  });

  it('should initialize users signal', () => {
    expect(usersServiceSpy.getIterableUsers).toHaveBeenCalled();
    expect(component.users()).toEqual([]);
  });

  it('should get currency settings', () => {
    expect(currencyServiceSpy.getCurrencySettings).toHaveBeenCalled();
    expect(component.currency).toEqual({
      currencySymbol: '€',
      active: false,
      currencyExchangeSymbol: '$',
    });
  });
});
