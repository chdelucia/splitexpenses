import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebtsComponent } from './debts.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CurrencyPlugin, Debt, User } from '../shared/models';
import { CurrencyService } from '../shared/currency.service';
import { UsersService } from '../users/shared/users.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DebtsService } from './shared/debts.service';

describe('DebtsComponent', () => {
  let component: DebtsComponent;
  let fixture: ComponentFixture<DebtsComponent>;
  let debtsServiceSpy: jasmine.SpyObj<DebtsService>;
  let userServiceSpy: jasmine.SpyObj<UsersService>;
  let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;
  let mockStore: MockStore;
  let initialState: any;

  beforeEach(() => {
    debtsServiceSpy = jasmine.createSpyObj('DebtsService', ['getDebts']);
    userServiceSpy = jasmine.createSpyObj('UsersService', ['getIterableUsers']);
    currencyServiceSpy = jasmine.createSpyObj('CurrencyService', ['getCurrencySettings', 'calcExchangeValue']);
    TestBed.configureTestingModule({
      declarations: [ DebtsComponent ],
      providers: [
        { provide: DebtsService, useValue: debtsServiceSpy },
        { provide: UsersService, useValue: userServiceSpy },
        { provide: CurrencyService, useValue: currencyServiceSpy },
        provideMockStore({ initialState }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(DebtsComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    initialState = {
      debts: new Map<string, Debt>(),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should get currency settings from service', () => {
    const currency: CurrencyPlugin = {
      currencySymbol: 'string',
      currencyExchangeSymbol: 'string',
      exchangeValue: 8,
      active: true
    };
    currencyServiceSpy.getCurrencySettings.and.returnValue(currency);
    expect(component.currency).toEqual(currency);
  });

  it('should calculate exchange value', () => {
    const exchangeRate = 0.85;
    const amount = 100;
    currencyServiceSpy.calcExchangeValue.and.returnValue(amount * exchangeRate);
    const result = component.calcExchange(amount);
    expect(result).toEqual(amount * exchangeRate);
  });
});
