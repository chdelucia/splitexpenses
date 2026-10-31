import { Component, inject } from '@angular/core';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { CurrencyPlugin } from '@shared/models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-currency',
  templateUrl: './settings-currency.component.html',
  styleUrls: ['./settings-currency.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SettingsCurrencyComponent {
  private currencyService = inject(CurrencyService);

  currencySettings: CurrencyPlugin = this.currencyService.getCurrencySettings();
  showAlert = false;
  isError = false;

  close() {
    this.showAlert = false;
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
    this.showAlert = true;
  }
}
