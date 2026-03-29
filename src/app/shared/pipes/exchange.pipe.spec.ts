import { CurrencyService } from '../services/currency/currency.service';
import { ExchangePipe } from './exchange.pipe';

describe('ExchangePipe', () => {
  it('create an instance', () => {
    const mockCurrencyService = {
      getCurrencySettings: jest.fn().mockReturnValue({ exchangeValue: 1 }),
    };
    const pipe = new ExchangePipe(mockCurrencyService as any);
    expect(pipe).toBeTruthy();
  });
});
