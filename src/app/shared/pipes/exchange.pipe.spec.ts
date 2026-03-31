import { ExchangePipe } from './exchange.pipe';
import { TestBed } from '@angular/core/testing';
import { CurrencyService } from '@shared/services';

describe('ExchangePipe', () => {
  let pipe: ExchangePipe;

  beforeEach(() => {
    const currencyServiceSpy = {} as CurrencyService;
    TestBed.configureTestingModule({
      providers: [
        ExchangePipe,
        { provide: CurrencyService, useValue: currencyServiceSpy },
      ],
    });
    pipe = TestBed.inject(ExchangePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
