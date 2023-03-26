import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, BehaviorSubject } from 'rxjs';
import { UsersService } from '../users/shared/users.service';
import { ExpensesService } from './expenses.service';
import { Debt, Expense, IndividualDebt, User } from './models';
import { round2decimals } from './utils';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {
  private debts: Map<string, Debt> = new Map();
  private users: Observable<Map<string, User>>;

  private myPropertySubject = new BehaviorSubject<Map<string, Debt>>(new Map());
  myProperty = this.myPropertySubject.asObservable();

  constructor(
    private userService: UsersService,
    private expensesService: ExpensesService
    ) {
    this.users = this.userService.getUsers();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    let users = await firstValueFrom(this.users);
    if (!users) {
      throw new Error('No users found');
    }
    await this.createStructure(users);
    this.calcDebt();
    this.myPropertySubject.next(this.debts);

  }

  getDebts(): Map<string, Debt> {
    return this.debts;
  }

  calcDebt(): void{
    let expenses = this.expensesService.getExpenses().values();
      for (const expense of expenses) {
        this.updateExpenseDebt(expense);
      }
    this.settleCrossAccountDebts();
  }

  settleCrossAccountDebts(): void {
    this.debts.forEach((debts, debtorId) => {
      debts.debts.forEach((individualDebt, lenderId) => {
        let debtorDebt = individualDebt.newDebt || 0;
        if(debtorDebt > 0) {
          const filteredDebtsMap = new Map([...this.debts].filter(([key, value]) => key !== debtorId && key !== lenderId));
          filteredDebtsMap.forEach((indDebt, intermediaryId) => {

            let intermediaryDebtToDebtor = indDebt.debts.get(debtorId)?.newDebt || 0;
            if(intermediaryDebtToDebtor > 0) {
              let diff = Math.min(debtorDebt, intermediaryDebtToDebtor);
              let lenderDebtToIntermediary = indDebt.debts.get(lenderId)?.newDebt || 0;

              //negative amount: means lender has a debt with the intermediary
              if(lenderDebtToIntermediary < 0) {
                diff = Math.min(diff, Math.abs(lenderDebtToIntermediary));
                //reduce debt between the lender and the intermediary
                this.debts.get(lenderId)!.debts.get(intermediaryId)!.newDebt! += diff;
              } else {
                //transfers the debt to the intermediary
                this.debts.get(lenderId)!.debts.get(intermediaryId)!.newDebt! -= diff;
              }

              //settling the debts of the intermediary with the debtor
              indDebt.debts.get(debtorId)!.newDebt! -= diff;
              indDebt.debts.get(lenderId)!.newDebt! += diff;

              //settlement of debts owed by the debtor to the intermediary and the lender
              debts.debts.get(intermediaryId)!.newDebt! += diff;
              individualDebt.newDebt! -= diff;

              //reduce the debt on the lender's account
              this.debts.get(lenderId)!.debts.get(debtorId)!.newDebt! += diff;
            } else {
              //this user does not have debts with you. go next
            }
          });
        }
      });
    });
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
      RefDebtsIds: []
    };
  }



  reset(){
    this.initialize();
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
    let paidByme = userId === expense.paidBy;
    let Iparticipated = expense.sharedBy.includes(userId);
    let result = oldValue;

    if(paidByme){
      result += expense.originalCost;
      if(Iparticipated){
        result -= expense.cost;
      }
    }
    return round2decimals(result);
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
    let billWasNotPaidByMe = userId !== expense.paidBy;
    let Iparticipated = expense.sharedBy.includes(userId);
    let iDidntPayIt = !expense.settleBy.includes(userId);
    let userDebts: Debt | undefined = this.debts.get(userId);
    let individualDebt: IndividualDebt | undefined = userDebts?.debts.get(expense.paidBy);
    let result = oldValue;

    if(userDebts && billWasNotPaidByMe && Iparticipated && individualDebt && iDidntPayIt) {
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

}
