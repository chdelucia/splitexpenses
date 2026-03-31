import { Injectable } from '@angular/core';
import { CurrencyPlugin } from '@shared/models';
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  currency: CurrencyPlugin;

  constructor(private storageService: LocalstorageService) {
    this.currency = this.loadCurrencyFromLocalStorage();
  }

  loadCurrencyFromLocalStorage(): CurrencyPlugin {
    return this.storageService.getData().currency;
  }

  saveCurrencyIntoLocalStorage(currency: CurrencyPlugin): void {
    this.storageService.saveDataToLocalStorage(
      undefined,
      undefined,
      this.currency,
    );
    this.currency = currency;
  }

  getCurrencySettings(): CurrencyPlugin {
    return this.currency;
  }

  reset() {
    this.currency = this.loadCurrencyFromLocalStorage();
  }
}
