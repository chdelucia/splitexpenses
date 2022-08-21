import { Injectable } from '@angular/core';
import { ExpensesService } from './expenses.service';
import { Debt, Expense, IndividualDebt } from './models';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {
  private debts: Map<string, Debt>;
  private users: Array<string>;

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
    this.users.forEach(userName => {
      let billWasNotPaidByMe = userName !== item.paidBy;

      if(billWasNotPaidByMe) {

        let allDebts: Debt | undefined = this.debts.get(userName);
        let individualDebt: IndividualDebt | undefined = allDebts?.debts.get(item.paidBy);

        if(individualDebt && allDebts) {
          individualDebt.individualTotalDebts = individualDebt?.individualTotalDebts + item.cost;
          individualDebt.RefDebtsIds.push(item);
          allDebts.totalDebts = allDebts.totalDebts + item.cost;
        }
      }
    });
    this.calcDirectDebtsDiff();
  }

  createStructure(): Map<string, Debt> {
    let newMap = new Map();
    if(this.users){
      this.users.forEach(parentUserName => {
        let obj1 = {
          'totalDebts': 0,
          'debts': new Map(),
        }
        
        this.users.forEach(userName => {
          if (parentUserName !== userName) {
            let obj = {
              'individualTotalDebts': 0,
              'RefDebtsIds': [],
            }     
            obj1.debts.set(userName, obj);
          }
        })
    
        newMap.set(parentUserName, obj1);
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
