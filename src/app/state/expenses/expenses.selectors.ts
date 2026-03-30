import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExpensesState } from './expenses.reducer';
import { Expense } from '@shared/models';
import { selectUsers } from '@state/user/user.selectors';

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

export const selectEnrichedExpenses = createSelector(
  selectIterableExpenses,
  selectUsers,
  (expenses, users) => {
    return expenses.map((expense) => ({
      ...expense,
      paidByUserName: users[expense.paidBy]?.name || expense.paidBy,
      sharedByNames: expense.sharedBy.map((id) => users[id]?.name || id),
    }));
  },
);

export const selectEnrichedExpensesOrderByDateDesc = createSelector(
  selectEnrichedExpenses,
  (expenses) =>
    expenses
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
);
