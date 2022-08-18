import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Expense } from './models';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  expenses: Map<string, Expense> = new Map();

  constructor() {
    this.expenses = this.loadExpensesFromLocalStorage();
   }

  loadExpensesFromLocalStorage(): Map<string, Expense> {
    const ans = localStorage.getItem(environment.localStorageExpenses) || '';
    let answers = ans ? this.convertStringToMap(ans) : new Map();
    return answers;
    
  }

  saveExpensesIntoLocalStorage():void {
    localStorage.setItem(environment.localStorageExpenses, this.convertMaptoString(this.expenses));
  }

  getExpenses(): Map<string, Expense> {
    return this.expenses;
  }

  setExpense(data: Expense): void{
    this.expenses.set(data.id, data);
    this.saveExpensesIntoLocalStorage();
  }

  addExpense(data: Expense): void {
    let nextId = this.calcNextID();
    data.id = nextId;
    this.expenses.set(nextId, data);
    this.saveExpensesIntoLocalStorage();
  }

  deleteExpense(key: string) {
    this.expenses.delete(key);
    this.saveExpensesIntoLocalStorage();
  }

  calcNextID(): string{
    let lastId = Array.from(this.expenses.keys()).pop() || '0';
    let nextId = parseInt(lastId) + 1;
    return nextId.toString();
  }

  //TODO move to utils
  convertStringToMap(data:string) {
    let obj = JSON.parse(data);
    let map = new Map(Object.entries(obj));
    return map;
  }

  convertMaptoString(map: Map<string, Expense>): string{
    let obj = Object.fromEntries(map);
    let jsonString = JSON.stringify(obj);
    return jsonString;
  }
}
