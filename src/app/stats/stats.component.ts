import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyPlugin, User } from '@shared/models';
import { UsersService } from '@users/shared/users.service';
import { CommonModule } from '@angular/common';
import { SummarygraphComponent } from '@shared/components';
import { ExchangePipe } from '@shared/pipes/exchange.pipe';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  standalone: true,
  imports: [CommonModule, SummarygraphComponent, ExchangePipe],
})
export class StatsComponent {
  private expensesService = inject(ExpensesService);
  private currencyService = inject(CurrencyService);
  private userService = inject(UsersService);

  usersHTML = toSignal(this.userService.getIterableUsers());

  meanCost = signal<number>(0);
  todayCost = signal<number>(0);
  currency: CurrencyPlugin;
  dailyData = signal<any>(null);
  typeData = signal<any>(null);

  constructor() {
    this.currency = this.currencyService.getCurrencySettings();

    this.init();
  }

  change(id: string): void {
    if (id !== '0') {
      this.init(id);
    } else {
      this.init();
    }
  }

  init(userId?: string) {
    this.todayCost.set(this.expensesService.getTotalCost(userId));
    this.meanCost.set(this.expensesService.getAverageCostPerDay(userId));
    this.dailyData.set(this.expensesService.gettotalCostEachDayPerType(userId));
    this.typeData.set(this.expensesService.getExpensesByType(userId));
  }
}
