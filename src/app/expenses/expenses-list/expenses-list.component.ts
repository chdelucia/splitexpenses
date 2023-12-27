import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { openSnackBar, globalToast } from 'src/app/shared/utils';
import { CurrencyService } from '../../shared/currency.service';
import { ExpensesService } from '../../expenses/shared/expenses.service';
import { CurrencyPlugin, Expense, User } from '../../shared/models';
import { UsersService } from '../../users/shared/users.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit, OnChanges {
  @Input() filter: string = '';

  term = ''

  expenses$: Observable<Array<Expense>>;
  currency: CurrencyPlugin;
  users$: Observable<Map<string, User>>;
  dates$: Observable<Array<string>>;
  test$ = this.expensesService.getExpensesOrderByDatesDesc();

  private toastmsg =  {
    OK : $localize`Gasto eliminado correctamente`,
    KO : $localize`Error fatal`,
  }

  constructor(
    private expensesService: ExpensesService,
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

  handlePageEvent(e: PageEvent) {
    console.log(e.pageSize, e.pageIndex);
  }

}
