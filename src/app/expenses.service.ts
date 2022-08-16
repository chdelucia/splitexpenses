import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Expense, User } from './models';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  users: Array<string> = ['Vane', 'Jess'];
  expenses = new Map();
  id: string = '0';

  constructor() { }

  loadExpensesFromLocalStorage():void {
    const ans = localStorage.getItem(environment.localStorageExpenses) || '';
    let answers = ans ? this.convertStringToMap(ans) : new Map();
    const isNotLoaded = answers.size != this.expenses.size;

    if( isNotLoaded ) {
      this.expenses = answers;
    }
  }

  saveExpensesIntoLocalStorage(data: Expense):void {
    localStorage.setItem(environment.localStorageExpenses, this.convertMaptoString(this.expenses) );
  }

  getUsers(): Array<string> {
    return this.users;
  }

  setUsers(user: string) {
    this.users.push(user);
  }

  getExpenses(): Map<string, Expense> {
    return this.expenses;
  }

  setExpense(data: Expense) {
    this.expenses.set(this.expenses.size, data);
    this.saveExpensesIntoLocalStorage(data);
  }

  convertStringToMap(data:string) {
    let obj = JSON.parse(data);
    let map = new Map(Object.entries(obj));
    return map;
  }

  convertMaptoString(map: any): string{
    let obj = Object.fromEntries(map);
    let jsonString = JSON.stringify(obj);
    return jsonString;
  }
}
