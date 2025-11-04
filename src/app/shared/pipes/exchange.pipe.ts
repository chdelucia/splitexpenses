import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../services/currency/currency.service';

@Pipe({
    name: 'exchange',
    standalone: false
})
export class ExchangePipe implements PipeTransform {
  constructor(private currencyService: CurrencyService) {}
  transform(value: number = 0): number {
    const exchangeCost =
      value * this.currencyService.getCurrencySettings().exchangeValue;
    return exchangeCost;
  }
}
