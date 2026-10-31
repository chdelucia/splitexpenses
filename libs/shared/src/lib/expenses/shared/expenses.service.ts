import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Expense, ExpenseTypes, Settings } from '@shared/models';
import { calcNextID } from '@shared/utils';
import { ExpensesStore } from '@state/expenses/expenses.store';
import { UserStore } from '@state/user/user.store';
import { UsersService } from '@users/shared/users.service';
import { ExpensesMapper } from '@expenses/shared/expense.mapper';
import { ExpenseRepository } from './expense.repository';
import { LoggerService } from '@core/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService extends ExpenseRepository {
  private storageService = inject(LocalstorageService);
  private usersService = inject(UsersService);
  private expensesStore = inject(ExpensesStore);
  private userStore = inject(UserStore);
  private http = inject(HttpClient);
  private loggerService = inject(LoggerService);

  private settings: Settings;
  expenses = this.expensesStore.expenses;
  mapper = new ExpensesMapper();

  constructor() {
    super();
    this.settings = this.storageService.getSettings();
    this.loadExpensesFromLocalStorage();
  }

  private apiUrl = 'http://localhost:3000';
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
    this.expensesStore.addExpenses(expenses);
  }

  saveExpensesIntoLocalStorage(): void {
    this.storageService.saveDataToLocalStorage(undefined, this.expenses());
  }

  getExpenses(): Signal<Record<string, Expense>> {
    return this.expensesStore.expenses;
  }

  getExpenseByID(id: string): Signal<Expense | undefined> {
    return computed(() => this.expensesStore.expenses()[id]);
  }

  getIterableExpenses(): Signal<Expense[]> {
    return this.expensesStore.iterableExpenses;
  }

  getExpensesFilterByType(filter: string): Signal<Array<Expense>> {
    return computed(() =>
      this.expensesStore
        .iterableExpenses()
        .filter((expense) => expense.typeId === filter),
    );
  }

  getExpensesDates(): Signal<string[]> {
    return this.expensesStore.expensesDates;
  }

  getExpensesGroupByDates(): Signal<Record<string, Expense[]>> {
    return this.expensesStore.expensesGroupByDates;
  }

  getExpensesOrderByDatesDesc(): Signal<Expense[]> {
    return this.expensesStore.expensesOrderByDateDesc;
  }

  getEnrichedExpenses(): Signal<Expense[]> {
    return this.expensesStore.enrichedExpenses as Signal<Expense[]>;
  }

  getEnrichedExpensesOrderByDatesDesc(): Signal<Expense[]> {
    return this.expensesStore.enrichedExpensesOrderByDateDesc as Signal<
      Expense[]
    >;
  }

  getExpensesTypes(): Array<ExpenseTypes> {
    return Object.values(this.settings.graph.types);
  }

  editExpense(expense: Expense): void {
    this.expensesStore.updateExpense(expense);
    this.saveExpensesIntoLocalStorage();
  }

  addExpense(expense: Expense): void {
    expense.id = calcNextID(this.expenses());
    this.expensesStore.addExpense(expense);
    this.saveExpensesIntoLocalStorage();
    this.addExpenseAPI(expense).subscribe((x) => {
      this.loggerService.info('ExpensesService', 'addExpenseAPI', x);
    });
  }

  deleteExpense(id: string) {
    this.expensesStore.removeExpense(id);
    this.saveExpensesIntoLocalStorage();
  }

  switchContext(context: 'shared' | 'personal'): void {
    const travelName = context === 'shared' ? 'Expenses' : 'Personal';

    if (this.storageService.getActiveTravelName() === travelName) return;

    this.expensesStore.clearExpenses();
    this.userStore.resetUsers();

    this.storageService.changeTravel(travelName);
    if (!this.storageService.getData().name) {
      this.storageService.addNewTravel(travelName);
    }

    this.init();
    this.usersService.init();
  }

  getTotalPaidByUserToOthers(userId: string): number {
    return this.expensesStore.calcTotalPaidByUserToOthers(userId);
  }

  calcUserTotalBalance(userId: string): number {
    return this.expensesStore.calcUserTotalBalance(userId);
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