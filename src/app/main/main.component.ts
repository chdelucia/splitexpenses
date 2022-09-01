import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../shared/expenses.service';
import { Expense, User } from '../shared/models';
import { UsersService } from '../shared/users.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  users: Array<User>
  expenses: Map<string, Expense>


  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    ) {
    this.users = this.usersService.getIterableUsers();
    this.expenses = this.expensesService.getExpenses();
  }

  ngOnInit(): void {
  }

}
