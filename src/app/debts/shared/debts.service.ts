import { Injectable, Signal } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import {
  Debt,
  Expense,
  IndividualDebt,
  TraceAutoSettle,
  User,
} from '@shared/models';
import {
  selectDebts,
  selectDebtsByID,
  selectIterableDebts,
} from '@state/debt/debt.selectors';
import { UpdateDebts } from '@state/debt/debt.actions';
import { Store } from '@ngrx/store';
import { selectUsers } from '@state/user/user.selectors';
import { selectIterableExpenses } from '@state/expenses/expenses.selectors';

@Injectable({
  providedIn: 'root',
})
export class DebtsService {
  private debts: Record<string, Debt> = {};
  private debtTracing: TraceAutoSettle[] = [];

  debtsSignal: Signal<Record<string, Debt>> = this.store.selectSignal(selectDebts);
  iterableDebtsSignal: Signal<Array<Debt>> =
    this.store.selectSignal(selectIterableDebts);

  constructor(private store: Store) {
    combineLatest([
      this.store.select(selectUsers),
      this.store.select(selectIterableExpenses),
    ]).subscribe(([users, expenses]) => {
      if (Object.keys(users).length && expenses.length) {
        this.initialize(users, expenses);
      }
    });
  }

  updateDebts(debts: Record<string, Debt>) {
    this.store.dispatch(UpdateDebts({ debts }));
  }

  getDebts(): Observable<Record<string, Debt>> {
    return this.store.select(selectDebts);
  }

  getUserByID(id: string): Observable<Debt | undefined> {
    return this.store.select(selectDebtsByID(id));
  }

  getIterableDebts(): Observable<Array<Debt>> {
    return this.store.select(selectIterableDebts);
  }

  initialize(users: Record<string, User>, expenses: Expense[]): void {
    this.createStructure(users);
    this.calcDebt(expenses);
    this.settleCrossAccountDebts(users);
    this.updateDebts(this.debts);
  }

  getDebtTracing(): TraceAutoSettle[] {
    return this.debtTracing;
  }

  createStructure(users: Record<string, User>): void {
    const newDebts: Record<string, Debt> = {};
    Object.values(users).forEach((parentUser) => {
      const userDebts = this.createDebtObj();
      Object.values(users).forEach((user) => {
        if (user && parentUser.id !== user.id) {
          const individualDebt = this.createIndividualDebtObj();
          userDebts.debts[user.id] = individualDebt;
        }
      });
      newDebts[parentUser.id] = userDebts;
    });
    this.debts = { ...newDebts };
  }

  private createDebtObj(): Debt {
    return {
      debts: {},
      totalIveBeenPaid: 0,
      totalIPaid: 0,
      totalIowe: 0,
    };
  }

  private createIndividualDebtObj(): IndividualDebt {
    return {
      individualtotalIveBeenPaid: 0,
      newDebt: 0,
      RefDebtsIds: [],
    };
  }

  calcDebt(expenses: Expense[]): void {
    for (const expense of expenses) {
      this.updateExpenseDebt(expense);
    }
  }

