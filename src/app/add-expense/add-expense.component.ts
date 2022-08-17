import { Component, OnInit } from '@angular/core';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { Debt, Expense, IndividualDebt } from '../shared/models';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.less']
})
export class AddExpenseComponent implements OnInit {
  users: Array<string>
  expenses: Map<number, Expense>
  debts: Map<string, Debt>;

  inputValueCost = NaN;
  inputValueTitle = '';

  showAlert = false;
  isError = false;
  

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    private debtsService: DebtsService
    ) {
    this.users = this.usersService.getUsers();
    this.expenses = this.expensesService.getExpenses();
    this.debts = this.debtsService.getDebts();
  }

  ngOnInit(): void {
  }
  
  add(user:string, cost:string, title:string) {
    let costb = parseFloat(cost) / this.users.length;
    const obj: Expense = {
      "id": 0,
      "title": title,
      "cost": costb,
      "date": new Date().toLocaleDateString('ES', { weekday: 'long', day: 'numeric' }),
      "paidBy": user
    }

    this.expensesService.addExpense(obj);
    this.debtsService.updateExpenseDebt(obj);

    this.clearInput();
    this.showAlert = true;

    this.debts = this.debtsService.getDebts();
  }

  clearInput():void {
    this.inputValueTitle = '';
    this.inputValueCost = NaN;
  }

  close(){
    this.showAlert = false;
  }


}
