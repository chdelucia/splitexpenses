import { DebtsComponent } from './debts.component';
import { CurrencyService } from '../shared/currency.service';
import { UsersService } from '../users/shared/users.service';
import { DebtsService } from './shared/debts.service';
import { of } from 'rxjs';
import { LoggerService } from '../core/services/logger.service';

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
      debtList$: of(true) as any,
    };
    userServiceStub = { getIterableUsers: jest.fn() };
    currencyServiceStub = { getCurrencySettings: jest.fn() };
    loggerServiceStub = { info: jest.fn() };

    component = new DebtsComponent(
      debtsServiceStub as DebtsService,
      userServiceStub as UsersService,
      currencyServiceStub as CurrencyService,
      loggerServiceStub as LoggerService,
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should destroy subscriptions', () => {
    const mockSubscription: any = { unsubscribe: jest.fn() };
    component['debtsSubscription'] = mockSubscription;

    component.ngOnDestroy();

    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should init debts and subrcripbe to changes', () => {
    const spyDebtInit = jest.spyOn(debtsServiceStub, 'initialize');
    const spyDebttracing = jest
      .spyOn(debtsServiceStub, 'getDebtTracing')
      .mockReturnValue('test' as any);

    component.ngOnInit();

    expect(spyDebtInit).toHaveBeenCalled();
    expect(spyDebttracing).toHaveBeenCalled();
    expect(component.debts).toBeTruthy();
    expect(component.debtTracing).toBe('test');
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
