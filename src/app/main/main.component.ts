import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpensesService } from '../expenses/shared/expenses.service';
import { Expense, User } from '../shared/models';
import { UsersService } from '../users/shared/users.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  users$: Observable<Map<string,User>>;
  expenses$: Observable<Map<string, Expense>>

  isLinear = true;

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    ) {
    this.expenses$ = this.expensesService.getExpenses();
    this.users$ =  this.usersService.getUsers();
  }

  ngOnInit(): void {  }

}
