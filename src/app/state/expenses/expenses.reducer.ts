import { createReducer, on } from '@ngrx/store';
import {
  addExpense,
  updateExpense,
  removeExpense,
  addExpenses,
} from './expenses.actions';
import { Expense } from '@shared/models';

export interface ExpensesState {
  expenses: Record<string, Expense>;
}

const initialState: ExpensesState = {
  expenses: {},
};

export const expensesReducer = createReducer(
  initialState,
  on(addExpense, (state, { expense }) => {
    return {
      ...state,
      expenses: { ...state.expenses, [expense.id]: expense },
    };
  }),
  on(updateExpense, (state, { expense }) => {
    return {
      ...state,
      expenses: { ...state.expenses, [expense.id]: expense },
    };
  }),
  on(removeExpense, (state, { id }) => {
    const { [id]: _, ...expenses } = state.expenses;
    return { ...state, expenses };
  }),
  on(
    addExpenses,
    (state, { expenses }): ExpensesState => ({
      ...state,
      expenses: { ...state.expenses, ...expenses },
    }),
  ),
);
