import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { openSnackBar, globalToast } from '@shared/utils';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { UsersService } from '@users/shared/users.service';
import { PageEvent } from '@angular/material/paginator';
import { LoggerService } from 'src/app/core/services/logger.service';
import { Expense } from '@shared/models';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesListComponent implements OnInit {
  @Input() filter: string = '';

  term = '';
  currency = this.currencyService.getCurrencySettings();
  users$ = this.usersService.getUsers();
  expenses$ = this.expensesService.getExpensesOrderByDatesDesc();
  pageSize = 5;
  pageIndex = 0;

  private toastmsg = {
    OK: $localize`Gasto eliminado correctamente`,
    KO: $localize`Error fatal`,
  };

  constructor(
    private expensesService: ExpensesService,
    private currencyService: CurrencyService,
    private usersService: UsersService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private loggerService: LoggerService,
  ) {}

  ngOnInit(): void {
    this.loggerService.info(
      'ExpensesListComponent',
      'onInit',
      this.currency,
      'olive',
    );
  }

  deleteExpense(key: string) {
    this.expensesService.deleteExpense(key);
    openSnackBar(this._snackBar, globalToast.OK, this.toastmsg.OK);
  }

  editExpense(expenseId: string) {
    this.router.navigate(['/expense', expenseId]);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  pageSizeOptions(expenses: Expense[]): Array<number> {
    return Array.from(
      { length: Math.ceil(expenses.length / 5) },
      (_, index) => (index + 1) * 5,
    );
  }
}
