import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Expense, Settings } from '@shared/models';
import { diffinDays } from '@shared/utils';
import {
  selectExpenses,
  selectTotalCost,
} from '@state/expenses/expenses.selectors';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private storageService = inject(LocalstorageService);
  private store = inject(Store);

  private settings: Settings;
  expenses = this.store.selectSignal(selectExpenses);

  constructor() {
    this.settings = this.storageService.getSettings();
  }

  /* Calculate by group if user not given */
  getTotalCost(userId?: string): number {
    return this.store.selectSignal(selectTotalCost(userId))();
  }

  getAverageCostPerDay(userId?: string): number {
    const totalCost = this.getTotalCost(userId);
    const totalDays = this.getTotalDays();
    return totalCost / totalDays;
  }

  getTotalDays(): number {
    const expenses = Object.values(this.expenses());

    if (expenses.length > 1) {
      const data1 = expenses[0]?.date || '';
      const date2 = expenses[expenses.length - 1]?.date || '';

      return diffinDays(data1, date2) + 1;
    } else {
      return 1;
    }
  }

  getExpensesByType(userId?: string): {
    labels: Array<string>;
    data: Array<number>;
  } {
    const data = Array(Object.keys(this.settings.graph.types).length).fill(0);
    const labels: string[] = [];
    Object.values(this.settings.graph.types).forEach((item) => {
      labels.push(item.name);
    });

    Object.values(this.expenses()).forEach((item) => {
      const index = parseInt(item.typeId);
      if (userId && item.sharedBy.includes(userId)) {
        data[index] = data[index] + item.cost;
      } else if (!userId) {
        data[index] = data[index] + item.originalCost;
      }
    });
    return { labels: labels, data: data };
  }

  getTotalCostEachDay(userId?: string): {
    labels: Array<string>;
    data: Array<number>;
  } {
    const dates: Array<string> = [];
    const expenses = Object.values(this.expenses());
    expenses.forEach((expense) => {
      if (!dates.includes(expense.date)) {
        dates.push(expense.date);
      }
    });

    const xAxis: Array<number> = Array(dates.length).fill(0);
    dates.forEach((date, i) => {
      expenses.forEach((expense) => {
        if (
          userId &&
          expense.sharedBy.includes(userId) &&
          expense.date === date
        ) {
          xAxis[i] += expense.cost;
        } else if (!userId && expense.date === date) {
          xAxis[i] += expense.originalCost;
        }
      });
    });

    return { labels: dates, data: xAxis };
  }

  gettotalCostEachDayPerType(userId?: string): {
    labels: Array<string>;
    data: Array<any>;
  } {
    const expensesArray = Object.values(this.expenses());
    // Create Object of expenses group by Day
    const result = expensesArray.reduce((r, a) => {
      r[a.date] = r[a.date] || [];
      r[a.date].push(a);
      return r;
    }, Object.create(null));

    const yAxis = Object.keys(result);

    // Create stacked xAxis
    const stackedxAxis: Array<{
      label: string;
      data: Array<number>;
      backgroundColor: string;
    }> = [];
    const typesCount = Object.keys(this.settings.graph.types).length;
    for (let i = 0; i < typesCount; i++) {
      stackedxAxis[i] = {
        label: this.settings.graph.types[i.toString()]?.name || '',
        data: Array(yAxis.length).fill(0),
        backgroundColor: this.settings.graph.bgColors[i],
      };
    }

    for (let i = 0; i < yAxis.length; i++) {
      const name = yAxis[i];
      const expenses: Array<Expense> = result[name];

      expenses.forEach((expense) => {
        const typeIndex = parseInt(expense.typeId);
        if (userId && expense.sharedBy.includes(userId)) {
          stackedxAxis[typeIndex].data[i] += expense.cost;
        } else if (!userId) {
          stackedxAxis[typeIndex].data[i] += expense.originalCost;
        }
      });
    }
    return { labels: yAxis, data: stackedxAxis };
  }
}
