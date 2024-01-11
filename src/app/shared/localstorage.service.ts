import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CurrencyPlugin, Expense, Settings, StorageData, User } from './models';
import * as utils from './utils';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  data: StorageData;
  settings: Settings;

  constructor() {
    this.settings = this.loadSettings();
    this.data = this.loadDataFromLocalStorage();
  }

  loadDataFromLocalStorage(): StorageData {
    const travelName = this.getActiveTravelName();
    const ans = localStorage.getItem(travelName);
    const answers = ans ? JSON.parse(ans) : this.createDataStructure();
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
    this.data.currency = currency ? currency : this.data.currency;

    localStorage.setItem(travelName, JSON.stringify(this.data));
  }

  createDataStructure() {
    const obj = {
      users: '',
      expenses: '',
      name: environment.localStorageExpenses,
      currency: {
        currencySymbol: environment.defaultCurrency,
      },
    };
    localStorage.setItem(environment.localStorageExpenses, JSON.stringify(obj));
    return obj;
  }

  getData(): StorageData {
    return this.data;
  }

  loadSettings(): Settings {
    const ans = localStorage.getItem(environment.localStorageSettings);
    const answers = ans ? JSON.parse(ans) : this.createSettingsStructure();
    answers.graph.types = utils.convertStringToMap(answers.graph.types);
    return answers;
  }

  saveSettings(data?: Object) {
    this.settings = { ...this.settings, ...data };

    //TODO create a deep clone
    this.settings.graph.types = utils.convertMaptoString(
      this.settings.graph.types,
    ) as any;
    localStorage.setItem(
      environment.localStorageSettings,
      JSON.stringify(this.settings),
    );

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
      weather: {},
      travels: {
        names: [environment.localStorageExpenses],
        active: environment.localStorageExpenses,
      },
      graph: {
        bgColors: environment.bgColors,
        types: utils.convertMaptoString(types),
      },
    };
    localStorage.setItem(environment.localStorageSettings, JSON.stringify(obj));
    return obj;
  }

  getSettings(): Settings {
    return this.settings;
  }

  addNewTravel(name: string) {
    this.settings.travels.active = name;
    this.settings.travels.names.push(name);

    const data = { users: '', expenses: '', name: name, currency: '' };
    localStorage.setItem(name, JSON.stringify(data));
    localStorage.setItem(
      environment.localStorageSettings,
      JSON.stringify(this.settings),
    );
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
