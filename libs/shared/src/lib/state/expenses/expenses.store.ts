import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { Expense } from '@shared/models';
import { UserStore } from '@state/user/user.store';

export interface ExpensesState {
  expenses: Record<string, Expense>;
}

const initialState: ExpensesState = {
  expenses: {},
};

export const ExpensesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ expenses }, userStore = inject(UserStore)) => {
    const iterableExpenses = computed(() => Object.values(expenses()));

    const expensesDates = computed(() => [
      ...new Set(
        iterableExpenses()
          .map((expense) => expense.date)
          .reverse(),
      ),
    ]);

    const expensesGroupByDates = computed(() => {
      return iterableExpenses().reduce(
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
    });

    const expensesOrderByDateDesc = computed(() =>
      iterableExpenses()
        .slice()
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    );

    const enrichedExpenses = computed(() => {
      const users = userStore.users();
      return iterableExpenses().map((expense) => ({
        ...expense,
        paidByUserName: users[expense.paidBy]?.name || expense.paidBy,
        sharedByNames: expense.sharedBy.map((id) => users[id]?.name || id),
      }));
    });

    const enrichedExpensesOrderByDateDesc = computed(() =>
      enrichedExpenses()
        .slice()
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    );

    return {
      iterableExpenses,
      expensesDates,
      expensesGroupByDates,
      expensesOrderByDateDesc,
      enrichedExpenses,
      enrichedExpensesOrderByDateDesc,
    };
  }),
  withMethods((store) => ({
    addExpense(expense: Expense): void {
      patchState(store, (state) => ({
        expenses: { ...state.expenses, [expense.id]: expense },
      }));
    },
    addExpenses(expenses: Record<string, Expense>): void {
      patchState(store, (state) => ({
        expenses: { ...state.expenses, ...expenses },
      }));
    },
    updateExpense(expense: Expense): void {
      patchState(store, (state) => ({
        expenses: { ...state.expenses, [expense.id]: expense },
      }));
    },
    removeExpense(id: string): void {
      patchState(store, (state) => {
        const expenses = { ...state.expenses };
        delete expenses[id];
        return { expenses };
      });
    },
    clearExpenses(): void {
      patchState(store, { expenses: {} });
    },
    calcUserTotalBalance(userId: string): number {
      let total = 0;
      store.iterableExpenses().forEach((expense) => {
        const paidByme = userId === expense.paidBy;
        const Iparticipated = expense.sharedBy.includes(userId);
        if (paidByme) {
          total += expense.originalCost;
        }
        if (Iparticipated) {
          total -= expense.cost;
        }
      });
      return total;
    },
    calcTotalPaidByUserToOthers(userId: string): number {
      let total = 0;
      store.iterableExpenses().forEach((expense) => {
        const paidByme = userId === expense.paidBy;
        const Iparticipated = expense.sharedBy.includes(userId);
        if (paidByme) {
          total += expense.originalCost;
          if (Iparticipated) {
            total -= expense.cost;
          }
        }
      });
      return total;
    },
    calcTotalCost(userId?: string): number {
      let total = 0;
      store.iterableExpenses().forEach((expense) => {
        if (!userId) {
          total += expense.originalCost;
        } else if (expense.sharedBy.includes(userId)) {
          total += expense.cost;
        }
      });
      return total;
    },
  })),
);
