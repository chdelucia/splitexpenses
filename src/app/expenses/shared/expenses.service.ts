import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, Injector } from '@angular/core';
import { Observable, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
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
  private injector = inject(Injector);

  private settings: Settings;
  expenses = this.expensesStore.expenses;
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
    this.expensesStore.addExpenses(expenses);
  }

  saveExpensesIntoLocalStorage(): void {
    this.storageService.saveDataToLocalStorage(undefined, this.expenses());
  }

  getExpenses(): Observable<Record<string, Expense>> {
    return toObservable(this.expensesStore.expenses, {
      injector: this.injector,
    });
  }

  getExpenseByID(id: string): Observable<Expense | undefined> {
    return toObservable(
      computed(() => this.expensesStore.expenses()[id]),
      { injector: this.injector },
    );
  }

  getIterableExpenses(): Observable<Expense[]> {
    return toObservable(this.expensesStore.iterableExpenses, {
      injector: this.injector,
    });
  }

  getExpensesFilterByType(filter: string): Observable<Array<Expense>> {
    return toObservable(
      computed(() =>
        this.expensesStore
          .iterableExpenses()
          .filter((expense) => expense.typeId === filter),
      ),
      { injector: this.injector },
    );
  }

  getExpensesDates(): Observable<string[]> {
    return toObservable(this.expensesStore.expensesDates, {
      injector: this.injector,
    });
  }

  getExpensesGroupByDates(): Observable<Record<string, Expense[]>> {
    return toObservable(this.expensesStore.expensesGroupByDates, {
      injector: this.injector,
    });
  }

  getExpensesOrderByDatesDesc(): Observable<Expense[]> {
    return toObservable(this.expensesStore.expensesOrderByDateDesc, {
      injector: this.injector,
    });
  }

  getEnrichedExpenses(): Observable<Expense[]> {
    return toObservable(this.expensesStore.enrichedExpenses as any, {
      injector: this.injector,
    });
  }

  getEnrichedExpensesOrderByDatesDesc(): Observable<Expense[]> {
    return toObservable(
      this.expensesStore.enrichedExpensesOrderByDateDesc as any,
      { injector: this.injector },
    );
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
