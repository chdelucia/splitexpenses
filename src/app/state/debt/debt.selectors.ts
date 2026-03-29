import { createFeatureSelector, createSelector } from '@ngrx/store';

import { DebtState } from './debt.model';

const selectExpensesState = createFeatureSelector<DebtState>('debts');

export const selectDebts = createSelector(
  selectExpensesState,
  (state) => state.debts,
);

export const selectDebtsByID = (id: string) =>
  createSelector(selectDebts, (debts) => debts[id]);

export const selectIterableDebts = createSelector(selectDebts, (debt) =>
  Object.values(debt),
);
