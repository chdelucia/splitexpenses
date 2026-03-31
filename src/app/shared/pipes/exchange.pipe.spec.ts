import { ExchangePipe } from './exchange.pipe';
import { CurrencyService } from '@shared/services';

describe('ExchangePipe', () => {
  it('create an instance', () => {
    const currencyServiceSpy = {} as CurrencyService;
    const pipe = new ExchangePipe(currencyServiceSpy);
    expect(pipe).toBeTruthy();
  });
});
