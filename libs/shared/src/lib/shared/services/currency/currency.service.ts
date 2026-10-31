import { Injectable, inject, signal } from '@angular/core';
import { CurrencyPlugin } from '@shared/models';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private storageService = inject(LocalstorageService);

  private _currency = signal<CurrencyPlugin>({
    currencySymbol: '$',
    active: false,
    exchangeValue: 0,
  });

  constructor() {
    this._currency.set(this.loadCurrencyFromLocalStorage());
  }

  loadCurrencyFromLocalStorage(): CurrencyPlugin {
    return this.storageService.getData().currency;
  }

  saveCurrencyIntoLocalStorage(currency: CurrencyPlugin): void {
    this.storageService.saveDataToLocalStorage(undefined, undefined, currency);
    this._currency.set(currency);
  }

  getCurrencySettings(): CurrencyPlugin {
    return this._currency();
  }

  get currencySignal() {
    return this._currency.asReadonly();
  }

  reset() {
    this._currency.set(this.loadCurrencyFromLocalStorage());
  }
}
