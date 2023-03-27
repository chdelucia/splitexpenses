import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExpensesState } from './expenses.reducer';



const selectExpensesState = createFeatureSelector<ExpensesState>('expenses');

export const selectExpenses = createSelector(
  selectExpensesState,
  (state) => state.expenses
);

export const selectExpenseByID = (id: string) => createSelector(
  selectExpenses,
  (expense) => expense.get(id)
);

export const selectIterableExpenses = createSelector(
  selectExpenses,
  (expenses) => Array.from(expenses.values())
);

export const selectExpensesFilterByType = (filter: string) => createSelector(
  selectIterableExpenses,
  (expenses) => expenses.filter((expense) => expense.date === filter)
);

export const selectExpensesDates = createSelector(
  selectIterableExpenses,
  (expenses) => [...new Set(expenses.map((expense) => expense.date).reverse())]
);
