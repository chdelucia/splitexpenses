import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { openSnackBar, globalToast } from '@shared/utils';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { UsersService } from '@users/shared/users.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoggerService } from '@core/services/logger.service';
import { Expense } from '@shared/models';
import { selectEnrichedExpensesOrderByDateDesc } from '@state/expenses/expenses.selectors';
import { selectUserCount } from '@state/user/user.selectors';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FilterPipe } from '@shared/pipes/filter.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    MatFormFieldModule,
    MatInputModule,
    ExchangePipe,
    WrapFnPipe,
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
  private store = inject(Store);
  currency = this.currencyService.getCurrencySettings();
  expenses = this.store.selectSignal(selectEnrichedExpensesOrderByDateDesc);
  categoryIcons: Record<string, string> = {
    '0': 'sports_esports',
    '1': 'restaurant',
    '2': 'directions_car',
    '3': 'local_bar',
    '4': 'museum',
    '5': 'hotel',
    '6': 'card_giftcard',
    '7': 'more_horiz',
  };
  userCount = this.store.selectSignal(selectUserCount);
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
