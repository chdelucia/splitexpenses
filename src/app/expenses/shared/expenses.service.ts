import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom } from 'rxjs';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { Expense, ExpenseTypes, Settings } from 'src/app/shared/models';
import { calcNextID, convertStringToMap, diffinDays, round2decimals } from 'src/app/shared/utils';
import { addExpense, addExpenses, removeExpense, updateExpense } from 'src/app/state/expenses/expenses.actions';
import { selectExpenseByID, selectExpenses, selectExpensesDates, selectExpensesFilterByType, selectIterableExpenses } from 'src/app/state/expenses/expenses.selectors';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  expenses: Map<string, Expense> = new Map();
  settings: Settings;
  expenses$: Observable<Map<string, Expense>>;
  iterableExpenses$: Observable<Array<Expense>>;

  constructor(
    private storageService: LocalstorageService,
    private store: Store) {
    this.expenses = this.loadExpensesFromLocalStorage();
    this.settings = this.storageService.getSettings();

    this.expenses$ = this.store.select(selectExpenses);
    this.iterableExpenses$ = this.store.select(selectIterableExpenses);
    this.store.dispatch(addExpenses({ expenses: this.expenses }));
  }

  loadExpensesFromLocalStorage(): Map<string, Expense> {
    const ans = this.storageService.getData().expenses;
    let answers = ans ? convertStringToMap(ans) : new Map();
    return answers;
  }

  async saveExpensesIntoLocalStorage():Promise<void> {
    const expenses = await firstValueFrom(this.expenses$)
    this.storageService.saveDataToLocalStorage(undefined, expenses);
  }

  getExpenses(): Observable<Map<string, Expense>> {
    return this.expenses$;
  }

  getExpenseByID(id: string): Observable<Expense | undefined> {
    return this.store.select(selectExpenseByID(id));
  }

  getIterableExpenses(): Observable<Expense[]> {
    return this.iterableExpenses$;
  }

  getExpensesFilterByType(filter: string): Observable<Array<Expense>>{
    return this.store.select(selectExpensesFilterByType(filter));
  }

  getExpensesDates(): Observable<string[]>{
    return this.store.select(selectExpensesDates);
  }

  getExpensesTypes(): Array<ExpenseTypes> {
    return Array.from(this.settings.graph.types.values());
  }

  editExpense(expense: Expense): void {
    this.store.dispatch(updateExpense({ expense }));
    this.saveExpensesIntoLocalStorage();
  }

  addExpense(expense: Expense): void {
    expense.id = calcNextID(this.expenses);
    this.store.dispatch(addExpense({ expense }));
    this.saveExpensesIntoLocalStorage();
  }

  deleteExpense(id: string) {
    this.store.dispatch(removeExpense({ id }));
    this.saveExpensesIntoLocalStorage();
  }

  getTotalPaidByUserToOthers(userId: string): number {
    let total = 0
    this.expenses.forEach(expense => {
      let paidByme = userId === expense.paidBy;
      let Iparticipated = expense.sharedBy.includes(userId);
      if(paidByme){
        total += expense.originalCost;
        if(Iparticipated){
          total -= expense.cost;
        }
      }
    })
    return total;
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