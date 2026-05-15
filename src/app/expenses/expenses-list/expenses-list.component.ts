import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { openSnackBar, globalToast, getCategoryIcon } from '@shared/utils';
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
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
    ExchangePipe,
    WrapFnPipe,
  ],
})
export class ExpensesListComponent implements OnInit {
  filter = input<string>('');
  monthlyFilter = input<boolean>(false);

  private expensesService = inject(ExpensesService);
  private currencyService = inject(CurrencyService);
  private usersService = inject(UsersService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private loggerService = inject(LoggerService);

  term = '';
  private store = inject(Store);
  currency = this.currencyService.getCurrencySettings();
  allExpenses = this.store.selectSignal(selectEnrichedExpensesOrderByDateDesc);

  selectedMonth = signal<number>(new Date().getMonth());
  selectedYear = signal<number>(new Date().getFullYear());

  months = [
    { value: 0, name: $localize`Enero` },
    { value: 1, name: $localize`Febrero` },
    { value: 2, name: $localize`Marzo` },
    { value: 3, name: $localize`Abril` },
    { value: 4, name: $localize`Mayo` },
    { value: 5, name: $localize`Junio` },
    { value: 6, name: $localize`Julio` },
    { value: 7, name: $localize`Agosto` },
    { value: 8, name: $localize`Septiembre` },
    { value: 9, name: $localize`Octubre` },
    { value: 10, name: $localize`Noviembre` },
    { value: 11, name: $localize`Diciembre` },
  ];

  years = computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 5; i--) {
      years.push(i);
    }
    return years;
  });

  expenses = computed(() => {
    const expenses = this.allExpenses();
    if (!this.monthlyFilter()) return expenses;

    return expenses.filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === this.selectedMonth() &&
        date.getFullYear() === this.selectedYear()
      );
    });
  });
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

  addExpense() {
    this.router.navigate(['/expense']);
  }

  getCategoryIcon(typeId: string | number): string {
    return getCategoryIcon(Number(typeId));
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
