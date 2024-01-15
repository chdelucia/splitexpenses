import { createAction, props } from '@ngrx/store';
import { Expense } from '@shared/models/models';

export const addExpense = createAction(
  '[Expense] Add Expense',
  props<{ expense: Expense }>(),
);
export const updateExpense = createAction(
  '[Expenses] Update Expense',
  props<{ expense: Expense }>(),
);
export const removeExpense = createAction(
  '[Expenses] Remove Expense',
  props<{ id: string }>(),
);
export const addExpenses = createAction(
  '[Expenses] Add Expenses',
  props<{ expenses: Map<string, Expense> }>(),
);
