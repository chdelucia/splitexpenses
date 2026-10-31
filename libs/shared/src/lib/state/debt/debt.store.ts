import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Debt, IndividualDebt } from '@shared/models';
import { UserStore } from '@state/user/user.store';

export interface DebtState {
  debts: Record<string, Debt>;
}

const initialState: DebtState = {
  debts: {},
};

export const DebtStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ debts }, userStore = inject(UserStore)) => {
    const iterableDebts = computed(() => Object.values(debts()));

    const enrichedDebts = computed(() => {
      const users = userStore.users();
      const currentDebts = debts();
      const enriched: Record<string, Debt> = {};

      Object.entries(currentDebts).forEach(([userId, debt]) => {
        const individualDebtsEnriched: Record<string, IndividualDebt> = {};
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
    });

    return {
      iterableDebts,
      enrichedDebts,
    };
  }),
  withMethods((store) => ({
    updateDebts(debts: Record<string, Debt>): void {
      patchState(store, (state) => ({
        debts: { ...state.debts, ...debts },
      }));
    },
  })),
);
