import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExpensesState } from './expenses.reducer';
import { Expense } from '@shared/models';
import { diffinDays } from '@shared/utils';

const selectExpensesState = createFeatureSelector<ExpensesState>('expenses');

export const selectExpenses = createSelector(
  selectExpensesState,
  (state) => state.expenses,
);

export const selectExpenseByID = (id: string) =>
  createSelector(selectExpenses, (expense) => expense[id]);

export const selectIterableExpenses = createSelector(
  selectExpenses,
  (expenses) => Object.values(expenses),
);

export const selectExpensesFilterByType = (filter: string) =>
  createSelector(selectIterableExpenses, (expenses) =>
    expenses.filter((expense) => expense.date === filter),
  );

export const selectExpensesDates = createSelector(
  selectIterableExpenses,
  (expenses) => [...new Set(expenses.map((expense) => expense.date).reverse())],
);

export const selectExpensesGroupByDates = createSelector(
  selectIterableExpenses,
  (expenses) => {
    return expenses.reduce(
      (acumulador, expense) => {
        const date = expense.date;

        if (!acumulador[date]) {
          acumulador[date] = [];
        }

        acumulador[date].push(expense);

        return acumulador;
      },
      {} as Record<string, Expense[]>,
    );
  },
);

export const selectExpensesOrderByDateDesc = createSelector(
  selectIterableExpenses,
  (expenses) =>
    expenses
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
);

export const selectTotalCost = (userId?: string) =>
  createSelector(selectIterableExpenses, (expenses) => {
    return expenses.reduce((total, expense) => {
      if (!userId) {
        return total + expense.originalCost;
      }
      if (expense.sharedBy.includes(userId)) {
        return total + expense.cost;
      }
      return total;
    }, 0);
  });

export const selectTotalDays = createSelector(
  selectIterableExpenses,
  (expenses) => {
    if (expenses.length > 1) {
      const sorted = expenses
        .slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const date1 = sorted[0].date;
      const date2 = sorted[sorted.length - 1].date;
      return diffinDays(date1, date2) + 1;
    }
    return 1;
  },
);

export const selectAverageCostPerDay = (userId?: string) =>
  createSelector(
    selectTotalCost(userId),
    selectTotalDays,
    (totalCost, totalDays) => totalCost / totalDays,
  );

export const selectExpensesByType = (
  userId: string | undefined,
  types: string[],
) =>
  createSelector(selectIterableExpenses, (expenses) => {
    const data = Array(types.length).fill(0);
    expenses.forEach((item) => {
      const index = parseInt(item.typeId);
      if (userId && item.sharedBy.includes(userId)) {
        data[index] = data[index] + item.cost;
      } else if (!userId) {
        data[index] = data[index] + item.originalCost;
      }
    });
    return { labels: types, data: data };
  });

export const selectTotalCostEachDayPerType = (
  userId: string | undefined,
  types: Record<string, { name: string }>,
  bgColors: string[],
) =>
  createSelector(selectIterableExpenses, (expensesArray) => {
    const result = expensesArray.reduce(
      (r, a) => {
        r[a.date] = r[a.date] || [];
        r[a.date].push(a);
        return r;
      },
      {} as Record<string, Expense[]>,
    );

    const yAxis = Object.keys(result);
    const typesKeys = Object.keys(types);

    const stackedxAxis = typesKeys.map((key, i) => ({
      label: types[key]?.name || '',
      data: Array(yAxis.length).fill(0),
      backgroundColor: bgColors[i],
    }));

    yAxis.forEach((date, i) => {
      const expenses = result[date];
      expenses.forEach((expense) => {
        const typeIndex = parseInt(expense.typeId);
        if (userId && expense.sharedBy.includes(userId)) {
          stackedxAxis[typeIndex].data[i] += expense.cost;
        } else if (!userId) {
          stackedxAxis[typeIndex].data[i] += expense.originalCost;
        }
      });
    });

    return { labels: yAxis, data: stackedxAxis };
  });
