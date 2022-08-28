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

  updateExpenseDebt(item: Expense): void {
    this.users.forEach(user => {
      let billWasNotPaidByMe = user.id !== item.paidBy;

      if(billWasNotPaidByMe) {

        let allDebts: Debt | undefined = this.debts.get(user.id);
        let individualDebt: IndividualDebt | undefined = allDebts?.debts.get(item.paidBy);

        if(individualDebt && allDebts) {
          individualDebt.individualTotalDebts = round2decimals(individualDebt?.individualTotalDebts + item.cost);
          individualDebt.RefDebtsIds.push(item);
          allDebts.totalDebts = round2decimals(allDebts.totalDebts + item.cost);
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
          'totalDebts': 0,
          'debts': new Map(),
        }
        
        this.users.forEach(user => {
          if (parentUser.id !== user.id) {
            let obj = {
              'individualTotalDebts': 0,
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
    this.debts = this.createStructure();
    this.calcDebt();
  }

  /**
   * If two persons have deubts between theirself extract the difference 
   */
  calcDirectDebtsDiff(): void {
      this.debts.forEach( (i,me) => {
        i.debts.forEach( (j,userName) => {

          let Iowe = j.individualTotalDebts;
          let owesMe = this.debts.get(userName)?.debts.get(me)?.individualTotalDebts || 0;

          if(Iowe > owesMe) {
            j.newDebt = Iowe - owesMe;
          } else if ( Iowe === owesMe || owesMe > Iowe) {
            j.newDebt = 0
          } else {
            console.error('unexpected');
          }

        });
      })
  }
}
