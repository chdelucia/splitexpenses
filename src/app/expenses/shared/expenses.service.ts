import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { LocalstorageService } from '@shared/services/localstorage.service';
import { Expense, ExpenseTypes, Settings } from '@shared/models';
import { calcNextID, convertStringToMap, diffinDays } from '@shared/utils';
import {
  addExpense,
  addExpenses,
  removeExpense,
  updateExpense,
} from '@state/expenses/expenses.actions';
import {
  selectExpenseByID,
  selectExpenses,
  selectExpensesDates,
  selectExpensesFilterByType,
  selectIterableExpenses,
  selectExpensesGroupByDates,
  selectExpensesOrderByDateDesc,
} from '@state/expenses/expenses.selectors';
import { ExpensesMapper } from '@expenses/shared/expense.mapper';
import { ExpenseRepository } from './expense.repository';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService extends ExpenseRepository {
  private settings: Settings;
  private expenses: Map<string, Expense> = new Map();
  mapper = new ExpensesMapper();

  constructor(
    private storageService: LocalstorageService,
    private store: Store,
    private http: HttpClient,
  ) {
    super();
    this.settings = this.storageService.getSettings();
    this.loadExpensesFromLocalStorage();
    this.init();
  }

  private apiUrl = 'http://localhost:3000'; // Reemplazar con la URL de tu API
  getExpensesAPI(): Observable<Expense[]> {
    const headers = new HttpHeaders().set('skip-interceptor', 'true');
    return this.http
      .get<Expense[]>(`${this.apiUrl}/expenses`, { headers })
      .pipe(map((expenses) => this.mapper.mapFromList(expenses)));
  }

  getExpenseAPI(id: string): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/expenses/${id}`);
  }

  addExpenseAPI(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${this.apiUrl}/expenses`, expense);
  }

  updateExpenseAPI(expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(
      `${this.apiUrl}/expenses/${expense.id}`,
      expense,
    );
  }

  deleteExpenseAPI(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/expenses/${id}`);
  }

  init(): void {
    this.store.select(selectExpenses).subscribe((data) => {
      this.expenses = data;
    });
  }

  loadExpensesFromLocalStorage(): void {
    const ans = this.storageService.getData().expenses;
    const expenses = ans ? convertStringToMap<Expense>(ans) : new Map();
    this.store.dispatch(addExpenses({ expenses: expenses }));
  }

  saveExpensesIntoLocalStorage(): void {
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

  getExpensesFilterByType(filter: string): Observable<Array<Expense>> {
    return this.store.select(selectExpensesFilterByType(filter));
  }

  getExpensesDates(): Observable<string[]> {
    return this.store.select(selectExpensesDates);
  }

  getExpensesGroupByDates(): Observable<Record<string, Expense[]>> {
    return this.store.select(selectExpensesGroupByDates);
  }

  getExpensesOrderByDatesDesc(): Observable<Expense[]> {
    return this.store.select(selectExpensesOrderByDateDesc);
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
    this.addExpenseAPI(expense).subscribe((x) => console.log(x));
  }

  deleteExpense(id: string) {
    this.store.dispatch(removeExpense({ id }));
    this.saveExpensesIntoLocalStorage();
  }

  getTotalPaidByUserToOthers(userId: string): number {
    let total = 0;
    this.expenses.forEach((expense) => {
      const paidByme = userId === expense.paidBy;
      const Iparticipated = expense.sharedBy.includes(userId);
      if (paidByme) {
        total += expense.originalCost;
        if (Iparticipated) {
          total -= expense.cost;
        }
      }
    });
    return total;
  }

  calcUserTotalBalance(userId: string): number {
    let total = 0;

    this.expenses.forEach((expense) => {
      const paidByme = userId === expense.paidBy;
      const Iparticipated = expense.sharedBy.includes(userId);
      if (paidByme) {
        total += expense.originalCost;
      }
      if (Iparticipated) {
        total -= expense.cost;
      }
    });
    return total;
  }

  calculateExpenseBalanceByUser(expense: Expense, userId: string): number {
    let total = -expense.cost;
    const paidByme = userId === expense.paidBy;
    const Iparticipated = expense.sharedBy.includes(userId);
    if (paidByme) {
      total += expense.originalCost;
      if (!Iparticipated) {
        total += expense.cost;
      }
    }
    return total;
  }

  /** Move all below functions to stats service */
  /* Calculate by group if user not given */
  getTotalCost(userId?: string): number {
    let total = 0;
    this.expenses.forEach((expense) => {
      if (!userId) {
        total += expense.originalCost;
      }
      if (userId && expense.sharedBy.includes(userId)) {
        total += expense.cost;
      }
    });
    return total;
  }

  getAverageCostPerDay(userId?: string): number {
    const totalCost = this.getTotalCost(userId);
    const totalDays = this.getTotalDays();
    return totalCost / totalDays;
  }

  getTotalDays(): number {
    const expenses = Array.from(this.expenses.values());
    const data1 = expenses.shift()?.date || '';
    const date2 = expenses.pop()?.date || '';

    return diffinDays(data1, date2) + 1;
  }

  getExpensesByType(userId?: string): {
    labels: Array<string>;
    data: Array<number>;
  } {
    const data = Array(this.settings.graph.types.size).fill(0);
    const labels: string[] = [];
    this.settings.graph.types.forEach((item) => {
      labels.push(item.name);
    });

    this.expenses.forEach((item) => {
      const index = parseInt(item.typeId);
      if (userId && item.sharedBy.includes(userId)) {
        data[index] = data[index] + item.cost;
      } else if (!userId) {
        data[index] = data[index] + item.originalCost;
      }
    });
    return { labels: labels, data: data };
  }

  getTotalCostEachDay(userId?: string): {
    labels: Array<string>;
    data: Array<number>;
  } {
    const dates: Array<string> = [];
    const expenses = Array.from(this.expenses.values());
    expenses.forEach((expense) => {
      if (!dates.includes(expense.date)) {
        dates.push(expense.date);
      }
    });

    const xAxis: Array<number> = Array(dates.length).fill(0);
    dates.forEach((date, i) => {
      expenses.forEach((expense) => {
        if (
          userId &&
          expense.sharedBy.includes(userId) &&
          expense.date === date
        ) {
          xAxis[i] += expense.cost;
        } else if (!userId && expense.date === date) {
          xAxis[i] += expense.originalCost;
        }
      });
    });

    return { labels: dates, data: xAxis };
  }

  gettotalCostEachDayPerType(userId?: string): {
    labels: Array<string>;
    data: Array<any>;
  } {
    const expensesArray = Array.from(this.expenses.values());
    // Create Object of expenses group by Day
    const result = expensesArray.reduce((r, a) => {
      r[a.date] = r[a.date] || [];
      r[a.date].push(a);
      return r;
    }, Object.create(null));

    const yAxis = Object.keys(result);

    // Create stacked xAxis
    const stackedxAxis: Array<{
      label: string;
      data: Array<number>;
      backgroundColor: string;
    }> = [];
    for (let i = 0; i < this.settings.graph.types.size; i++) {
      stackedxAxis[i] = {
        label: this.settings.graph.types.get(i.toString())?.name || '',
        data: Array(yAxis.length).fill(0),
        backgroundColor: this.settings.graph.bgColors[i],
      };
    }

    for (let i = 0; i < yAxis.length; i++) {
      const name = yAxis[i];
      const expenses: Array<Expense> = result[name];

      expenses.forEach((expense) => {
        const typeIndex = parseInt(expense.typeId);
        if (userId && expense.sharedBy.includes(userId)) {
          stackedxAxis[typeIndex].data[i] += expense.cost;
        } else if (!userId) {
          stackedxAxis[typeIndex].data[i] += expense.originalCost;
        }
      });
    }
    return { labels: yAxis, data: stackedxAxis };
  }
}
