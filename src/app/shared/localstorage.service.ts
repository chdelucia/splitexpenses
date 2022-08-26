import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Expense, StorageData, User } from './models';
import * as utils from './utils';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  data: StorageData;

  constructor() {
    this.data = this.loadDataFromLocalStorage();
   }

  loadDataFromLocalStorage(): StorageData {
    const ans = localStorage.getItem(environment.localStorageExpenses) || '';
    let answers = ans ? JSON.parse(ans) : { 'users': '', 'expenses': '', 'travels': ''};
    return answers;
    
  }

  saveDataToLocalStorage(users?: Map<string, User>, expenses?: Map<string, Expense>){
    let aUser = users ?  utils.convertMaptoString(users) : this.data.users;
    let bExpense = expenses ? utils.convertMaptoString(expenses) : this.data.expenses;

    this.data.users = aUser
    this.data.expenses = bExpense;
    
    localStorage.setItem(environment.localStorageExpenses, JSON.stringify(this.data));
  }

  getData(){
    return this.data;
  }

  //TODO add to utils.js
  convertMaptoString(map: Map<string, Expense>): string{
    let obj = Object.fromEntries(map);
    let jsonString = JSON.stringify(obj);
    return jsonString;
  }

}
