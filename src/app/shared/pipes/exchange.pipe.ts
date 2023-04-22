import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../currency.service';

@Pipe({
  name: 'exchange'
})
export class ExchangePipe implements PipeTransform {

  constructor(private currencyService: CurrencyService) {}
  transform(value: number = 0): number {
    let exchangeCost = value * this.currencyService.getCurrencySettings().exchangeValue;
    return exchangeCost;
  }

}
