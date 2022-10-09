import { Injectable } from '@angular/core';
import { ExpensesService } from './expenses.service';
import { Debt, Expense, IndividualDebt, User } from './models';
import { UsersService } from './users.service';
import { round2decimals } from './utils';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {
  private debts: Map<string, Debt>;
  private users: Map<string, User>;

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

  updateExpenseDebt(expense: Expense): void {
    this.users.forEach(user => {
      let userDebts: Debt | undefined = this.debts.get(user.id);
      let individualDebt: IndividualDebt | undefined = userDebts?.debts.get(expense.paidBy);

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

  createStructure(): Map<string, Debt> {
    let newMap = new Map();
    if(this.users){
      this.users.forEach(parentUser => {
        let obj1 = {
          'totalIveBeenPaid': 0,
          'totalIPaid': 0,
          'debts': new Map(),
        }
        
        this.users.forEach(user => {
          if (parentUser.id !== user.id) {
            let obj = {
              'individualtotalIveBeenPaid': 0,
              'RefDebtsIds': [],
            }     
            obj1.debts.set(user.id, obj);
          }
        })
    
        newMap.set(parentUser.id, obj1);
      })
    }

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
      result += expense.originalCost
      if(Iparticipated){
        result -= expense.cost
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
