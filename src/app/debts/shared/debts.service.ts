import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, BehaviorSubject } from 'rxjs';
import { Debt, Expense, IndividualDebt, TraceAutoSettle, User } from 'src/app/shared/models';
import { round2decimals } from 'src/app/shared/utils';
import { UsersService } from 'src/app/users/shared/users.service';
import { ExpensesService } from 'src/app/expenses/shared/expenses.service';

@Injectable({
  providedIn: 'root'
})
export class DebtsService{
  private debts: Map<string, Debt> = new Map();
  private users$: Observable<Map<string, User>>;
  private expenses$: Observable<Expense[]>;
  private traceDebts: TraceAutoSettle[] = [];

  private myPropertySubject = new BehaviorSubject<Map<string, Debt>>(new Map());
  debtList$ = this.myPropertySubject.asObservable();

  constructor(
    private userService: UsersService,
    private expensesService: ExpensesService
    ) {
    this.users$ = this.userService.getUsers();
    this.expenses$ = this.expensesService.getIterableExpenses();
    this.initialize();
  }


  private async initialize(): Promise<void> {
    let users = await firstValueFrom(this.users$);
    if (!users) {
      throw new Error('No users found');
    }
    await this.createStructure(users);
    await this.calcDebt();
    this.traceDebts = [];
    this.settleCrossAccountDebts(users);
    this.myPropertySubject.next(this.debts);
  }

  getTraceDebts(): TraceAutoSettle[] {
    return this.traceDebts;
  }
  getDebts(): Map<string, Debt> {
    return this.debts;
  }

  async createStructure(users: Map<string,User>): Promise<void> {
    let newMap = new Map<string, Debt>();
    users.forEach(parentUser => {
      let userDebts = this.createDebtObj();
      users.forEach(user => {
        if (user && parentUser.id !== user.id) {
          let individualDebt = this.createIndividualDebtObj()
          userDebts.debts.set(user.id, individualDebt);
        }
      });
      newMap.set(parentUser.id, userDebts);

    });
    this.debts = new Map([...this.debts, ...newMap]);

  }

  private createDebtObj(): Debt {
    return {
      debts: new Map(),
      totalIveBeenPaid: 0,
      totalIPaid: 0,
      totalIowe: 0
    }
  }

  private createIndividualDebtObj(): IndividualDebt {
    return {
      individualtotalIveBeenPaid: 0,
      newDebt: 0,
      RefDebtsIds: []
    };
  }

  async calcDebt(): Promise<void>{
    let expenses = await firstValueFrom(this.expenses$);
      for (const expense of expenses) {
        this.updateExpenseDebt(expense);
      }
  }

  settleCrossAccountDebts(users: Map<string,User>): void {
    this.debts.forEach((debts, debtorId) => {
      debts.debts.forEach((individualDebt, lenderId) => {
        let debtorDebt = individualDebt.newDebt;
        if(debtorDebt > 0) {
          const filteredDebtsMap = new Map([...this.debts].filter(([key, value]) => key !== debtorId && key !== lenderId));
          filteredDebtsMap.forEach((indDebt, intermediaryId) => {

            let intermediaryDebtToDebtor = indDebt.debts.get(debtorId)?.newDebt || 0;

            if(intermediaryDebtToDebtor > 0) {

              let diff = Math.min(debtorDebt, intermediaryDebtToDebtor);
              let lenderDebtToIntermediary = this.debts.get(lenderId)?.debts.get(intermediaryId)?.newDebt || 0;

              if(lenderDebtToIntermediary > 0 && (intermediaryDebtToDebtor < lenderDebtToIntermediary)) {
                diff = Math.min(debtorDebt, lenderDebtToIntermediary);
              }

              const trace : TraceAutoSettle = {
                "debtorId": debtorId,
                "lenderId": lenderId,
                "intermediaryId": intermediaryId,
                "debtorDebt": debtorDebt,
                "intermediaryDebtToDebtor": intermediaryDebtToDebtor,
                "lenderDebtToIntermediary": lenderDebtToIntermediary,
                "amount": diff
              }
              this.traceOfAutoSettlement(trace, users);

              //TODO split each comment into a function
              //settling the debts of the intermediary with the debtor
              indDebt.debts.get(debtorId)!.newDebt! -= diff;
              indDebt.debts.get(lenderId)!.newDebt! += diff;

              //settling the debts of the debtor to the intermediary and the lender
              debts.debts.get(intermediaryId)!.newDebt! += diff;
              individualDebt.newDebt! -= diff;

              //settling the debt of the lender's account
              this.debts.get(lenderId)!.debts.get(debtorId)!.newDebt! += diff;
              this.debts.get(lenderId)!.debts.get(intermediaryId)!.newDebt! -= diff;

              //update
              debtorDebt = individualDebt.newDebt;
            }
          });
        }
      });
    });
  }

