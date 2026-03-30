import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { ExpensesService } from '@expenses/shared/expenses.service';
import { CurrencyPlugin, User } from '@shared/models';
import { UsersService } from '@users/shared/users.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  standalone: false,
})
export class StatsComponent {
  private expensesService = inject(ExpensesService);
  private currencyService = inject(CurrencyService);
  private userService = inject(UsersService);

  usersHTML = toSignal(this.userService.getIterableUsers());

  meanCost: number = 0;
  todayCost: number = 0;
  currency: CurrencyPlugin;
  dailyData;
  typeData;

  constructor() {
    this.currency = this.currencyService.getCurrencySettings();

    this.todayCost = this.expensesService.getTotalCost();
    this.meanCost = this.expensesService.getAverageCostPerDay();
    this.dailyData = this.expensesService.gettotalCostEachDayPerType();
    this.typeData = this.expensesService.getExpensesByType();
  }

  change(id: string): void {
    if (id !== '0') {
      this.init(id);
    } else {
      this.init();
    }
  }

  init(userId?: string) {
    this.todayCost = this.expensesService.getTotalCost(userId);
    this.meanCost = this.expensesService.getAverageCostPerDay(userId);
    this.dailyData = this.expensesService.gettotalCostEachDayPerType(userId);
    this.typeData = this.expensesService.getExpensesByType(userId);
  }
}
