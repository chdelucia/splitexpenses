import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Expense, ExpenseTypes, Settings } from '@shared/models';
import { calcNextID, diffinDays } from '@shared/utils';
import {
  addExpense,
  addExpenses,
  clearExpenses,
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
  selectEnrichedExpenses,
  selectEnrichedExpensesOrderByDateDesc,
  selectTotalPaidByUserToOthers,
  selectUserTotalBalance,
  selectTotalCost,
} from '@state/expenses/expenses.selectors';
import { resetUsers } from '@state/user/user.actions';
import { UsersService } from '@users/shared/users.service';
import { ExpensesMapper } from '@expenses/shared/expense.mapper';
import { ExpenseRepository } from './expense.repository';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService extends ExpenseRepository {
  private storageService = inject(LocalstorageService);
  private usersService = inject(UsersService);
  private store = inject(Store);
  private http = inject(HttpClient);

  private settings: Settings;
  expenses = this.store.selectSignal(selectExpenses);
  mapper = new ExpensesMapper();

  constructor() {
    super();
    this.settings = this.storageService.getSettings();
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

  init(): void {
    this.loadExpensesFromLocalStorage();
  }

  loadExpensesFromLocalStorage(): void {
    const ans = this.storageService.getData().expenses;
    const expenses = ans || {};
    this.store.dispatch(addExpenses({ expenses: expenses }));
  }

  saveExpensesIntoLocalStorage(): void {
    this.storageService.saveDataToLocalStorage(undefined, this.expenses());
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

  getEnrichedExpenses(): Observable<Expense[]> {
    return this.store.select(selectEnrichedExpenses);
  }

  getEnrichedExpensesOrderByDatesDesc(): Observable<Expense[]> {
    return this.store.select(selectEnrichedExpensesOrderByDateDesc);
  }

  getExpensesTypes(): Array<ExpenseTypes> {
    return Object.values(this.settings.graph.types);
  }

  editExpense(expense: Expense): void {
    this.store.dispatch(updateExpense({ expense }));
    this.saveExpensesIntoLocalStorage();
  }

  addExpense(expense: Expense): void {
    expense.id = calcNextID(this.expenses());
    this.store.dispatch(addExpense({ expense }));
    this.saveExpensesIntoLocalStorage();
    this.addExpenseAPI(expense).subscribe((x) => console.log(x));
  }

  deleteExpense(id: string) {
    this.store.dispatch(removeExpense({ id }));
    this.saveExpensesIntoLocalStorage();
  }

  switchContext(context: 'shared' | 'personal'): void {
    const travelName = context === 'shared' ? 'Expenses' : 'Personal';

    if (this.storageService.getActiveTravelName() === travelName) return;

    this.store.dispatch(clearExpenses());
    this.store.dispatch(resetUsers());

    this.storageService.changeTravel(travelName);
    if (!this.storageService.getData().name) {
      this.storageService.addNewTravel(travelName);
    }

    this.init();
    this.usersService.init();
  }

  getTotalPaidByUserToOthers(userId: string): number {
    return this.store.selectSignal(selectTotalPaidByUserToOthers(userId))();
  }

  calcUserTotalBalance(userId: string): number {
    return this.store.selectSignal(selectUserTotalBalance(userId))();
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

}
