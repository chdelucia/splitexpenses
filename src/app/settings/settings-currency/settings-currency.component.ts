import { Component, OnInit } from '@angular/core';
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
export class SettingsCurrencyComponent implements OnInit {
  currencySettings: CurrencyPlugin;
  showAlert = false;
  isError = false;

  constructor(private currencyService: CurrencyService) {
    this.currencySettings = this.currencyService.getCurrencySettings();
  }

  ngOnInit(): void {}

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
