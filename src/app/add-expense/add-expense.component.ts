import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../expenses.service';
import { Expense } from '../models';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.less']
})
export class AddExpenseComponent implements OnInit {
  users: Array<string>
  expenses: Map<string, Expense>
  debts = new Map();
  calc = new Map();

  constructor(private expensesService: ExpensesService) {
    this.users = this.expensesService.getUsers();
    this.expenses = this.expensesService.getExpenses();
  }

  ngOnInit(): void {
    this.calcDebt();
    this.difference();
  }
  
  add(user:string, cost:string, title:string) {
    let costb = parseFloat(cost) / 2;
    const obj: Expense = {
      "title": title,
      "cost": costb,
      "date": new Date().toLocaleDateString('ES', { weekday: 'long', day: 'numeric' }),
      "paidBy": user
    }

    this.expensesService.setExpense(obj);
    this.calcDebt();
    this.difference();
  }

  calcDebt(){
    this.users.map( user => this.debts.set(user, 0))
    let obj = this.expenses.values();

      for (const item of obj) {
        this.users.forEach(userName => {
          if(userName !== item.paidBy){
            let debt = this.debts.get(userName);
            debt = debt + item.cost;
            this.debts.set(userName, debt);
          }
        });
      } 

  }

  difference() {
    let V = this.users[0];
    let J = this.users[1];

    let VDebts = this.debts.get(V);
    let JDebts = this.debts.get(J);

    if (VDebts > JDebts) {
      this.calc.set(J, 0);
      this.calc.set(V, VDebts - JDebts);
    } else {
      this.calc.set(V, 0);
      this.calc.set(J, JDebts - VDebts);
    }
  
  }

}
