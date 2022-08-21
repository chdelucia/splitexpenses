import { Component, OnInit } from '@angular/core';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { Debt, Expense } from '../shared/models';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  users: Array<string>
  expenses: Map<string, Expense>
  debts: Map<string, Debt>;


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
    console.log(this.debts);
  }



}
