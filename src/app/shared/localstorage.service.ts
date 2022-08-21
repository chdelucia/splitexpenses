import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Expense, StorageData } from './models';

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
    let answers = ans? JSON.parse(ans) : { 'users': '', 'expenses': '', 'travels': ''};
    return answers;
    
  }

  saveDataToLocalStorage(users?: Array<string>, expenses?: Map<string, Expense>){
    let aUser = users ? JSON.stringify(users) : this.data.users;
    let bExpense = expenses ? this.convertMaptoString(expenses) : this.data.expenses;

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
