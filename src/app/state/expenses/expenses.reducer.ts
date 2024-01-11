import { createReducer, on } from '@ngrx/store';
import {
  addExpense,
  updateExpense,
  removeExpense,
  addExpenses,
} from './expenses.actions';
import { Expense } from '../../shared/models';

export interface ExpensesState {
  expenses: Map<string, Expense>;
}

const initialState: ExpensesState = {
  expenses: new Map<string, Expense>(),
};

export const expensesReducer = createReducer(
  initialState,
  on(addExpense, (state, { expense }) => {
    const expenses = new Map<string, Expense>(state.expenses);
    expenses.set(expense.id, expense);
    return { ...state, expenses };
  }),
  on(updateExpense, (state, { expense }) => {
    const expenses = new Map<string, Expense>(state.expenses);
    expenses.set(expense.id, expense);
    return { ...state, expenses };
  }),
  on(removeExpense, (state, { id }) => {
    const expenses = new Map<string, Expense>(state.expenses);
    expenses.delete(id);
    return { ...state, expenses };
  }),
  on(
    addExpenses,
    (state, { expenses }): ExpensesState => ({
      ...state,
      expenses: new Map([...state.expenses, ...expenses]),
    }),
  ),
);
