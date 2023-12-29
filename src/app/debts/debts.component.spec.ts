import { DebtsComponent } from './debts.component';
import { CurrencyService } from '../shared/currency.service';
import { UsersService } from '../users/shared/users.service';
import { DebtsService } from './shared/debts.service';
import { of } from 'rxjs';

describe('DebtsComponent sin testbed', () => {
  let component: DebtsComponent;
  let debtsServiceStub: Partial<DebtsService>;
  let userServiceStub: Partial<UsersService>;
  let currencyServiceStub: Partial<CurrencyService>;

  beforeEach(() => {
    debtsServiceStub = {
      getDebts: jest.fn(),
      initialize: jest.fn(),
      getDebtTracing: jest.fn(),
      debtList$: of(true) as any
    };
    userServiceStub = { getIterableUsers: jest.fn() };
    currencyServiceStub = { getCurrencySettings: jest.fn() };

    component = new DebtsComponent(
      debtsServiceStub as DebtsService,
      userServiceStub as UsersService,
      currencyServiceStub as CurrencyService
      );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get currency settings from service', () => {
    const spyCurrency = jest.spyOn(currencyServiceStub,'getCurrencySettings');
    const spyUser = jest.spyOn(userServiceStub,'getIterableUsers');
    const spyDebts = jest.spyOn(debtsServiceStub,'getDebts');

    expect(spyCurrency).toHaveBeenCalled();
    expect(spyUser).toHaveBeenCalled();
    expect(spyDebts).toHaveBeenCalled();
  });


});
