import { Component, inject, signal } from '@angular/core';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { CurrencyPlugin } from '@shared/models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-currency',
  templateUrl: './settings-currency.component.html',
  styleUrls: ['./settings-currency.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class SettingsCurrencyComponent {
  private currencyService = inject(CurrencyService);

  currencySettings: CurrencyPlugin = this.currencyService.getCurrencySettings();
  showAlert = signal(false);
  isError = signal(false);

  close() {
    this.showAlert.set(false);
  }

  setCurrency(
    currency: string,
    exchange: boolean,
    exCurrency?: string,
    exValue?: string,
  ) {
    const exchangeValue = exValue ? parseFloat(exValue) : 0;

    const obj = {
      currencySymbol: currency,
      currencyExchangeSymbol: exCurrency,
      exchangeValue: exchangeValue,
      active: exchange,
    };
    this.currencyService.saveCurrencyIntoLocalStorage(obj);
    this.showAlert.set(true);
  }
}
