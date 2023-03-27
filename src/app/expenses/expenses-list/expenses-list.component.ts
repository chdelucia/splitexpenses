import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { openSnackBar, globalToast } from 'src/app/shared/utils';
import { CurrencyService } from '../../shared/currency.service';
import { DebtsService } from '../../shared/debts.service';
import { ExpensesService } from '../../expenses/shared/expenses.service';
import { CurrencyPlugin, Expense, User } from '../../shared/models';
import { UsersService } from '../../users/shared/users.service';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.less']
})
export class ExpensesListComponent implements OnInit, OnChanges {
  @Input() filter: string = '';

  expenses$: Observable<Array<Expense>>;
  currency: CurrencyPlugin;
  users$: Observable<Map<string, User>>;
  dates$: Observable<Array<string>>;

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
    this.expenses$ = this.expensesService.getIterableExpenses();
    this.currency = this.currencyService.getCurrencySettings();
    this.dates$ = this.expensesService.getExpensesDates();
    this.users$ = this.usersService.getUsers();
  }

  ngOnInit(): void {
    if(this.filter){
      this.createArrayofExpenses();
    }
  }

  ngOnChanges(){
    if(this.filter){
     this.createArrayofExpenses();
    }
  }

  deleteExpense(key: string) {
    this.expensesService.deleteExpense(key);
    this.resetDebts();
    openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
  }

  editExpense(expenseId: string) {
    this.router.navigate(['/expense', expenseId]);
  }

  createArrayofExpenses(): void {
    if(this.filter){
      this.expenses$ = this.expensesService.getExpensesFilterByType(this.filter);
    }
  }

  calcExchange(value?: number): number {
    return this.currencyService.calcExchangeValue(value || 0);
  }

  private resetDebts(): void {
    this.debtsService.reset();
  }

}
