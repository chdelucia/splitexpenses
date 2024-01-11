import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExpensesState } from './expenses.reducer';
import { Expense } from '../../shared/models';

const selectExpensesState = createFeatureSelector<ExpensesState>('expenses');

export const selectExpenses = createSelector(
  selectExpensesState,
  (state) => state.expenses,
);

export const selectExpenseByID = (id: string) =>
  createSelector(selectExpenses, (expense) => expense.get(id));

export const selectIterableExpenses = createSelector(
  selectExpenses,
  (expenses) => Array.from(expenses.values()),
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
