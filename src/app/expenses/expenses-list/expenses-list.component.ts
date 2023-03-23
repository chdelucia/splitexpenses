import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { openSnackBar, globalToast } from 'src/app/shared/utils';
import { CurrencyService } from '../../shared/currency.service';
import { DebtsService } from '../../shared/debts.service';
import { ExpensesService } from '../../shared/expenses.service';
import { CurrencyPlugin, Expense, User } from '../../shared/models';
import { UsersService } from '../../users/shared/users.service';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.less']
})
export class ExpensesListComponent implements OnInit, OnChanges {
  @Input() filter: string = '';

  expenses: Map<string, Expense>;
  expensesHTML: Array<Expense> = [];
  currency: CurrencyPlugin;
  users: Map<string, User> = new Map();
  totalUsers: number = 0;
  dates: Array<string> = [];

  private toastmsg =  {
    OK : $localize`Gasto eliminado correctamente`,
    KO : $localize`Error fatal`,
  }

  constructor(
    private expensesService: ExpensesService,
    private debtsService: DebtsService,
    private currencyService: CurrencyService,
    private usersService: UsersService,
    private _snackBar: MatSnackBar,
    private router: Router,
    ) {
    this.expenses = this.expensesService.getExpenses();
    this.currency = this.currencyService.getCurrencySettings();
    this.expensesHTML = Array.from(this.expenses.values()).reverse();
    this.dates = this.expensesService.getExpensesDates();
  }

  ngOnInit(): void {
    if(this.filter){
      this.createArrayofExpenses();
    }
    this.usersService.getUsers().subscribe(
      (users: Map<string, User>) => {
        this.users = users;
        this.totalUsers = users.size;
      }
    );
  }

  ngOnChanges(){
    if(this.filter){
     this.createArrayofExpenses();
    }
  }

  deleteExpense(key: string) {
    this.expensesService.deleteExpense(key);
    this.updateExpenses();
    this.updateDates();
    this.createArrayofExpenses();
    this.resetDebts();
    openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
  }

  editExpense(expenseId: string) {
    this.router.navigate(['/expense', expenseId]);
  }

  createArrayofExpenses(): void {
    if(this.filter){
      this.expensesHTML = this.expensesService.getExpensesFilterByType(this.filter);
    } else {
      this.expensesHTML = Array.from(this.expenses.values());
    }
  }

  calcExchange(value?: number): number {
    return this.currencyService.calcExchangeValue(value || 0);
  }

  /** TODO remove this and add expense to the store ngrx */
  private updateExpenses(): void {
      this.expenses = this.expensesService.getExpenses()
  }

  private updateDates(): void {
      this.dates = this.expensesService.getExpensesDates()
  }

  private resetDebts(): void {
    this.debtsService.reset();
  }

}