  traceOfAutoSettlement(trace: TraceAutoSettle, users: Map<string,User>){
    const debtorName = users.get(trace.debtorId)?.name!;
    const lenderName = users.get(trace.lenderId)?.name!;
    const intermediaryName = users.get(trace.intermediaryId)?.name!;
    const { debtorDebt, intermediaryDebtToDebtor , lenderDebtToIntermediary } = trace

    trace.debtorId = debtorName;
    trace.lenderId = lenderName;
    trace.intermediaryId = intermediaryName;

    if(trace.intermediaryDebtToDebtor > trace.debtorDebt) {
      //console.log('compra la deuda entera Paga el intermediario')
    }
    if (debtorDebt > intermediaryDebtToDebtor &&  lenderDebtToIntermediary < intermediaryDebtToDebtor) {
      //console.log('El intermediario se hace cargo de parte de la deuda')
    }

    if (debtorDebt > intermediaryDebtToDebtor &&  lenderDebtToIntermediary > intermediaryDebtToDebtor) {
      //console.log('El deudor compra la deuda al intermediario PAGA el deudor')
      trace.debtorId = lenderName;
      trace.lenderId = intermediaryName;
      trace.intermediaryId = debtorName;

      trace.debtorDebt = lenderDebtToIntermediary;
      trace.lenderDebtToIntermediary = intermediaryDebtToDebtor;
      trace.intermediaryDebtToDebtor = debtorDebt;
    }

    trace.finalDebtorDebt = round2decimals(trace.debtorDebt - trace.amount);
    trace.finalLenderDebt = round2decimals(Math.abs(trace.lenderDebtToIntermediary - trace.amount));
    trace.finalIntermediaryDebt = round2decimals(trace.intermediaryDebtToDebtor - trace.amount);


    this.traceDebts.push(trace);
  }

  updateExpenseDebt(expense: Expense) {
    this.updatePayerDebt(expense);
    const { sharedBy: debtorsIds } = expense;
    debtorsIds.forEach(debtorId => {
        this.updateDebtorDebt(debtorId, expense);
    });
    this.calcDirectDebtsDiff();
  }

  updatePayerDebt(expense: Expense) {
    const { paidBy: payerId } = expense;
    const payerDebts = this.debts.get(payerId);
    if (!payerDebts) {
        throw new Error(`El pagador con ID '${payerId}' no está definido.`);
    }
    payerDebts.totalIPaid = this.calcTotalAmountIpaid(payerId, expense, payerDebts.totalIPaid);
  }

  updateDebtorDebt(debtorId: string, expense: Expense) {
    const { paidBy: payerId } = expense;
    const debtorDebts = this.debts.get(debtorId);

    if (!debtorDebts) {
        throw new Error(`El deudor con ID ${debtorId} no está definido.`);
    }

    debtorDebts.totalIveBeenPaid = this.calcTotalAmountIhaveBeenPaid(debtorId, expense, debtorDebts.totalIveBeenPaid);

    const myDebtwithPayer = debtorDebts.debts.get(payerId);
    if (myDebtwithPayer) {
        myDebtwithPayer.individualtotalIveBeenPaid = this.calcTotalAmountIhaveBeenPaid(debtorId, expense, myDebtwithPayer.individualtotalIveBeenPaid);
    }
    debtorDebts.debts.get(payerId)?.RefDebtsIds.push(expense);
  }

  /**
   * If two persons have debts between theirself extract the difference
   */
  calcDirectDebtsDiff(): void {
      this.debts.forEach( (i,me) => {
        i.totalIowe = 0;
        i.debts.forEach( (j,userName) => {

          let Iowe = j.individualtotalIveBeenPaid;
          let owesMe = this.debts.get(userName)?.debts.get(me)?.individualtotalIveBeenPaid || 0;
          //j.individualtotalIPaid = owesMe;
          j.newDebt = round2decimals(Iowe - owesMe);
          i.totalIowe = round2decimals(i.totalIowe + (j.newDebt));
        });
      })
  }

  calcTotalAmountIpaid(userId: string, expense: Expense, oldValue: number): number {
    const userParticipated = expense.sharedBy.includes(userId);
    const newTotalAmount  = oldValue + expense.originalCost - (userParticipated ? expense.cost : 0);

    return round2decimals(newTotalAmount );
  }

  verifyTotalAmountIPaid(userId: string): number {
    let totalAmountIpaid = 0;
    this.debts.forEach( (item, key) => {
      if(userId !== key) {
        totalAmountIpaid += item.debts.get(userId)?.individualtotalIveBeenPaid || 0
      }
    })
    return totalAmountIpaid;
  }

  calcTotalAmountIhaveBeenPaid(userId: string, expense: Expense, oldValue: number): number {
    const iDidntPayIt = !expense.settleBy.includes(userId);
    let result = oldValue;

    if (iDidntPayIt) {
      result += expense.cost;
    }

    return round2decimals(result);
  }

  verifyTotalAmountIhaveBeenPaid(userId: string): number{
    let totalAmountIhaveBeenPaid = 0;
    this.debts.get(userId)?.debts.forEach( (debt: IndividualDebt) => {
      totalAmountIhaveBeenPaid += debt.individualtotalIveBeenPaid;
    })
    return totalAmountIhaveBeenPaid;
  }

  calcTotalAmountIAmOwed(myDebts: Debt, newDebt: number): number {
    return round2decimals(myDebts.totalIowe + (newDebt));
  }

  reset(){
    this.initialize();
  }


}