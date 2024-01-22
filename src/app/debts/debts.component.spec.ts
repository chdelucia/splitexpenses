import { DebtsComponent } from './debts.component';
import { CurrencyService } from '@shared/services/currency.service';
import { UsersService } from '@users/shared/users.service';
import { DebtsService } from './shared/debts.service';
import { LoggerService } from '@core/services/logger.service';

describe('DebtsComponent sin testbed', () => {
  let component: DebtsComponent;
  let debtsServiceStub: Partial<DebtsService>;
  let userServiceStub: Partial<UsersService>;
  let currencyServiceStub: Partial<CurrencyService>;
  let loggerServiceStub: Partial<LoggerService>;

  beforeEach(() => {
    debtsServiceStub = {
      getDebts: jest.fn(),
      initialize: jest.fn(),
      getDebtTracing: jest.fn(),
    };
    userServiceStub = { getIterableUsers: jest.fn() };
    currencyServiceStub = { getCurrencySettings: jest.fn() };
    loggerServiceStub = { info: jest.fn() };

    component = new DebtsComponent(
      debtsServiceStub as DebtsService,
      userServiceStub as UsersService,
      currencyServiceStub as CurrencyService,
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init debts and subrcripbe to changes', () => {
    const spyDebttracing = jest
      .spyOn(debtsServiceStub, 'getDebtTracing')
      .mockReturnValue('test' as any);

    expect(spyDebttracing).toHaveBeenCalled();
  });

  it('should get currency settings from service', () => {
    const spyCurrency = jest.spyOn(currencyServiceStub, 'getCurrencySettings');
    const spyUser = jest.spyOn(userServiceStub, 'getIterableUsers');
    const spyDebts = jest.spyOn(debtsServiceStub, 'getDebts');

    expect(spyCurrency).toHaveBeenCalled();
    expect(spyUser).toHaveBeenCalled();
    expect(spyDebts).toHaveBeenCalled();
  });
});
