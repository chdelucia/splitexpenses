import { Component, inject, signal, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { openSnackBar, globalToast } from '@shared/utils';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { UsersService } from '@users/shared/users.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SummarygraphComponent } from '@shared/components';
import { ExchangePipe } from '@shared/pipes/exchange.pipe';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SummarygraphComponent,
    ExchangePipe
  ],
})
export class StatsComponent {
  private expensesService = inject(ExpensesService);
  private usersService = inject(UsersService);
  private currencyService = inject(CurrencyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  currency = this.currencyService.getCurrencySettings();
  usersHTML = toSignal(this.usersService.getIterableUsers(), { initialValue: [] });

  private idParam = toSignal(this.route.params);

  userId = computed(() => this.idParam()?.['id'] as string | undefined);

  todayCost = toSignal(
    toObservable(this.userId).pipe(switchMap(id => this.expensesService.getTotalCost(id))),
    { initialValue: 0 }
  );

  meanCost = toSignal(
    toObservable(this.userId).pipe(switchMap(id => this.expensesService.getAverageCostPerDay(id))),
    { initialValue: 0 }
  );

  dailyData = toSignal(
    toObservable(this.userId).pipe(switchMap(id => this.expensesService.gettotalCostEachDayPerType(id))),
    { initialValue: { labels: [], data: [] } }
  );

  typeData = toSignal(
    toObservable(this.userId).pipe(switchMap(id => this.expensesService.getExpensesByType(id))),
    { initialValue: { labels: [], data: [] } }
  );

  change(id: string) {
    if (id !== '0') {
      this.router.navigate(['/stats', id]);
    } else {
      this.router.navigate(['/stats']);
    }
  }

  updateStats() {
    openSnackBar(this._snackBar, globalToast.OK, $localize`Estadísticas actualizadas`);
  }
}