  settleCrossAccountDebts(users: Record<string, User>): void {
    this.debtTracing = [];
    Object.entries(this.debts).forEach(([debtorId, debts]) => {
      Object.entries(debts.debts).forEach(([lenderId, individualDebt]) => {
        let debtorDebt = individualDebt.newDebt;
        if (debtorDebt > 0) {
          const filteredDebts = Object.entries(this.debts).filter(
            ([key]) => key !== debtorId && key !== lenderId,
          );
          filteredDebts.forEach(([intermediaryId, indDebt]) => {
            const intermediaryDebtToDebtor =
              indDebt.debts[debtorId]?.newDebt || 0;

            if (intermediaryDebtToDebtor > 0) {
              let diff = Math.min(debtorDebt, intermediaryDebtToDebtor);
              const lenderDebtToIntermediary =
                this.debts[lenderId]?.debts[intermediaryId]?.newDebt || 0;

              if (
                lenderDebtToIntermediary > 0 &&
                intermediaryDebtToDebtor < lenderDebtToIntermediary
              ) {
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
              this.traceOfAutoSettlement(trace, users);

              //TODO split each comment into a function
              //settling the debts of the intermediary with the debtor
              indDebt.debts[debtorId]!.newDebt! -= diff;
              indDebt.debts[lenderId]!.newDebt! += diff;

              //settling the debts of the debtor to the intermediary and the lender
              debts.debts[intermediaryId]!.newDebt! += diff;
              individualDebt.newDebt! -= diff;

              //settling the debt of the lender's account
              this.debts[lenderId]!.debts[debtorId]!.newDebt! += diff;
              this.debts[lenderId]!.debts[intermediaryId]!.newDebt! -= diff;

              //update
              debtorDebt = individualDebt.newDebt;
            }
          });
        }
      });
    });
  }

  traceOfAutoSettlement(trace: TraceAutoSettle, users: Record<string, User>) {
    const debtorName = users[trace.debtorId]!.name;
    const lenderName = users[trace.lenderId]!.name;
    const intermediaryName = users[trace.intermediaryId]!.name;
    const { debtorDebt, intermediaryDebtToDebtor, lenderDebtToIntermediary } =
      trace;

    trace.debtorId = debtorName;
    trace.lenderId = lenderName;
    trace.intermediaryId = intermediaryName;

    if (trace.intermediaryDebtToDebtor > trace.debtorDebt) {
      //console.log('compra la deuda entera Paga el intermediario')
    }
    if (
      debtorDebt > intermediaryDebtToDebtor &&
      lenderDebtToIntermediary < intermediaryDebtToDebtor
    ) {
      //console.log('El intermediario se hace cargo de parte de la deuda')
    }

    if (
      debtorDebt > intermediaryDebtToDebtor &&
      lenderDebtToIntermediary > intermediaryDebtToDebtor
    ) {
      //console.log('El deudor compra la deuda al intermediario PAGA el deudor')
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

    this.debtTracing.push(trace);
  }

  updateExpenseDebt(expense: Expense) {
    this.updatePayerDebt(expense);
    const { sharedBy: debtorsIds } = expense;
    debtorsIds.forEach((debtorId) => {
      this.updateDebtorDebt(debtorId, expense);
    });
    this.calcDirectDebtsDiff();
  }

  updatePayerDebt(expense: Expense) {
    const { paidBy: payerId } = expense;
    const payerDebts = this.debts[payerId];
    if (!payerDebts) {
      throw new Error(`El pagador con ID '${payerId}' no está definido.`);
    }
    payerDebts.totalIPaid = this.calcTotalAmountIpaid(
      payerId,
      expense,
      payerDebts.totalIPaid,
    );
  }

  updateDebtorDebt(debtorId: string, expense: Expense) {
    const { paidBy: payerId } = expense;
    const debtorDebts = this.debts[debtorId];

    if (!debtorDebts) {
      throw new Error(`El deudor con ID ${debtorId} no está definido.`);
    }

    if (payerId !== debtorId) {
      debtorDebts.totalIveBeenPaid = this.calcTotalAmountIhaveBeenPaid(
        debtorId,
        expense,
        debtorDebts.totalIveBeenPaid,
      );
    }

    const myDebtwithPayer = debtorDebts.debts[payerId];
    if (myDebtwithPayer) {
      myDebtwithPayer.individualtotalIveBeenPaid =
        this.calcTotalAmountIhaveBeenPaid(
          debtorId,
          expense,
          myDebtwithPayer.individualtotalIveBeenPaid,
        );
    }
    debtorDebts.debts[payerId]?.RefDebtsIds.push(expense);
  }

  /**
   * If two persons have debts between theirself extract the difference
   */
  calcDirectDebtsDiff(): void {
    Object.entries(this.debts).forEach(([me, i]) => {
      i.totalIowe = 0;
      Object.entries(i.debts).forEach(([userName, j]) => {
        const Iowe = j.individualtotalIveBeenPaid;
        const owesMe =
          this.debts[userName]?.debts[me]?.individualtotalIveBeenPaid || 0;
        //j.individualtotalIPaid = owesMe;
        j.newDebt = Iowe - owesMe;
        i.totalIowe = i.totalIowe + j.newDebt;
      });
    });
  }

  calcTotalAmountIpaid(
    userId: string,
    expense: Expense,
    oldValue: number,
  ): number {
    const userParticipated = expense.sharedBy.includes(userId);
    const newTotalAmount =
      oldValue + expense.originalCost - (userParticipated ? expense.cost : 0);

    return newTotalAmount;
  }

  verifyTotalAmountIPaid(userId: string): number {
    let totalAmountIpaid = 0;
    Object.entries(this.debts).forEach(([key, item]) => {
      if (userId !== key) {
        totalAmountIpaid += item.debts[userId]?.individualtotalIveBeenPaid || 0;
      }
    });
    return totalAmountIpaid;
  }

  calcTotalAmountIhaveBeenPaid(
    userId: string,
    expense: Expense,
    oldValue: number,
  ): number {
    const iDidntPayIt = !expense.settleBy.includes(userId);
    let result = oldValue;

    if (iDidntPayIt) {
      result += expense.cost;
    }

    return result;
  }

  verifyTotalAmountIhaveBeenPaid(userId: string): number {
    let totalAmountIhaveBeenPaid = 0;
    const userDebts = this.debts[userId];
    if (userDebts) {
      Object.values(userDebts.debts).forEach((debt: IndividualDebt) => {
        totalAmountIhaveBeenPaid += debt.individualtotalIveBeenPaid;
      });
    }
    return totalAmountIhaveBeenPaid;
  }

  calcTotalAmountIAmOwed(myDebts: Debt, newDebt: number): number {
    return myDebts.totalIowe + newDebt;
  }
}
