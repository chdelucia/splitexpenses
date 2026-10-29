import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { openSnackBar, globalToast, getCategoryIcon } from '@shared/utils';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { UsersService } from '@users/shared/users.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoggerService } from '@core/services/logger.service';
import { Expense } from '@shared/models';
import { ExpensesStore } from '@state/expenses/expenses.store';
import { UserStore } from '@state/user/user.store';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ExcelExportService } from '@core/services/excel-export.service';

export interface EnrichedExpense extends Expense {
  paidByUserName: string;
  sharedByNames: string[];
}

export interface MonthOption {
  key: string;
  label: string;
}

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
  individualMode = input<boolean>(false);
  monthlyFilter = input<boolean>(false);
  basePath = input<string>('/expense');

  isIndividualMode = computed(
    () =>
      this.individualMode() || this.route.snapshot?.data?.['individualMode'],
  );
  isMonthlyFilter = computed(
    () => this.monthlyFilter() || this.route.snapshot?.data?.['monthlyFilter'],
  );
  effectiveBasePath = computed(
    () =>
      this.basePath() || this.route.snapshot?.data?.['basePath'] || '/expense',
  );

  private expensesService = inject(ExpensesService);
  private currencyService = inject(CurrencyService);
  private usersService = inject(UsersService);
  private _snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private loggerService = inject(LoggerService);
  private expensesStore = inject(ExpensesStore);
  private userStore = inject(UserStore);
  private excelExportService = inject(ExcelExportService);

  term = '';
  selectedMonth = signal<string>('');

  currency = this.currencyService.currencySignal;
  expenses = computed<EnrichedExpense[]>(() => {
    return this.expensesStore.enrichedExpensesOrderByDateDesc() as unknown as EnrichedExpense[];
  });

  availableMonths = computed<MonthOption[]>(() => {
    const exps = this.expenses();
    const map = new Map<string, { key: string; label: string; date: Date }>();

    exps.forEach((exp) => {
      if (!exp.date) return;
      const d = new Date(exp.date);
      if (isNaN(d.getTime())) return;

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;

      if (!map.has(key)) {
        const label = d.toLocaleDateString('es-ES', {
          month: 'long',
          year: 'numeric',
        });
        const capitalizedLabel =
          label.charAt(0).toUpperCase() + label.slice(1);
        map.set(key, {
          key,
          label: capitalizedLabel,
          date: new Date(year, d.getMonth(), 1),
        });
      }
    });

    return Array.from(map.values())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(({ key, label }) => ({ key, label }));
  });

  displayExpenses = computed<EnrichedExpense[]>(() => {
    const exps = this.expenses();
    const monthKey = this.selectedMonth();
    if (!monthKey) return exps;

    return exps.filter((exp) => {
      if (!exp.date) return false;
      const d = new Date(exp.date);
      if (isNaN(d.getTime())) return false;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}` === monthKey;
    });
  });

  userCount = this.userStore.userCount;
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
    this.router.navigate([this.effectiveBasePath(), expenseId]);
  }

  addExpense() {
    this.router.navigate([this.effectiveBasePath()]);
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

  exportToExcel(): void {
    this.excelExportService.exportExpensesToExcel(
      this.expenses(),
      'gastos_individuales.xlsx',
    );
  }
}
