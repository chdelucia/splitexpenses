import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from './localstorage.service';
import { Expense } from './models';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  expenses: Map<string, Expense> = new Map();

  constructor(private storageService: LocalstorageService) {
   this.expenses = this.loadExpensesFromLocalStorage()
   }

  loadExpensesFromLocalStorage(): Map<string, Expense> {
    const ans = this.storageService.getData().expenses || '';
    let answers = ans ? this.convertStringToMap(ans) : new Map();
    return answers;
    
  }

  saveExpensesIntoLocalStorage():void {
    this.storageService.saveDataToLocalStorage(undefined, this.expenses);
  }

  getExpenses(): Map<string, Expense> {
    return this.expenses;
  }

  setExpenses(data: Map<string,Expense>): void{
    this.expenses = data;
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

  //TODO move to utils.js
  convertStringToMap(data:string) {
    let obj = JSON.parse(data);
    let map = new Map(Object.entries(obj));
    return map;
  }
  //TODO move to utils.js
  convertMaptoString(map: Map<string, Expense>): string{
    let obj = Object.fromEntries(map);
    let jsonString = JSON.stringify(obj);
    return jsonString;
  }
}
