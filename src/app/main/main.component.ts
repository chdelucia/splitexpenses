import { Component, OnInit } from '@angular/core';
import { DebtsService } from '../shared/debts.service';
import { ExpensesService } from '../shared/expenses.service';
import { Debt, Expense } from '../shared/models';
import { UsersService } from '../shared/users.service';
import { WeatherService } from '../shared/weather.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {
  users: Array<string>
  expenses: Map<string, Expense>
  debts: Map<string, Debt>;
  weatherActive: boolean;

  constructor(
    private expensesService: ExpensesService,
    private usersService: UsersService,
    private debtsService: DebtsService,
    private weatherService: WeatherService
    ) {
    this.users = this.usersService.getUsers();
    this.expenses = this.expensesService.getExpenses();
    this.debts = this.debtsService.getDebts();
    this.weatherActive = this.weatherService.getWeahterSettings().active;

  }

  ngOnInit(): void {
    
  }



}
