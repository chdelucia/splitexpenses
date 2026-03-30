import { ExchangePipe } from './exchange.pipe';
import { CurrencyService } from '../services/currency/currency.service';

describe('ExchangePipe', () => {
  it('create an instance', () => {
    const currencyServiceMock = {
      getCurrencySettings: jest.fn().mockReturnValue({ exchangeValue: 1.1 })
    } as unknown as CurrencyService;
    const pipe = new ExchangePipe(currencyServiceMock);
    expect(pipe).toBeTruthy();
  });
});
