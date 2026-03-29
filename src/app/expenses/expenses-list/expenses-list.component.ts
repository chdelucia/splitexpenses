import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { openSnackBar, globalToast } from '@shared/utils';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { UsersService } from '@users/shared/users.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoggerService } from 'src/app/core/services/logger.service';
import { Expense } from '@shared/models';
import { CommonModule, DatePipe, DecimalPipe, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FilterPipe } from '@shared/pipes/filter.pipe';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ExchangePipe } from '@shared/pipes/exchange.pipe';
import { WrapFnPipe } from '@shared/pipes/wrap-fn.pipe';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    FilterPipe,
    MatInputModule,
    MatFormFieldModule,
    ExchangePipe,
    WrapFnPipe,
    DatePipe,
    DecimalPipe,
    KeyValuePipe,
  ],
})
export class ExpensesListComponent implements OnInit {
  filter = input<string>('');

  private expensesService = inject(ExpensesService);
  private currencyService = inject(CurrencyService);
  private usersService = inject(UsersService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private loggerService = inject(LoggerService);

  term = '';
  currency = this.currencyService.getCurrencySettings();
  users = this.usersService.users;
  expenses = this.expensesService.expensesOrderByDateDescSignal;
  pageSize = 5;
  pageIndex = 0;

  private toastmsg = {
    OK: $localize`Gasto eliminado correctamente`,
    KO: $localize`Error fatal`,
  };

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
