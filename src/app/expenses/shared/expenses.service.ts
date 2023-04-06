import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { select, Store } from '@ngrx/store';
import { Observable, firstValueFrom, take } from 'rxjs';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { Expense, ExpenseTypes, Settings } from 'src/app/shared/models';
import { calcNextID, convertStringToMap, diffinDays, round2decimals } from 'src/app/shared/utils';
import { addExpense, addExpenses, removeExpense, updateExpense } from 'src/app/state/expenses/expenses.actions';
import { selectExpenseByID, selectExpenses, selectExpensesDates, selectExpensesFilterByType, selectIterableExpenses } from 'src/app/state/expenses/expenses.selectors';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private settings: Settings;
  private expenses : Map<string, Expense> = new Map();

  constructor(
    private storageService: LocalstorageService,
    private store: Store,
    private http: HttpClient
    ) {

    this.settings = this.storageService.getSettings();
    this.loadExpensesFromLocalStorage();
    this.init();

  }

  private apiUrl = 'http://localhost:3000'; // Reemplazar con la URL de tu API
  getExpensesAPI(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses`);
  }

  getExpenseAPI(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/expenses/${id}`);
  }

  addExpenseAPI(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/expenses`, expense);
  }

  updateExpenseAPI(expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/expenses/${expense.id}`, expense);
  }

  deleteExpenseAPI(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/expenses/${id}`);
  }


  init(): void{
    this.store.select(selectExpenses).subscribe((data) => {
      this.expenses = data;
    });
  }

  loadExpensesFromLocalStorage(): void {
    const ans = this.storageService.getData().expenses;
    let expenses = ans ? convertStringToMap(ans) : new Map();
    this.store.dispatch(addExpenses({ expenses: expenses }));
  }

  async saveExpensesIntoLocalStorage():Promise<void> {
    this.storageService.saveDataToLocalStorage(undefined, this.expenses);
  }

  getExpenses(): Observable<Map<string, Expense>> {
    return this.store.select(selectExpenses);
  }

  getExpenseByID(id: string): Observable<Expense | undefined> {
    return this.store.select(selectExpenseByID(id));
  }

  getIterableExpenses(): Observable<Expense[]> {
    return this.store.select(selectIterableExpenses);
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
    this.addExpenseAPI(expense).subscribe(x => console.log(x));
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
    const  expenses = Array.from(this.expenses.values());
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
    const expenses = Array.from(this.expenses.values());
    expenses.forEach( expense => {
      if(!dates.includes(expense.date)) {
        dates.push(expense.date)
      }
    })

    let xAxis: Array<number> = Array(dates.length).fill(0);
    dates.forEach( (date, i) => {
      expenses.forEach(expense => {
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
    let expensesArray = Array.from(this.expenses.values());;
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

}
