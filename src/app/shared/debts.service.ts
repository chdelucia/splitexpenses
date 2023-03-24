import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { UsersService } from '../users/shared/users.service';
import { ExpensesService } from './expenses.service';
import { Debt, Expense, IndividualDebt, User } from './models';
import { round2decimals } from './utils';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {
  private debts: Map<string, Debt>;
  private users: Observable<Map<string, User>>;

  constructor(
    private userService: UsersService,
    private expensesService: ExpensesService
    ) {
    this.users = this.userService.getUsers();
    this.debts = this.createStructure();
    this.calcDebt();
  }

  getDebts(): Map<string, Debt> {
    return this.debts;
  }

  calcDebt(): void{
    let expenses = this.expensesService.getExpenses().values();
      for (const item of expenses) {
        this.updateExpenseDebt(item);
      }
  }

settleCrossAccountDebts(){
  this.debts.forEach((debts, debtorId) => {
    debts.debts.forEach((individualDebt, borrowerId) => {
      let debtorDebt = individualDebt.newDebt || 0;
      if(debtorDebt > 0) {
        const filteredDebtsMap = new Map([...this.debts].filter(([key, value]) => key !== debtorId && key !== borrowerId));
        filteredDebtsMap.forEach((indDebt, intermediaryId) => {

          let intermediaryDebtToDebtor = indDebt.debts.get(debtorId)?.newDebt || 0;
          if(intermediaryDebtToDebtor > 0) {
            let diff = Math.min(debtorDebt, intermediaryDebtToDebtor);
            let borrowerDebtToIntermediary = indDebt.debts.get(borrowerId)?.newDebt || 0

            if(borrowerDebtToIntermediary < 0) {
              diff = Math.min(diff, Math.abs(borrowerDebtToIntermediary));
              //reduce debt between the lender and intermediary
              this.debts.get(borrowerId)!.debts.get(intermediaryId)!.newDebt! += diff
            } else {
              //add the debt to the intermediary
              this.debts.get(borrowerId)!.debts.get(intermediaryId)!.newDebt! -= diff;
            }

            //settling the debts of the intermediary with the debtor
            indDebt.debts.get(debtorId)!.newDebt! -= diff;
            indDebt.debts.get(borrowerId)!.newDebt! += diff;

            //settlement of debts owed by the debtor to the intermediary and the lender
            debts.debts.get(intermediaryId)!.newDebt! += diff
            individualDebt.newDebt! -= diff;

            //reduce the debt on the lender's account
            this.debts.get(borrowerId)!.debts.get(debtorId)!.newDebt! += diff;
          }
        })
      }
    })
  })

}

  async updateExpenseDebt(expense: Expense): Promise<void> {
    let users = await firstValueFrom(this.users);
    users.forEach((user) => {
      let userDebts: Debt | undefined = this.debts.get(user.id);
      let individualDebt: IndividualDebt | undefined = userDebts?.debts.get(expense.paidBy);
      //TODO resivsar cuando entra si no he participado ni pagado hasta luegui
      if(userDebts){
        userDebts.totalIPaid = this.calcTotalAmountIpaid(user.id, expense, userDebts.totalIPaid);

        if(individualDebt) {
          individualDebt.individualtotalIveBeenPaid = this.calcTotalAmountIhaveBeenPaid(user.id, expense, individualDebt.individualtotalIveBeenPaid )
          userDebts.totalIveBeenPaid = this.calcTotalAmountIhaveBeenPaid(user.id, expense, userDebts.totalIveBeenPaid )

          individualDebt.RefDebtsIds.push(expense);
        }
      }

    });
    this.calcDirectDebtsDiff();
  }


  //TODO use await async
  createStructure(): Map<string, Debt> {
      let newMap = new Map();
      firstValueFrom(this.users).then(users => {
          if (users) {
              users.forEach(parentUser => {
                  if (parentUser) {
                      let obj1 = {
                          'totalIveBeenPaid': 0,
                          'totalIPaid': 0,
                          'debts': new Map(),
                      }
                      users.forEach(user => {
                          if (user && parentUser.id !== user.id) {
                              let obj = {
                                  'individualtotalIveBeenPaid': 0,
                                  'RefDebtsIds': [],
                              }
                              obj1.debts.set(user.id, obj);
                          }
                      })
                      newMap.set(parentUser.id, obj1);
                  }
              })
          }
      });
      return newMap;
  }


  reset(){
    this.users = this.userService.getUsers();
    this.debts = this.createStructure();
    this.calcDebt();
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
