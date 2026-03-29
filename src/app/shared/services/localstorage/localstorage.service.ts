import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  CurrencyPlugin,
  Expense,
  ExpenseTypes,
  Settings,
  StorageData,
  User,
} from '@shared/models';
import * as utils from '@shared/utils';
import { StorageService } from './storage';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService extends StorageService {
  data: StorageData;
  settings: Settings;

  constructor() {
    super(window.localStorage);
    this.settings = this.loadSettings();
    this.data = this.loadDataFromLocalStorage();
  }

  loadDataFromLocalStorage(): StorageData {
    const travelName = this.getActiveTravelName();
    const ans = this.getItem<StorageData>(travelName);
    const answers = ans ?? this.createDataStructure();
    return answers;
  }

  saveDataToLocalStorage(
    users?: Record<string, User>,
    expenses?: Record<string, Expense>,
    currency?: CurrencyPlugin,
  ) {
    const travelName = this.getActiveTravelName();

    this.data.users = users ? users : this.data.users;
    this.data.expenses = expenses ? expenses : this.data.expenses;
    this.data.currency = currency ?? this.data.currency;

    this.setItem(travelName, this.data);
  }

  createDataStructure(): StorageData {
    const obj = {
      users: {
        1: {
          id: "1",
          name: "You"
        },
        2: {
          id: "2",
          name: "Friend-1"
        }
      },
      expenses: {
        1: {
            id: "1",
            title: "Example expense",
            originalCost: 0,
            cost: 0,
            date: new Date().toDateString(),
            paidBy: "1",
            typeId: "6",
            sharedBy: ["1","2"],
            settleBy: []
          }
      },
      name: environment.localStorageExpenses,
      currency: {
        currencySymbol: environment.defaultCurrency,
        active: false,
        exchangeValue: 0,
      },
    };
    this.setItem(environment.localStorageExpenses, obj);
    return obj;
  }

  getData(): StorageData {
    return this.data;
  }

  loadSettings(): Settings {
    const ans = this.getItem<Settings>(environment.localStorageSettings);
    const answers = ans ?? this.createSettingsStructure();
    return answers;
  }

  saveSettings(data?: object) {
    this.settings = { ...this.settings, ...data };
    this.setItem(environment.localStorageSettings, this.settings);
  }

  createSettingsStructure(): Settings {
    const types: Record<string, ExpenseTypes> = {};
    environment.expensesTypes.forEach((type, i) => {
      types[i] = { id: i.toString(), name: type, active: true };
    });
    const obj: Settings = {
      weather: { active: false, city: '', key: '' },
      travels: {
        names: [environment.localStorageExpenses],
        active: environment.localStorageExpenses,
      },
      graph: {
        bgColors: environment.bgColors,
        types: types,
      },
    };
    this.setItem(environment.localStorageSettings, obj);
    return obj;
  }

  getSettings(): Settings {
    return this.settings;
  }

  addNewTravel(name: string) {
    this.settings.travels.active = name;
    this.settings.travels.names.push(name);

    const data = { users: '', expenses: '', name: name, currency: '' };
    this.setItem(name, data);
    this.setItem(environment.localStorageSettings, this.settings);
    this.reset();
  }

  getActiveTravelName(): string {
    let name = environment.localStorageExpenses;
    if (
      this.settings &&
      this.settings.travels &&
      this.settings.travels.active
    ) {
      name = this.settings.travels.active;
    }
    return name;
  }

  changeTravel(name: string): void {
    this.settings.travels.active = name;
    this.saveSettings();
    this.reset();
  }

  reset() {
    this.data = this.loadDataFromLocalStorage();
  }
}
