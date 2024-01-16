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
    users?: Map<string, User>,
    expenses?: Map<string, Expense>,
    currency?: CurrencyPlugin,
  ) {
    const travelName = this.getActiveTravelName();

    this.data.users = users ? utils.convertMaptoString(users) : this.data.users;
    this.data.expenses = expenses
      ? utils.convertMaptoString(expenses)
      : this.data.expenses;
    this.data.currency = currency ?? this.data.currency;

    this.setItem(travelName, this.data);
  }

  createDataStructure(): StorageData {
    const obj = {
      users: {},
      expenses: {},
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

  loadSettings(): any {
    const ans = this.getItem<Settings>(environment.localStorageSettings);
    const answers = ans ?? this.createSettingsStructure();
    answers.graph.types = utils.convertStringToMap<ExpenseTypes>(
      answers.graph.types as Record<string, ExpenseTypes>,
    );
    return answers;
  }

  saveSettings(data?: object) {
    this.settings = { ...this.settings, ...data };

    //TODO create a deep clone
    this.settings.graph.types = utils.convertMaptoString(
      this.settings.graph.types,
    ) as any;
    this.setItem(environment.localStorageSettings, this.settings);

    this.settings.graph.types = utils.convertStringToMap(
      this.settings.graph.types as any,
    );
  }

  createSettingsStructure() {
    const types = new Map();
    environment.expensesTypes.forEach((type, i) => {
      types.set(i, { id: i, name: type, active: true });
    });
    const obj = {
      weather: { active: false, city: '', key: '' },
      travels: {
        names: [environment.localStorageExpenses],
        active: environment.localStorageExpenses,
      },
      graph: {
        bgColors: environment.bgColors,
        types: utils.convertMaptoString(types),
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
