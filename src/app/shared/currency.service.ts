import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { CurrencyPlugin } from './models';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  currency: CurrencyPlugin;

  constructor(private storageService: LocalstorageService) {
   this.currency = this.loadCurrencyFromLocalStorage()
   }

  loadCurrencyFromLocalStorage(): CurrencyPlugin {
    return this.storageService.getData().currency;
  }

  saveCurrencyIntoLocalStorage(currency: CurrencyPlugin): void {
    this.storageService.saveDataToLocalStorage(undefined, undefined, this.currency);
    this.currency = currency;
  }

  getCurrencySettings(): CurrencyPlugin {
    return this.currency;
  }

  calcExchangeValue(value: number): number {
    let exchangeCost = value * this.currency.exchangeValue;
    let round2decimals = Math.round((exchangeCost + Number.EPSILON) * 100) / 100;
    return round2decimals;
  }

  reset(){
    this.currency = this.loadCurrencyFromLocalStorage();
  }
}
