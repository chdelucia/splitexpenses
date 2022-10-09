import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { Expense, ExpenseTypes, Settings } from './models';
import { calcNextID, convertStringToMap, diffinDays, round2decimals } from './utils';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  expenses: Map<string, Expense> = new Map();
  settings: Settings;

  constructor(private storageService: LocalstorageService) {
    this.expenses = this.loadExpensesFromLocalStorage();
    this.settings = this.storageService.getSettings();
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

  getExpensesFilterByType(filter: string): Array<Expense>{
    let expensesArray: Array<Expense> = Array.from(this.expenses.values());
    let expensesFiltered = expensesArray.filter( item => item.date === filter);
    return expensesFiltered;
  }

  getExpensesDates(): Array<string>{
    let expensesArray: Array<Expense> = Array.from(this.expenses.values());
    let dates = expensesArray.map( item => item.date);
    return [...new Set(dates.reverse())];
  }

  getExpenseByID(id: string) {
    return this.expenses.get(id);
  }

  getExpensesTypes(): Array<ExpenseTypes> {
    return Array.from(this.settings.graph.types.values())
  }

  editExpense(expense: Expense): void {
    this.expenses.set(expense.id, expense);
    this.saveExpensesIntoLocalStorage();
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

  /* Calculate by group if user not given */
  getTotalCost(userId?: string): number{
    let total = 0;
    this.expenses.forEach(expense => {
      if(!userId){
        total += expense.originalCost;
      } 
      if(userId && expense.sharedBy.includes(userId)){
        total += expense.cost
      }
    })
    return round2decimals(total);
  }

  getAverageCostPerDay(userId?: string): number {
    let totalCost = this.getTotalCost(userId);
    let totalDays = this.getTotalDays();
    return round2decimals(totalCost / totalDays);

  }

  getTotalDays(): number {
    let expenses = Array.from(this.expenses.values());
    let data1 = expenses.shift()?.date || '';
    let date2 = expenses.pop()?.date || '';

    return diffinDays(data1, date2) + 1;
  }

  getExpensesByType(userId?: string): {labels: Array<string>, data: Array<number>} {
    let data = Array(this.settings.graph.types.size).fill(0);
    let labels: string[] = []
    this.settings.graph.types.forEach(item => {
      labels.push(item.name);
    })

    this.expenses.forEach( item => {
      let index = parseInt(item.typeId)
      if( userId && item.sharedBy.includes(userId) ) {
        data[index] =  data[index] + item.cost;
      } 
      else if(!userId) {
        data[index] =  data[index] + item.originalCost;
      }
    })
    return { labels: labels, data: data };
  }

  getTotalCostEachDay(userId?: string): {labels: Array<string>, data: Array<number>} {
    let dates: Array<string> = []

    this.expenses.forEach( expense => {
      if(!dates.includes(expense.date)) {
        dates.push(expense.date)
      } 
    })

    let xAxis: Array<number> = Array(dates.length).fill(0);

    dates.forEach( (date, i) => {
      this.expenses.forEach(expense => {
        if( userId && expense.sharedBy.includes(userId) && expense.date === date ) {
          xAxis[i] += expense.cost;
        } else if(!userId && expense.date === date) {
          xAxis[i] += expense.originalCost;
        }
      })
    })

    return { labels: dates, data: xAxis };
  }

  gettotalCostEachDayPerType(userId?: string): {labels: Array<string>, data: Array<any>} {
    let expensesArray: Array<Expense> = Array.from(this.expenses.values());
    
    // Create Object of expenses group by Day
    let result = expensesArray.reduce(function (r, a) {
        r[a.date] = r[a.date] || [];
        r[a.date].push(a);
        return r;
    }, Object.create(null));
  
    let yAxis = Object.keys(result);

    // Create stacked xAxis
    let stackedxAxis: Array<{ label:string, data:Array<number>, backgroundColor:string }> = []
    for(let i = 0; i < this.settings.graph.types.size; i++) {
      stackedxAxis[i] = {
        label: this.settings.graph.types.get(i.toString())?.name || '',
        data: Array(yAxis.length).fill(0),
        backgroundColor: this.settings.graph.bgColors[i]
     }
    }

    for(let i = 0; i < yAxis.length; i++) {
      let name = yAxis[i];
      let expenses: Array<Expense> = result[name];

      expenses.forEach(expense => {
        const typeIndex = parseInt(expense.typeId);
        if( userId && expense.sharedBy.includes(userId) ) {
          stackedxAxis[typeIndex].data[i] += expense.cost;
        } else if(!userId) {
          stackedxAxis[typeIndex].data[i] += expense.originalCost;
        }    
      })

    }
    return { labels: yAxis, data: stackedxAxis };
  }

  reset(){
    this.expenses = this.loadExpensesFromLocalStorage();
  }


}
