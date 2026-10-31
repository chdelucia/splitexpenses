import { inject, Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '@shared/services';

@Pipe({
  name: 'exchange',
  standalone: true,
})
export class ExchangePipe implements PipeTransform {
  private currencyService = inject(CurrencyService);

  transform(value: number = 0): number {
    const exchangeCost =
      value * this.currencyService.getCurrencySettings().exchangeValue;
    return exchangeCost;
  }
}
