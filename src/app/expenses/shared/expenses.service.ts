import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Expense, ExpenseTypes } from '@shared/models';
import { calcNextID } from '@shared/utils';
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
  selectTotalCost,
  selectAverageCostPerDay,
  selectExpensesByType,
  selectTotalCostEachDayPerType,
} from '@state/expenses/expenses.selectors';
import { ExpensesMapper } from '@expenses/shared/expense.mapper';
import { ExpenseRepository } from './expense.repository';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService extends ExpenseRepository {
  private storageService = inject(LocalstorageService);
  private store = inject(Store);
  private http = inject(HttpClient);

  mapper = new ExpensesMapper();

  constructor() {
    super();
    this.loadExpensesFromLocalStorage();
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

  loadExpensesFromLocalStorage(): void {
    const ans = this.storageService.getData().expenses;
    const expenses = ans || {};
    this.store.dispatch(addExpenses({ expenses: expenses }));
  }

  private saveExpensesIntoLocalStorage(): void {
    this.store.select(selectExpenses).pipe(take(1)).subscribe(expenses => {
        this.storageService.saveDataToLocalStorage(undefined, expenses);
    });
  }

  getExpenses(): Observable<Record<string, Expense>> {
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
    return Object.values(this.storageService.getSettings().graph.types);
  }

  editExpense(expense: Expense): void {
    this.store.dispatch(updateExpense({ expense }));
    this.saveExpensesIntoLocalStorage();
  }

  addExpense(expense: Expense): void {
    this.store.select(selectExpenses).pipe(take(1)).subscribe(expenses => {
        expense.id = calcNextID(expenses);
        this.store.dispatch(addExpense({ expense }));
        this.saveExpensesIntoLocalStorage();
        this.addExpenseAPI(expense).subscribe((x) => console.log(x));
    });
  }

  deleteExpense(id: string): void {
    this.store.dispatch(removeExpense({ id }));
    this.saveExpensesIntoLocalStorage();
  }

  getTotalCost(userId?: string): Observable<number> {
    return this.store.select(selectTotalCost(userId));
  }

  getAverageCostPerDay(userId?: string): Observable<number> {
    return this.store.select(selectAverageCostPerDay(userId));
  }

  getExpensesByType(userId?: string): Observable<{
    labels: Array<string>;
    data: Array<number>;
  }> {
    const settings = this.storageService.getSettings();
    const labels = Object.values(settings.graph.types).map(t => t.name);
    return this.store.select(selectExpensesByType(userId, labels));
  }

  gettotalCostEachDayPerType(userId?: string): Observable<{
    labels: Array<string>;
    data: Array<any>;
  }> {
    const settings = this.storageService.getSettings();
    return this.store.select(selectTotalCostEachDayPerType(userId, settings.graph.types, settings.graph.bgColors));
  }
}
