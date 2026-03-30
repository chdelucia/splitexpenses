import { Component, OnInit, inject } from '@angular/core';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings-currency',
  templateUrl: './settings-currency.component.html',
  styleUrls: ['./settings-currency.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
})
export class SettingsCurrencyComponent implements OnInit {
  private currencyService = inject(CurrencyService);

  currencySettings = this.currencyService.getCurrencySettings();
  showAlert = false;
  isError = false;

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
