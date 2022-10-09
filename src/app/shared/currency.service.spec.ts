import { TestBed } from '@angular/core/testing';
import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('exchange money from Euros to Pounds ', () => {
    service.currency.exchangeValue = 0.87
    let result = service.calcExchangeValue(3.5)
    let countDecimals = result.toString().split(".")[1].length
    expect(result).toBeLessThan(3.5);
    expect(countDecimals).toBeLessThanOrEqual(2);
  });
});
