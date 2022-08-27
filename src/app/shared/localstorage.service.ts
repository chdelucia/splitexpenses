import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CurrencyPlugin, Expense, GraphPlugin, Settings, StorageData, User, WeatherPlugin } from './models';
import * as utils from './utils';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  data: StorageData;
  settings: Settings;

  constructor() {
    this.settings = this.loadSettings();
    this.data = this.loadDataFromLocalStorage();
   }

  loadDataFromLocalStorage(): StorageData {
    let name = this.getActiveTravelName();
    const ans = localStorage.getItem(name);
    let answers = ans ? JSON.parse(ans) : { 'users': '', 'expenses': '', 'name':environment.localStorageExpenses, 'currency': ''};
    return answers;
    
  }

  saveDataToLocalStorage(users?: Map<string, User>, expenses?: Map<string, Expense>) {
    let name = this.getActiveTravelName();
    let aUser = users ?  utils.convertMaptoString(users) : this.data.users;
    let bExpense = expenses ? utils.convertMaptoString(expenses) : this.data.expenses;

    this.data.users = aUser
    this.data.expenses = bExpense;
    
    localStorage.setItem(name, JSON.stringify(this.data));
  }

  saveSettings(data?: Object) {
    let settings = {...this.settings, ...data};
    localStorage.setItem(environment.localStorageSettings, JSON.stringify(settings));
  }

  loadSettings(): Settings {
    const ans = localStorage.getItem(environment.localStorageSettings) || '';
    let answers = ans ? JSON.parse(ans) : { 'weather': '', 'travels': '', 'graph': ''};
    return answers;
  }

  getData(): StorageData{
    return this.data;
  }

  getSettings(): Settings {
    return this.settings;
  }

  addNewTravel(name: string) {
    this.settings.travels.active = name;
    this.settings.travels.names.push(name);

    let data = { 'users': '', 'expenses': '', 'name':name, 'currency': ''};
    localStorage.setItem(name, JSON.stringify(data));
    localStorage.setItem(environment.localStorageSettings, JSON.stringify(this.settings));
    this.reset();
  }

  getActiveTravelName():string {
    let name = environment.localStorageExpenses;
    if (this.settings && this.settings.travels && this.settings.travels.active) {
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
