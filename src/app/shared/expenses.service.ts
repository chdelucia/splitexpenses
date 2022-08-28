import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { Expense } from './models';
import { calcNextID, convertStringToMap } from './utils';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  expenses: Map<string, Expense> = new Map();

  constructor(private storageService: LocalstorageService) {
   this.expenses = this.loadExpensesFromLocalStorage()
   }

  loadExpensesFromLocalStorage(): Map<string, Expense> {
    const ans = this.storageService.getData().expenses;
    let answers = ans ? convertStringToMap(ans) : new Map();
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
    data.id = calcNextID(this.expenses);
    this.expenses.set(data.id, data);
    this.saveExpensesIntoLocalStorage();
  }

  deleteExpense(key: string) {
    this.expenses.delete(key);
    this.saveExpensesIntoLocalStorage();
  }

  reset(){
    this.expenses = this.loadExpensesFromLocalStorage();
  }


}
