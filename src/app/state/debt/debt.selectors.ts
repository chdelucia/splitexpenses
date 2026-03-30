import { createFeatureSelector, createSelector } from '@ngrx/store';

import { DebtState } from './debt.model';
import { selectUsers } from '@state/user/user.selectors';

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

export const selectEnrichedDebts = createSelector(
  selectDebts,
  selectUsers,
  (debts, users) => {
    const enriched: Record<string, any> = {};
    Object.entries(debts).forEach(([userId, debt]) => {
      const individualDebtsEnriched: Record<string, any> = {};
      Object.entries(debt.debts).forEach(([targetUserId, individualDebt]) => {
        individualDebtsEnriched[targetUserId] = {
          ...individualDebt,
          userName: users[targetUserId]?.name || targetUserId,
        };
      });
      enriched[userId] = {
        ...debt,
        userName: users[userId]?.name || userId,
        debts: individualDebtsEnriched,
      };
    });
    return enriched;
  },
);
