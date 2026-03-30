import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DebtState } from './debt.model';
import { Expense, User, Debt, IndividualDebt, TraceAutoSettle } from '@shared/models';
import { selectUsers } from '@state/user/user.selectors';
import { selectIterableExpenses } from '@state/expenses/expenses.selectors';

const selectDebtsState = createFeatureSelector<DebtState>('debts');

export const selectDebts = createSelector(
  selectDebtsState,
  (state) => state.debts,
);

export const selectDebtsByID = (id: string) =>
  createSelector(selectDebts, (debts) => debts[id]);

export const selectIterableDebts = createSelector(selectDebts, (debt) =>
  Object.values(debt),
);

// Calculation Logic moved to selectors
const createDebtObj = (): Debt => ({
  debts: {},
  totalIveBeenPaid: 0,
  totalIPaid: 0,
  totalIowe: 0,
});

const createIndividualDebtObj = (): IndividualDebt => ({
  individualtotalIveBeenPaid: 0,
  newDebt: 0,
  RefDebtsIds: [],
});

const calcTotalAmountIpaid = (
  userId: string,
  expense: Expense,
  oldValue: number,
): number => {
  const userParticipated = expense.sharedBy.includes(userId);
  return oldValue + expense.originalCost - (userParticipated ? expense.cost : 0);
};

const calcTotalAmountIhaveBeenPaid = (
  userId: string,
  expense: Expense,
  oldValue: number,
): number => {
  const iDidntPayIt = !expense.settleBy.includes(userId);
  return iDidntPayIt ? oldValue + expense.cost : oldValue;
};

const traceOfAutoSettlement = (trace: TraceAutoSettle, users: Record<string, User>, debtTracing: TraceAutoSettle[]) => {
    const debtorName = users[trace.debtorId]?.name || trace.debtorId;
    const lenderName = users[trace.lenderId]?.name || trace.lenderId;
    const intermediaryName = users[trace.intermediaryId]?.name || trace.intermediaryId;
    const { debtorDebt, intermediaryDebtToDebtor, lenderDebtToIntermediary } =
      trace;

    trace.debtorId = debtorName;
    trace.lenderId = lenderName;
    trace.intermediaryId = intermediaryName;

    if (
      debtorDebt > intermediaryDebtToDebtor &&
      lenderDebtToIntermediary > intermediaryDebtToDebtor
    ) {
      trace.debtorId = lenderName;
      trace.lenderId = intermediaryName;
      trace.intermediaryId = debtorName;

      trace.debtorDebt = lenderDebtToIntermediary;
      trace.lenderDebtToIntermediary = intermediaryDebtToDebtor;
      trace.intermediaryDebtToDebtor = debtorDebt;
    }

    trace.finalDebtorDebt = trace.debtorDebt - trace.amount;
    trace.finalLenderDebt = Math.abs(
      trace.lenderDebtToIntermediary - trace.amount,
    );
    trace.finalIntermediaryDebt = trace.intermediaryDebtToDebtor - trace.amount;

    debtTracing.push(trace);
};

export const selectCalculatedDebtsAndTracing = createSelector(
  selectUsers,
  selectIterableExpenses,
  (users, expenses) => {
    const debtTracing: TraceAutoSettle[] = [];
    if (!Object.keys(users).length || !expenses.length) return { debts: {}, tracing: debtTracing };

    const debts: Record<string, Debt> = {};

    // Create Structure
    Object.values(users).forEach((parentUser) => {
      const userDebts = createDebtObj();
      Object.values(users).forEach((user) => {
        if (user && parentUser.id !== user.id) {
          userDebts.debts[user.id] = createIndividualDebtObj();
        }
      });
      debts[parentUser.id] = userDebts;
    });

    // Calc Debt
    expenses.forEach(expense => {
        const { paidBy: payerId, sharedBy: debtorsIds } = expense;
        const payerDebts = debts[payerId];
        if (payerDebts) {
            payerDebts.totalIPaid = calcTotalAmountIpaid(payerId, expense, payerDebts.totalIPaid);
        }

        debtorsIds.forEach((debtorId) => {
            const debtorDebts = debts[debtorId];
            if (debtorDebts) {
                if (payerId !== debtorId) {
                    debtorDebts.totalIveBeenPaid = calcTotalAmountIhaveBeenPaid(debtorId, expense, debtorDebts.totalIveBeenPaid);
                }
                const myDebtwithPayer = debtorDebts.debts[payerId];
                if (myDebtwithPayer) {
                    myDebtwithPayer.individualtotalIveBeenPaid = calcTotalAmountIhaveBeenPaid(debtorId, expense, myDebtwithPayer.individualtotalIveBeenPaid);
                    myDebtwithPayer.RefDebtsIds.push(expense);
                }
            }
        });
    });

    // Calc Direct Debts Diff
    Object.entries(debts).forEach(([me, i]) => {
      i.totalIowe = 0;
      Object.entries(i.debts).forEach(([userName, j]) => {
        const Iowe = j.individualtotalIveBeenPaid;
        const owesMe = debts[userName]?.debts[me]?.individualtotalIveBeenPaid || 0;
        j.newDebt = Iowe - owesMe;
        i.totalIowe += j.newDebt;
      });
    });

    // Settle Cross Account Debts
    Object.entries(debts).forEach(([debtorId, debtsObj]) => {
      Object.entries(debtsObj.debts).forEach(([lenderId, individualDebt]) => {
        let debtorDebt = individualDebt.newDebt;
        if (debtorDebt > 0) {
          const filteredDebts = Object.entries(debts).filter(([key]) => key !== debtorId && key !== lenderId);
          filteredDebts.forEach(([intermediaryId, indDebt]) => {
            const intermediaryDebtToDebtor = indDebt.debts[debtorId]?.newDebt || 0;
            if (intermediaryDebtToDebtor > 0) {
              let diff = Math.min(debtorDebt, intermediaryDebtToDebtor);
              const lenderDebtToIntermediary = debts[lenderId]?.debts[intermediaryId]?.newDebt || 0;
              if (lenderDebtToIntermediary > 0 && intermediaryDebtToDebtor < lenderDebtToIntermediary) {
                diff = Math.min(debtorDebt, lenderDebtToIntermediary);
              }

              const trace: TraceAutoSettle = {
                debtorId: debtorId,
                lenderId: lenderId,
                intermediaryId: intermediaryId,
                debtorDebt: debtorDebt,
                intermediaryDebtToDebtor: intermediaryDebtToDebtor,
                lenderDebtToIntermediary: lenderDebtToIntermediary,
                amount: diff,
              };
              traceOfAutoSettlement(trace, users, debtTracing);

              indDebt.debts[debtorId]!.newDebt! -= diff;
              indDebt.debts[lenderId]!.newDebt! += diff;
              debtsObj.debts[intermediaryId]!.newDebt! += diff;
              individualDebt.newDebt! -= diff;
              debts[lenderId]!.debts[debtorId]!.newDebt! += diff;
              debts[lenderId]!.debts[intermediaryId]!.newDebt! -= diff;
              debtorDebt = individualDebt.newDebt;
            }
          });
        }
      });
    });

    return { debts, tracing: debtTracing };
  }
);

export const selectCalculatedDebts = createSelector(
  selectCalculatedDebtsAndTracing,
  (result) => result.debts
);

export const selectDebtTracing = createSelector(
  selectCalculatedDebtsAndTracing,
  (result) => result.tracing
);
